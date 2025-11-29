/**
 * Vercel Cron Job: Send Scheduled Drip Campaign Emails
 * Runs daily at 9 AM to send 7, 14, and 30-day follow-up emails
 * 
 * Vercel Cron: https://vercel.com/docs/cron-jobs
 */

import pool from '../../db/pool.js';

/**
 * Calculate days since assessment
 */
function daysSince(date) {
  const now = new Date();
  const assessmentDate = new Date(date);
  const diffTime = Math.abs(now - assessmentDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Send drip campaign email
 */
async function sendDripEmail(campaign, day) {
  try {
    const baseUrl = process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai';
    
    const response = await fetch(`${baseUrl}/api/email/drip-campaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: campaign.email,
        userName: campaign.user_name,
        assessmentDate: campaign.assessment_date,
        riskScore: campaign.risk_score,
        campaignDay: `day${day}`
      })
    });

    const result = await response.json();

    if (result.success) {
      // Update campaign record
      const updateQuery = `
        UPDATE email_campaigns 
        SET day${day}_sent_at = NOW(), 
            day${day}_email_id = $1,
            updated_at = NOW()
        WHERE id = $2
      `;
      await pool.query(updateQuery, [result.emailId, campaign.id]);
      
      console.log(`✅ Sent day ${day} email to ${campaign.email}`);
      return true;
    } else {
      console.error(`❌ Failed to send day ${day} email to ${campaign.email}:`, result.error);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error sending day ${day} email to ${campaign.email}:`, error);
    return false;
  }
}

/**
 * Vercel Cron Handler
 */
export default async function handler(req, res) {
  // Verify cron secret for security
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('🚀 Starting drip campaign email cron job...');
  
  try {
    // Get all active campaigns
    const query = `
      SELECT * FROM email_campaigns 
      WHERE unsubscribed = FALSE
      ORDER BY assessment_date DESC
    `;
    
    const result = await pool.query(query);
    const campaigns = result.rows;
    
    console.log(`📊 Found ${campaigns.length} active campaigns`);
    
    let day7Count = 0;
    let day14Count = 0;
    let day30Count = 0;
    
    for (const campaign of campaigns) {
      const days = daysSince(campaign.assessment_date);
      
      // Send day 7 email (allow 1-day window: days 7-8)
      if (days >= 7 && days <= 8 && !campaign.day7_sent_at) {
        const success = await sendDripEmail(campaign, 7);
        if (success) day7Count++;
      }
      
      // Send day 14 email (allow 1-day window: days 14-15)
      if (days >= 14 && days <= 15 && !campaign.day14_sent_at) {
        const success = await sendDripEmail(campaign, 14);
        if (success) day14Count++;
      }
      
      // Send day 30 email (allow 2-day window: days 30-32)
      if (days >= 30 && days <= 32 && !campaign.day30_sent_at) {
        const success = await sendDripEmail(campaign, 30);
        if (success) day30Count++;
      }
    }
    
    const summary = {
      success: true,
      totalCampaigns: campaigns.length,
      emailsSent: {
        day7: day7Count,
        day14: day14Count,
        day30: day30Count,
        total: day7Count + day14Count + day30Count
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✨ Drip campaign cron job complete!', summary);
    
    return res.status(200).json(summary);
    
  } catch (error) {
    console.error('❌ Drip campaign cron job failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
