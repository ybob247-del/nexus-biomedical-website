/**
 * Get Current User API Endpoint
 * GET /api/auth/me
 * Returns the currently authenticated user's information
 */

import { query } from '../utils/db.mjs';
import { extractToken, verifyToken } from '../utils/auth.mjs';

export default async function handler(req, res) {
  // Only allow GET requests
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

    // Get user from database
    const result = await query(
      'SELECT id, email, first_name, last_name, created_at, email_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get user's active subscriptions
    const subscriptions = await query(
      `SELECT platform, status, current_period_end, trial_end, cancel_at_period_end
       FROM subscriptions
       WHERE user_id = $1 AND status IN ('active', 'trialing')`,
      [user.id]
    );

    // Return user data
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
        emailVerified: user.email_verified,
      },
      subscriptions: subscriptions.rows,
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      error: 'Failed to get user information',
      message: error.message,
    });
  }
};

