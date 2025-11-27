/**
 * Get A/B Test Statistics API
 * GET /api/ab-testing/get-stats?test=trial_plan_selection
 * Returns conversion statistics for all variants in an A/B test
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

    // Extract and verify token (admin only)
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get statistics by variant
    const statsResult = await query(
      `SELECT 
        variant,
        COUNT(*) as total_assigned,
        SUM(CASE WHEN converted = true THEN 1 ELSE 0 END) as conversions,
        ROUND(
          (SUM(CASE WHEN converted = true THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100,
          2
        ) as conversion_rate
       FROM ab_test_assignments
       WHERE test_name = $1
       GROUP BY variant
       ORDER BY variant`,
      [test]
    );

    // Get total conversions with metadata
    const conversionsResult = await query(
      `SELECT variant, metadata, converted_at
       FROM ab_test_conversions
       WHERE test_name = $1
       ORDER BY converted_at DESC
       LIMIT 100`,
      [test]
    );

    return res.status(200).json({
      success: true,
      testName: test,
      stats: statsResult.rows,
      recentConversions: conversionsResult.rows
    });

  } catch (error) {
    console.error('Get A/B test stats error:', error);
    return res.status(500).json({
      error: 'Failed to get A/B test statistics',
      message: error.message
    });
  }
}
