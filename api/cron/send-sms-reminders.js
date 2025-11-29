/**
 * Vercel Cron Job: Send SMS Assessment Reminders
 * Runs daily to send SMS reminders to users
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
 * Send SMS notification
 */
async function sendSMS(phoneNumber, templateType, templateData) {
  try {
    const baseUrl = process.env.VITE_OAUTH_PORTAL_URL || 'https://nexusbiomedical.ai';
    
    const response = await fetch(`${baseUrl}/api/sms/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber,
        templateType,
        templateData
      })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error(`❌ Error sending SMS to ${phoneNumber}:`, error);
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

  console.log('📱 Starting SMS reminder cron job...');
  
  try {
    // Get users with phone numbers who have assessments
    const query = `
      SELECT DISTINCT 
        u.id as user_id,
        u.name as user_name,
        u.phone_number,
        ah.completed_at as last_assessment_date,
        ah.results
      FROM users u
      INNER JOIN assessment_history ah ON u.id = ah.user_id
      WHERE u.phone_number IS NOT NULL
        AND u.sms_notifications_enabled = TRUE
      ORDER BY ah.completed_at DESC
    `;
    
    const result = await pool.query(query);
    const users = result.rows;
    
    console.log(`📊 Found ${users.length} users with SMS enabled`);
    
    let remindersSent = 0;
    let alertsSent = 0;
    
    for (const user of users) {
      const days = daysSince(user.last_assessment_date);
      
      // Send 14-day reminder
      if (days === 14) {
        const success = await sendSMS(
          user.phone_number,
          'assessmentReminder',
          [user.user_name || 'there', 14]
        );
        if (success) remindersSent++;
      }
      
      // Send 30-day reminder
      if (days === 30) {
        const success = await sendSMS(
          user.phone_number,
          'assessmentReminder',
          [user.user_name || 'there', 30]
        );
        if (success) remindersSent++;
      }
      
      // Send high risk alert (only once, within 24 hours of assessment)
      if (days === 0 && user.results?.overallRisk?.score >= 70) {
        const success = await sendSMS(
          user.phone_number,
          'highRiskAlert',
          [user.user_name || 'there', user.results.overallRisk.score]
        );
        if (success) alertsSent++;
      }
    }
    
    const summary = {
      success: true,
      totalUsers: users.length,
      remindersSent,
      alertsSent,
      timestamp: new Date().toISOString()
    };
    
    console.log('✨ SMS reminder cron job complete!', summary);
    
    return res.status(200).json(summary);
    
  } catch (error) {
    console.error('❌ SMS reminder cron job failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
