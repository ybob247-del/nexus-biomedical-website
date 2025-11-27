/**
 * Get A/B Test Variant API
 * GET /api/ab-testing/get-variant?test=trial_plan_selection
 * Returns the assigned variant for a user in a specific A/B test
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { test } = req.query;

    if (!test) {
      return res.status(400).json({ error: 'Test name is required' });
    }

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

    // Get user's variant assignment
    const result = await query(
      `SELECT variant
       FROM ab_test_assignments
       WHERE user_id = $1 AND test_name = $2`,
      [userId, test]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'No variant assigned for this test' 
      });
    }

    return res.status(200).json({
      success: true,
      variant: result.rows[0].variant
    });

  } catch (error) {
    console.error('Get variant error:', error);
    return res.status(500).json({
      error: 'Failed to get variant',
      message: error.message
    });
  }
}
