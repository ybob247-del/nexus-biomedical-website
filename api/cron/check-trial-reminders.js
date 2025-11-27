/**
 * Trial Reminder Cron Job
 * GET /api/cron/check-trial-reminders
 * Checks for trials that need reminders and sends emails
 * Should be run daily via cron or scheduled task
 */

import { query } from '../utils/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = new Date();
    const remindersSent = {
      midpoint: 0,
      expiring_soon: 0
    };

    // Find all active trials
    const trialsResult = await query(
      `SELECT s.id, s.user_id, s.platform, s.trial_start, s.trial_end, s.selected_plan,
              u.email, u.name
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.status = 'trialing' 
       AND s.trial_end > $1
       ORDER BY s.trial_end ASC`,
      [now]
    );

    for (const trial of trialsResult.rows) {
      const trialStart = new Date(trial.trial_start);
      const trialEnd = new Date(trial.trial_end);
      const totalTrialDays = Math.ceil((trialEnd - trialStart) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
      const daysElapsed = totalTrialDays - daysRemaining;

      // Calculate midpoint (50% of trial period)
      const midpoint = Math.floor(totalTrialDays / 2);

      // Check if we need to send midpoint reminder
      if (daysElapsed === midpoint) {
        // Check if midpoint reminder already sent
        const midpointSent = await query(
          `SELECT id FROM trial_reminders 
           WHERE subscription_id = $1 AND reminder_type = 'midpoint'`,
          [trial.id]
        );

        if (midpointSent.rows.length === 0) {
          // Send midpoint reminder
          try {
            await fetch(`${process.env.VITE_APP_URL || 'http://localhost:3006'}/api/emails/send-trial-reminder`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: trial.user_id,
                platform: trial.platform,
                reminderType: 'midpoint'
              })
            });

            // Record that reminder was sent
            await query(
              `INSERT INTO trial_reminders (subscription_id, reminder_type, sent_at)
               VALUES ($1, 'midpoint', NOW())`,
              [trial.id]
            );

            remindersSent.midpoint++;
          } catch (error) {
            console.error(`Failed to send midpoint reminder for trial ${trial.id}:`, error);
          }
        }
      }

      // Check if we need to send expiring soon reminder (1 day before)
      if (daysRemaining === 1) {
        // Check if expiring_soon reminder already sent
        const expiringSent = await query(
          `SELECT id FROM trial_reminders 
           WHERE subscription_id = $1 AND reminder_type = 'expiring_soon'`,
          [trial.id]
        );

        if (expiringSent.rows.length === 0) {
          // Send expiring soon reminder
          try {
            await fetch(`${process.env.VITE_APP_URL || 'http://localhost:3006'}/api/emails/send-trial-reminder`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: trial.user_id,
                platform: trial.platform,
                reminderType: 'expiring_soon'
              })
            });

            // Record that reminder was sent
            await query(
              `INSERT INTO trial_reminders (subscription_id, reminder_type, sent_at)
               VALUES ($1, 'expiring_soon', NOW())`,
              [trial.id]
            );

            remindersSent.expiring_soon++;
          } catch (error) {
            console.error(`Failed to send expiring soon reminder for trial ${trial.id}:`, error);
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Trial reminder check completed',
      trialsChecked: trialsResult.rows.length,
      remindersSent
    });

  } catch (error) {
    console.error('Trial reminder cron error:', error);
    return res.status(500).json({
      error: 'Failed to check trial reminders',
      message: error.message
    });
  }
}
