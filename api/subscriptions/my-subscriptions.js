/**
 * My Subscriptions API
 * GET /api/subscriptions/my-subscriptions
 * Returns all subscriptions for the authenticated user
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract and verify token
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.userId;

    // Get all subscriptions for the user
    const subscriptionsResult = await query(
      `SELECT 
        id,
        platform,
        status,
        stripe_subscription_id,
        stripe_customer_id,
        current_period_start,
        current_period_end,
        trial_start,
        trial_end,
        selected_plan,
        cancel_at_period_end,
        canceled_at,
        created_at
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      subscriptions: subscriptionsResult.rows
    });

  } catch (error) {
    console.error('My subscriptions error:', error);
    return res.status(500).json({
      error: 'Failed to fetch subscriptions',
      message: error.message
    });
  }
}
