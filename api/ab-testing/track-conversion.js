/**
 * Track A/B Test Conversion API
 * POST /api/ab-testing/track-conversion
 * Records when a user converts (e.g., completes trial signup, upgrades to paid)
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { testName, variant, metadata } = req.body;

    if (!testName || !variant) {
      return res.status(400).json({ error: 'Test name and variant are required' });
    }

    // Extract and verify token (optional for anonymous conversions)
    const token = extractToken(req);
    let userId = null;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    // Record conversion
    await query(
      `INSERT INTO ab_test_conversions (
        user_id,
        test_name,
        variant,
        metadata,
        converted_at
      ) VALUES ($1, $2, $3, $4, NOW())`,
      [userId, testName, variant, JSON.stringify(metadata || {})]
    );

    // Update assignment with conversion flag if user is authenticated
    if (userId) {
      await query(
        `UPDATE ab_test_assignments
         SET converted = true, converted_at = NOW()
         WHERE user_id = $1 AND test_name = $2`,
        [userId, testName]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Conversion tracked successfully'
    });

  } catch (error) {
    console.error('Track conversion error:', error);
    // Don't fail the request if conversion tracking fails
    return res.status(200).json({
      success: false,
      message: 'Conversion tracking failed but request continued'
    });
  }
}
