/**
 * Vercel Cron Job: Send Automated SMS Campaigns
 * Runs daily to send scheduled SMS campaigns (weekly tips, monthly reminders)
 */

import { query } from '../utils/db.js';
import { sendSMS } from '../utils/smsHelper.js';

export default async function handler(req, res) {
  // Verify this is a cron request
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const results = {
      weeklyTips: 0,
      monthlyReminders: 0,
      assessmentReminders: 0,
      errors: []
    };

    const currentDay = new Date().getDay(); // 0=Sunday, 1=Monday, etc.
    const currentDate = new Date().getDate(); // Day of month

    // ===== WEEKLY HEALTH TIPS (Every Monday) =====
    if (currentDay === 1) {
      await sendWeeklyHealthTips(results);
    }

    // ===== MONTHLY ASSESSMENT REMINDER (1st of month) =====
    if (currentDate === 1) {
      await sendMonthlyReminders(results);
    }

    // ===== ASSESSMENT REMINDERS (7, 14, 30 days) =====
    await sendAssessmentReminders(results);

    console.log('[CRON] SMS campaigns job completed:', results);

    return res.status(200).json({
      success: true,
      message: 'SMS campaigns sent',
      results
    });

  } catch (error) {
    console.error('[CRON] SMS campaigns job failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Send weekly health tips to users
 */
async function sendWeeklyHealthTips(results) {
  try {
    // Get a random health tip that hasn't been sent recently
    const tipResult = await query(`
      SELECT id, tip_content, citation, source_journal, publication_year
      FROM sms_health_tips
      WHERE is_active = true
      AND (last_sent_at IS NULL OR last_sent_at < NOW() - INTERVAL '30 days')
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (tipResult.rows.length === 0) {
      console.log('[CRON] No health tips available');
      return;
    }

    const tip = tipResult.rows[0];

    // Get users who want weekly tips
    const usersResult = await query(`
      SELECT id, first_name, phone_number
      FROM users
      WHERE sms_notifications_enabled = true
      AND phone_number IS NOT NULL
      AND notification_preferences->>'weekly_tips' = 'true'
    `);

    console.log(`[CRON] Sending weekly tip to ${usersResult.rows.length} users`);

    for (const user of usersResult.rows) {
      try {
        // Build message with optional citation
        let message = `Hi ${user.first_name || 'there'}! 💡 Weekly Health Tip: ${tip.tip_content}`;
        
        // Add short citation if available (optional - can be toggled via env var)
        if (process.env.SMS_INCLUDE_CITATIONS === 'true' && tip.source_journal && tip.publication_year) {
          message += ` (Source: ${tip.source_journal}, ${tip.publication_year})`;
        }
        
        message += ` Stay proactive about your hormone health! ${process.env.VITE_OAUTH_PORTAL_URL}/dashboard`;

        await sendSMS(user.id, user.phone_number, 'weeklyTips', [user.first_name || 'there']);
        
        // Log campaign send
        await query(`
          INSERT INTO sms_campaign_sends (campaign_id, user_id, phone_number, message_content, status, sent_at)
          SELECT id, $1, $2, $3, 'sent', NOW()
          FROM sms_campaigns
          WHERE campaign_name = 'Weekly Health Tips'
        `, [user.id, user.phone_number, message]);

        results.weeklyTips++;
      } catch (error) {
        console.error(`Failed to send weekly tip to user ${user.id}:`, error);
        results.errors.push({
          userId: user.id,
          type: 'weeklyTips',
          error: error.message
        });
      }
    }

    // Update last_sent_at for this tip
    await query('UPDATE sms_health_tips SET last_sent_at = NOW() WHERE id = $1', [tip.id]);

  } catch (error) {
    console.error('[CRON] Weekly tips error:', error);
    throw error;
  }
}

/**
 * Send monthly assessment reminders
 */
async function sendMonthlyReminders(results) {
  try {
    const usersResult = await query(`
      SELECT id, first_name, phone_number
      FROM users
      WHERE sms_notifications_enabled = true
      AND phone_number IS NOT NULL
      AND notification_preferences->>'monthly_reminder' = 'true'
    `);

    console.log(`[CRON] Sending monthly reminder to ${usersResult.rows.length} users`);

    for (const user of usersResult.rows) {
      try {
        const message = `Hi ${user.first_name || 'there'}! 📆 It's been a month - time for your EndoGuard check-in! Track your hormone health progress: ${process.env.VITE_OAUTH_PORTAL_URL}/endoguard/assessment`;

        await sendSMS(user.id, user.phone_number, 'monthlyReminder', [user.first_name || 'there']);
        
        // Log campaign send
        await query(`
          INSERT INTO sms_campaign_sends (campaign_id, user_id, phone_number, message_content, status, sent_at)
          SELECT id, $1, $2, $3, 'sent', NOW()
          FROM sms_campaigns
          WHERE campaign_name = 'Monthly Assessment Reminder'
        `, [user.id, user.phone_number, message]);

        results.monthlyReminders++;
      } catch (error) {
        console.error(`Failed to send monthly reminder to user ${user.id}:`, error);
        results.errors.push({
          userId: user.id,
          type: 'monthlyReminder',
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error('[CRON] Monthly reminders error:', error);
    throw error;
  }
}

/**
 * Send assessment reminders (7, 14, 30 days)
 */
async function sendAssessmentReminders(results) {
  try {
    // Get users who haven't taken an assessment in 7, 14, or 30 days
    const intervals = [
      { days: 7, message: '7 days' },
      { days: 14, message: '2 weeks' },
      { days: 30, message: '30 days' }
    ];

    for (const interval of intervals) {
      const usersResult = await query(`
        SELECT DISTINCT ON (u.id)
          u.id,
          u.first_name,
          u.phone_number,
          ua.created_at as last_assessment
        FROM users u
        LEFT JOIN user_assessments ua ON u.id = ua.user_id AND ua.platform = 'EndoGuard'
        WHERE u.sms_notifications_enabled = true
        AND u.phone_number IS NOT NULL
        AND u.notification_preferences->>'assessment_reminder' = 'true'
        AND (
          ua.created_at IS NULL 
          OR ua.created_at::date = (CURRENT_DATE - INTERVAL '${interval.days} days')::date
        )
        ORDER BY u.id, ua.created_at DESC
      `);

      console.log(`[CRON] Sending ${interval.days}-day assessment reminder to ${usersResult.rows.length} users`);

      for (const user of usersResult.rows) {
        try {
          const message = `Hi ${user.first_name || 'there'}! 📅 It's been ${interval.message} since your last assessment. Ready to track your hormone health progress? ${process.env.VITE_OAUTH_PORTAL_URL}/endoguard/assessment`;

          await sendSMS(user.id, user.phone_number, 'assessmentReminder', [user.first_name || 'there', interval.days]);
          
          // Log campaign send
          await query(`
            INSERT INTO sms_campaign_sends (campaign_id, user_id, phone_number, message_content, status, sent_at)
            SELECT id, $1, $2, $3, 'sent', NOW()
            FROM sms_campaigns
            WHERE campaign_name = $4
          `, [user.id, user.phone_number, message, `${interval.days}-Day Assessment Reminder`]);

          results.assessmentReminders++;
        } catch (error) {
          console.error(`Failed to send ${interval.days}-day reminder to user ${user.id}:`, error);
          results.errors.push({
            userId: user.id,
            type: `assessmentReminder${interval.days}`,
            error: error.message
          });
        }
      }
    }
  } catch (error) {
    console.error('[CRON] Assessment reminders error:', error);
    throw error;
  }
}
