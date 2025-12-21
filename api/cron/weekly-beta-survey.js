const { query } = require('../utils/db');
const { sendEmail } = require('../utils/email');

// This endpoint will be called weekly by a cron job
// Beta period: Jan 3, 2026 - Feb 28, 2026 (8 weeks)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify cron secret
    const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const betaStartDate = new Date('2026-01-03');
    const betaEndDate = new Date('2026-02-28');
    const today = new Date();

    // Calculate which week we're in
    const weeksSinceStart = Math.floor((today - betaStartDate) / (7 * 24 * 60 * 60 * 1000)) + 1;

    if (weeksSinceStart < 1 || weeksSinceStart > 8) {
      return res.json({ 
        success: true, 
        message: 'Outside beta period',
        week: weeksSinceStart 
      });
    }

    // Get all beta testers (users with beta access)
    const betaTesters = await query(`
      SELECT DISTINCT u.id, u.email, u.first_name, u.last_name
      FROM users u
      WHERE u.id IN (
        SELECT user_id FROM user_subscriptions WHERE status = 'active'
        UNION
        SELECT user_id FROM provider_invitations WHERE status = 'accepted'
      )
    `);

    let sentCount = 0;
    let errors = [];

    for (const user of betaTesters.rows) {
      try {
        // Check if survey already sent for this week
        const existing = await query(`
          SELECT id FROM beta_survey_schedule
          WHERE user_id = $1 AND week_number = $2
        `, [user.id, weeksSinceStart]);

        if (existing.rows.length === 0) {
          // Create survey schedule entry
          await query(`
            INSERT INTO beta_survey_schedule (user_id, week_number, scheduled_date, sent_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          `, [user.id, weeksSinceStart, today]);

          // Send email with survey link
          const surveyUrl = `${process.env.VITE_APP_URL || 'https://nexusbiomedical.ai'}/beta/survey?week=${weeksSinceStart}`;
          
          await sendEmail({
            to: user.email,
            subject: `Week ${weeksSinceStart} Beta Feedback - Nexus Biomedical`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00A8CC;">Week ${weeksSinceStart} Beta Feedback</h2>
                <p>Hi ${user.first_name},</p>
                <p>Thank you for being part of our beta testing program! We'd love to hear your feedback this week.</p>
                <p>This quick survey takes just 3-5 minutes and helps us improve EndoGuard and RxGuard.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${surveyUrl}" style="background: linear-gradient(135deg, #00A8CC 0%, #5B2C87 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
                    Take Week ${weeksSinceStart} Survey
                  </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                  Your feedback is invaluable in helping us create better healthcare tools.
                </p>
                <p style="color: #666; font-size: 14px;">
                  Beta Period: Jan 3 - Feb 28, 2026 (Week ${weeksSinceStart} of 8)
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                  Nexus Biomedical Intelligence<br>
                  support@nexusbiomedical.ai
                </p>
              </div>
            `
          });

          sentCount++;
        }
      } catch (error) {
        console.error(`Error sending survey to ${user.email}:`, error);
        errors.push({ email: user.email, error: error.message });
      }
    }

    res.json({
      success: true,
      week: weeksSinceStart,
      sent_count: sentCount,
      total_beta_testers: betaTesters.rows.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in weekly beta survey cron:', error);
    res.status(500).json({ error: 'Failed to send surveys', details: error.message });
  }
};
