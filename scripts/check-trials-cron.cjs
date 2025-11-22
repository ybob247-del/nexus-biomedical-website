/**
 * Trial Reminder Cron Job
 * Runs daily to check trial status and send reminder emails
 * 
 * Schedule: Run daily at 9 AM
 * Command: node scripts/check-trials-cron.mjs
 */

const { Pool } = require('pg');
const { sendTrialReminderEmail, sendTrialExpiredEmail } = require('../api/utils/emailService.js');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function checkTrialsAndSendReminders() {
  console.log('[Trial Cron] Starting trial check...', new Date().toISOString());

  try {
    // Get all active trials
    const trialsResult = await pool.query(`
      SELECT 
        pt.id,
        pt.user_id,
        pt.platform,
        pt.trial_end_date,
        pt.trial_status,
        u.email,
        u.first_name,
        u.last_name
      FROM platform_trials pt
      JOIN users u ON u.id = pt.user_id
      WHERE pt.trial_status = 'active'
      ORDER BY pt.trial_end_date ASC
    `);

    const trials = trialsResult.rows;
    console.log(`[Trial Cron] Found ${trials.length} active trials`);

    const now = new Date();
    let remindersSent = 0;
    let expiredNotificationsSent = 0;

    for (const trial of trials) {
      const endDate = new Date(trial.trial_end_date);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

      console.log(`[Trial Cron] ${trial.platform} for ${trial.email}: ${daysRemaining} days remaining`);

      // Trial expired
      if (daysRemaining <= 0) {
        console.log(`[Trial Cron] Trial expired for ${trial.email} - ${trial.platform}`);
        
        // Update trial status to expired
        await pool.query(
          `UPDATE platform_trials 
           SET trial_status = 'expired', updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [trial.id]
        );

        // Send expiration email
        try {
          await sendTrialExpiredEmail({
            email: trial.email,
            firstName: trial.first_name,
            platform: trial.platform
          });
          expiredNotificationsSent++;
          console.log(`[Trial Cron] Sent expiration email to ${trial.email}`);
        } catch (error) {
          console.error(`[Trial Cron] Failed to send expiration email to ${trial.email}:`, error);
        }

        continue;
      }

      // Check if we should send reminder
      const shouldSendReminder = shouldSendReminderForTrial(trial.platform, daysRemaining);

      if (shouldSendReminder) {
        // Check if we already sent a reminder for this milestone
        const lastReminderResult = await pool.query(
          `SELECT created_at FROM trial_reminders 
           WHERE trial_id = $1 AND days_remaining = $2
           LIMIT 1`,
          [trial.id, daysRemaining]
        );

        if (lastReminderResult.rows.length > 0) {
          console.log(`[Trial Cron] Already sent reminder for ${daysRemaining} days to ${trial.email}`);
          continue;
        }

        // Send reminder email
        try {
          await sendTrialReminderEmail({
            email: trial.email,
            firstName: trial.first_name,
            platform: trial.platform,
            daysRemaining,
            trialEndDate: trial.trial_end_date
          });

          // Record that we sent this reminder
          await pool.query(
            `INSERT INTO trial_reminders (trial_id, days_remaining, created_at)
             VALUES ($1, $2, CURRENT_TIMESTAMP)`,
            [trial.id, daysRemaining]
          );

          remindersSent++;
          console.log(`[Trial Cron] Sent reminder email to ${trial.email} (${daysRemaining} days remaining)`);
        } catch (error) {
          console.error(`[Trial Cron] Failed to send reminder to ${trial.email}:`, error);
        }
      }
    }

    console.log(`[Trial Cron] Complete: ${remindersSent} reminders sent, ${expiredNotificationsSent} expiration notifications sent`);

  } catch (error) {
    console.error('[Trial Cron] Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

/**
 * Determine if we should send a reminder for this trial
 * RxGuard (14 days): Remind at 7 days (50%), 3 days (25%), 1 day
 * EndoGuard (30 days): Remind at 15 days (50%), 7 days (25%), 1 day
 */
function shouldSendReminderForTrial(platform, daysRemaining) {
  if (platform === 'RxGuard') {
    return [7, 3, 1].includes(daysRemaining);
  } else if (platform === 'EndoGuard') {
    return [15, 7, 1].includes(daysRemaining);
  }
  return false;
}

// Run the cron job
checkTrialsAndSendReminders()
  .then(() => {
    console.log('[Trial Cron] Job completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[Trial Cron] Job failed:', error);
    process.exit(1);
  });
