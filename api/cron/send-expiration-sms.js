/**
 * Vercel Cron Job: Send Trial & Subscription Expiration SMS
 * Runs daily to check for expiring trials and subscriptions
 * Sends SMS notifications at 3 days, 1 day before expiration
 */

import { query } from '../utils/db.js';
import { sendSMSToUser } from '../utils/smsHelper.js';

export default async function handler(req, res) {
  // Verify this is a cron request
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const results = {
      trialExpiring3Days: 0,
      trialExpiring1Day: 0,
      subscriptionExpiring3Days: 0,
      subscriptionExpiring1Day: 0,
      errors: []
    };

    // ===== CHECK TRIALS EXPIRING IN 3 DAYS =====
    const trials3Days = await query(`
      SELECT 
        s.user_id,
        s.platform,
        s.trial_end,
        u.first_name,
        u.email
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = 'trialing'
        AND s.trial_end IS NOT NULL
        AND s.trial_end::date = (CURRENT_DATE + INTERVAL '3 days')::date
        AND u.sms_notifications_enabled = true
        AND u.phone_number IS NOT NULL
    `);

    for (const trial of trials3Days.rows) {
      try {
        await sendSMSToUser(
          trial.user_id,
          'trialExpiring3Days',
          [3] // daysLeft parameter for bilingual template
        );
        results.trialExpiring3Days++;
      } catch (error) {
        console.error(`Failed to send 3-day trial SMS to user ${trial.user_id}:`, error);
        results.errors.push({
          userId: trial.user_id,
          type: 'trialExpiring3Days',
          error: error.message
        });
      }
    }

    // ===== CHECK TRIALS EXPIRING IN 1 DAY =====
    const trials1Day = await query(`
      SELECT 
        s.user_id,
        s.platform,
        s.trial_end,
        u.first_name,
        u.email
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = 'trialing'
        AND s.trial_end IS NOT NULL
        AND s.trial_end::date = (CURRENT_DATE + INTERVAL '1 day')::date
        AND u.sms_notifications_enabled = true
        AND u.phone_number IS NOT NULL
    `);

    for (const trial of trials1Day.rows) {
      try {
        await sendSMSToUser(
          trial.user_id,
          'trialExpiring1Day',
          [1] // daysLeft parameter for bilingual template
        );
        results.trialExpiring1Day++;
      } catch (error) {
        console.error(`Failed to send 1-day trial SMS to user ${trial.user_id}:`, error);
        results.errors.push({
          userId: trial.user_id,
          type: 'trialExpiring1Day',
          error: error.message
        });
      }
    }

    // ===== CHECK SUBSCRIPTIONS EXPIRING IN 3 DAYS =====
    const subs3Days = await query(`
      SELECT 
        s.user_id,
        s.platform,
        s.current_period_end,
        u.first_name,
        u.email
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = 'active'
        AND s.cancel_at_period_end = true
        AND s.current_period_end IS NOT NULL
        AND s.current_period_end::date = (CURRENT_DATE + INTERVAL '3 days')::date
        AND u.sms_notifications_enabled = true
        AND u.phone_number IS NOT NULL
    `);

    for (const sub of subs3Days.rows) {
      try {
        await sendSMSToUser(
          sub.user_id,
          'subscriptionExpiring3Days',
          [sub.first_name || 'there', sub.platform]
        );
        results.subscriptionExpiring3Days++;
      } catch (error) {
        console.error(`Failed to send 3-day subscription SMS to user ${sub.user_id}:`, error);
        results.errors.push({
          userId: sub.user_id,
          type: 'subscriptionExpiring3Days',
          error: error.message
        });
      }
    }

    // ===== CHECK SUBSCRIPTIONS EXPIRING IN 1 DAY =====
    const subs1Day = await query(`
      SELECT 
        s.user_id,
        s.platform,
        s.current_period_end,
        u.first_name,
        u.email
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      WHERE s.status = 'active'
        AND s.cancel_at_period_end = true
        AND s.current_period_end IS NOT NULL
        AND s.current_period_end::date = (CURRENT_DATE + INTERVAL '1 day')::date
        AND u.sms_notifications_enabled = true
        AND u.phone_number IS NOT NULL
    `);

    for (const sub of subs1Day.rows) {
      try {
        await sendSMSToUser(
          sub.user_id,
          'subscriptionExpiring1Day',
          [sub.first_name || 'there', sub.platform]
        );
        results.subscriptionExpiring1Day++;
      } catch (error) {
        console.error(`Failed to send 1-day subscription SMS to user ${sub.user_id}:`, error);
        results.errors.push({
          userId: sub.user_id,
          type: 'subscriptionExpiring1Day',
          error: error.message
        });
      }
    }

    console.log('[CRON] Expiration SMS job completed:', results);

    return res.status(200).json({
      success: true,
      message: 'Expiration SMS notifications sent',
      results
    });

  } catch (error) {
    console.error('[CRON] Expiration SMS job failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
