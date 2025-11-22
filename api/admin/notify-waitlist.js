/**
 * Bulk Email API for Waitlist Launch Notifications
 * POST /api/admin/notify-waitlist
 * Sends launch announcement emails to all users on a platform's waitlist
 */

const { query } = require('../utils/db');
const { verifyToken } = require('../utils/auth');
const { sendPlatformLaunchEmail } = require('../utils/emailService');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin (owner)
    const userResult = await query(
      'SELECT id, email, open_id FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const ownerOpenId = process.env.OWNER_OPEN_ID;

    if (user.open_id !== ownerOpenId) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get request body
    const { platform, subject, message } = req.body;

    if (!platform || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: platform, subject, message' 
      });
    }

    // Get all waitlist entries for this platform that haven't been notified
    const waitlistResult = await query(
      `SELECT id, email, first_name, last_name
       FROM waitlist
       WHERE platform = $1 AND notified = FALSE
       ORDER BY created_at ASC`,
      [platform]
    );

    const waitlistEntries = waitlistResult.rows;

    if (waitlistEntries.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No pending notifications for this platform',
        sent: 0
      });
    }

    console.log(`[Waitlist Notify] Sending ${waitlistEntries.length} emails for ${platform}`);

    let sentCount = 0;
    const errors = [];

    // Send emails
    for (const entry of waitlistEntries) {
      try {
        await sendPlatformLaunchEmail({
          email: entry.email,
          firstName: entry.first_name,
          platform,
          customMessage: message
        });

        // Mark as notified
        await query(
          `UPDATE waitlist
           SET notified = TRUE, notified_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [entry.id]
        );

        sentCount++;
        console.log(`[Waitlist Notify] Sent to ${entry.email}`);

      } catch (error) {
        console.error(`[Waitlist Notify] Failed to send to ${entry.email}:`, error);
        errors.push({
          email: entry.email,
          error: error.message
        });
      }
    }

    console.log(`[Waitlist Notify] Complete: ${sentCount}/${waitlistEntries.length} sent`);

    return res.status(200).json({
      success: true,
      sent: sentCount,
      total: waitlistEntries.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Notify waitlist error:', error);
    return res.status(500).json({
      error: 'Failed to send notifications',
      message: error.message
    });
  }
};
