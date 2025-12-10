/**
 * Goal Reminder Cron Job
 * Runs every hour to send goal reminders to users
 * Checks for goals that are due for a reminder and sends SMS + Email
 */

import mysql from 'mysql2/promise';
import { Resend } from 'resend';
import twilio from 'twilio';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '4000'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req, res) {
  // Verify this is a cron job request (you can add authentication here)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = new Date();
    
    // Find all goals that need reminders
    const [goals] = await pool.execute(
      `SELECT 
        g.*,
        u.email,
        u.phone_number,
        u.name
      FROM user_goals g
      JOIN users u ON g.user_id = u.id
      WHERE g.status = 'active'
        AND g.next_reminder_due <= ?
        AND (g.last_reminder_sent IS NULL OR g.last_reminder_sent < g.next_reminder_due)
      ORDER BY g.next_reminder_due ASC
      LIMIT 100`,
      [now]
    );

    const results = {
      total: goals.length,
      emailsSent: 0,
      smsSent: 0,
      errors: []
    };

    for (const goal of goals) {
      try {
        // Calculate progress percentage
        const progress = goal.target_value && goal.current_value
          ? Math.round((goal.current_value / goal.target_value) * 100)
          : 0;

        const daysUntilTarget = Math.ceil(
          (new Date(goal.target_date) - now) / (1000 * 60 * 60 * 24)
        );

        // Send Email
        if (goal.email) {
          try {
            await resend.emails.send({
              from: 'EndoGuard <noreply@manus.space>',
              to: goal.email,
              subject: `🎯 Goal Reminder: ${goal.title}`,
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #D946EF 0%, #C026D3 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .goal-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D946EF; }
                    .progress-bar { background: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden; margin: 10px 0; }
                    .progress-fill { background: linear-gradient(90deg, #D946EF 0%, #C026D3 100%); height: 100%; }
                    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
                    .stat { text-align: center; }
                    .stat-value { font-size: 24px; font-weight: bold; color: #D946EF; }
                    .stat-label { font-size: 12px; color: #6b7280; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #D946EF 0%, #C026D3 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>🎯 Goal Reminder</h1>
                      <p>Stay on track with your health goals!</p>
                    </div>
                    <div class="content">
                      <p>Hi ${goal.name || 'there'},</p>
                      <p>This is your ${goal.reminder_frequency} reminder about your health goal:</p>
                      
                      <div class="goal-card">
                        <h2>${goal.title}</h2>
                        ${goal.description ? `<p>${goal.description}</p>` : ''}
                        
                        ${goal.target_value ? `
                          <div class="stats">
                            <div class="stat">
                              <div class="stat-value">${goal.current_value || 0} ${goal.unit}</div>
                              <div class="stat-label">Current</div>
                            </div>
                            <div class="stat">
                              <div class="stat-value">${goal.target_value} ${goal.unit}</div>
                              <div class="stat-label">Target</div>
                            </div>
                            <div class="stat">
                              <div class="stat-value">${progress}%</div>
                              <div class="stat-label">Progress</div>
                            </div>
                          </div>
                          <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                          </div>
                        ` : ''}
                        
                        <p><strong>Target Date:</strong> ${new Date(goal.target_date).toLocaleDateString()}</p>
                        <p><strong>Days Remaining:</strong> ${daysUntilTarget} days</p>
                      </div>
                      
                      <p><strong>Keep going!</strong> ${
                        progress >= 75 
                          ? "You're almost there! Keep up the great work!" 
                          : progress >= 50 
                          ? "You're halfway to your goal. Stay consistent!" 
                          : "Every step counts. You've got this!"
                      }</p>
                      
                      <center>
                        <a href="${process.env.VITE_APP_URL || 'https://nexusbiomedical.manus.space'}/goals" class="cta-button">
                          Update Your Progress
                        </a>
                      </center>
                      
                      <div class="footer">
                        <p>You're receiving this because you set up goal reminders in EndoGuard.</p>
                        <p>To manage your goals or change reminder frequency, visit your <a href="${process.env.VITE_APP_URL || 'https://nexusbiomedical.manus.space'}/goals">Goals Dashboard</a>.</p>
                      </div>
                    </div>
                  </div>
                </body>
                </html>
              `
            });
            results.emailsSent++;
          } catch (emailError) {
            console.error(`Email error for goal ${goal.id}:`, emailError);
            results.errors.push({ goalId: goal.id, type: 'email', error: emailError.message });
          }
        }

        // Send SMS if phone number exists
        if (goal.phone_number) {
          try {
            const smsMessage = `🎯 Goal Reminder: "${goal.title}"\n\n${
              goal.target_value 
                ? `Progress: ${goal.current_value || 0}/${goal.target_value} ${goal.unit} (${progress}%)\n` 
                : ''
            }Days left: ${daysUntilTarget}\n\nUpdate your progress: ${process.env.VITE_APP_URL || 'https://nexusbiomedical.manus.space'}/goals`;

            await twilioClient.messages.create({
              body: smsMessage,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: goal.phone_number
            });
            results.smsSent++;
          } catch (smsError) {
            console.error(`SMS error for goal ${goal.id}:`, smsError);
            results.errors.push({ goalId: goal.id, type: 'sms', error: smsError.message });
          }
        }

        // Update goal with new reminder dates
        const nextReminderDue = new Date(now);
        switch (goal.reminder_frequency) {
          case 'daily':
            nextReminderDue.setDate(nextReminderDue.getDate() + 1);
            break;
          case 'weekly':
            nextReminderDue.setDate(nextReminderDue.getDate() + 7);
            break;
          case 'biweekly':
            nextReminderDue.setDate(nextReminderDue.getDate() + 14);
            break;
          case 'monthly':
            nextReminderDue.setMonth(nextReminderDue.getMonth() + 1);
            break;
          default:
            nextReminderDue.setDate(nextReminderDue.getDate() + 7);
        }

        await pool.execute(
          `UPDATE user_goals 
          SET last_reminder_sent = ?, next_reminder_due = ?
          WHERE id = ?`,
          [now, nextReminderDue, goal.id]
        );

        // Log reminder in goal_reminders table
        await pool.execute(
          `INSERT INTO goal_reminders (goal_id, reminder_type, scheduled_for, sent_at, status)
          VALUES (?, ?, ?, ?, ?)`,
          [goal.id, 'scheduled', goal.next_reminder_due, now, 'sent']
        );

      } catch (goalError) {
        console.error(`Error processing goal ${goal.id}:`, goalError);
        results.errors.push({ goalId: goal.id, type: 'processing', error: goalError.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Goal reminders processed',
      results
    });

  } catch (error) {
    console.error('Goal reminders cron error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
