/**
 * Admin Analytics API
 * GET /api/admin/analytics
 * Returns key business metrics and statistics
 */

import { query } from '../utils/db.js';
const { verifyToken } = require('../utils/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Get analytics data
    const analytics = {};

    // Total users
    const usersResult = await query('SELECT COUNT(*) as count FROM users');
    analytics.totalUsers = parseInt(usersResult.rows[0].count);

    // Active trials
    const activeTrialsResult = await query(
      `SELECT platform, COUNT(*) as count
       FROM platform_trials
       WHERE trial_status = 'active'
       GROUP BY platform`
    );
    analytics.activeTrials = activeTrialsResult.rows;
    analytics.totalActiveTrials = activeTrialsResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);

    // Subscriptions
    const subscriptionsResult = await query(
      `SELECT platform, COUNT(*) as count
       FROM subscriptions
       WHERE status = 'active'
       GROUP BY platform`
    );
    analytics.activeSubscriptions = subscriptionsResult.rows;
    analytics.totalActiveSubscriptions = subscriptionsResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);

    // Trial to paid conversion rate
    const expiredTrialsResult = await query(
      `SELECT COUNT(*) as count FROM platform_trials WHERE trial_status = 'expired'`
    );
    const expiredTrials = parseInt(expiredTrialsResult.rows[0].count);
    analytics.conversionRate = expiredTrials > 0 
      ? ((analytics.totalActiveSubscriptions / expiredTrials) * 100).toFixed(2)
      : 0;

    // Waitlist stats
    const waitlistResult = await query(
      `SELECT platform, COUNT(*) as count, 
       SUM(CASE WHEN notified = TRUE THEN 1 ELSE 0 END) as notified_count
       FROM waitlist
       GROUP BY platform`
    );
    analytics.waitlistStats = waitlistResult.rows;
    analytics.totalWaitlist = waitlistResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);

    // EndoGuard assessments
    const assessmentsResult = await query(
      `SELECT COUNT(*) as count FROM user_assessments`
    );
    analytics.totalAssessments = parseInt(assessmentsResult.rows[0].count);

    // RxGuard medication lists
    const medicationsResult = await query(
      `SELECT COUNT(*) as count FROM user_medication_lists`
    );
    analytics.totalMedicationLists = parseInt(medicationsResult.rows[0].count);

    // User growth (last 30 days)
    const userGrowthResult = await query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM users
       WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );
    analytics.userGrowth = userGrowthResult.rows;

    // Trial reminders sent
    const remindersResult = await query(
      `SELECT COUNT(*) as count FROM trial_reminders`
    );
    analytics.totalRemindersSent = parseInt(remindersResult.rows[0].count);

    return res.status(200).json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
}
