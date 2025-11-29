/**
 * Cron Job: Send Scheduled Drip Campaign Emails
 * Run this script daily to send 7, 14, and 30-day follow-up emails
 * 
 * Usage: node scripts/send-drip-emails.js
 * Cron: 0 9 * * * (Daily at 9 AM)
 */

import pool from '../db/pool.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const response = await fetch(`${process.env.VITE_OAUTH_PORTAL_URL || 'http://localhost:3006'}/api/email/drip-campaign`, {
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
 * Main function
 */
async function main() {
  console.log('🚀 Starting drip campaign email job...');
  
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
      
      // Send day 7 email
      if (days >= 7 && !campaign.day7_sent_at) {
        const success = await sendDripEmail(campaign, 7);
        if (success) day7Count++;
      }
      
      // Send day 14 email
      if (days >= 14 && !campaign.day14_sent_at) {
        const success = await sendDripEmail(campaign, 14);
        if (success) day14Count++;
      }
      
      // Send day 30 email
      if (days >= 30 && !campaign.day30_sent_at) {
        const success = await sendDripEmail(campaign, 30);
        if (success) day30Count++;
      }
    }
    
    console.log('✨ Drip campaign job complete!');
    console.log(`📧 Sent ${day7Count} day-7 emails`);
    console.log(`📧 Sent ${day14Count} day-14 emails`);
    console.log(`📧 Sent ${day30Count} day-30 emails`);
    
  } catch (error) {
    console.error('❌ Drip campaign job failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the job
main();
