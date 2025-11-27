/**
 * Assign A/B Test Variant API
 * POST /api/ab-testing/assign-variant
 * Assigns a random variant to a user for a specific A/B test
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { testName, variants } = req.body;

    if (!testName || !variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ error: 'Test name and variants array are required' });
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

    // Check if user already has a variant for this test
    const existingResult = await query(
      `SELECT variant FROM ab_test_assignments
       WHERE user_id = $1 AND test_name = $2`,
      [userId, testName]
    );

    if (existingResult.rows.length > 0) {
      return res.status(200).json({
        success: true,
        variant: existingResult.rows[0].variant,
        message: 'User already assigned to variant'
      });
    }

    // Assign random variant
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];

    // Store assignment in database
    await query(
      `INSERT INTO ab_test_assignments (user_id, test_name, variant, assigned_at)
       VALUES ($1, $2, $3, NOW())`,
      [userId, testName, randomVariant]
    );

    return res.status(200).json({
      success: true,
      variant: randomVariant
    });

  } catch (error) {
    console.error('Assign variant error:', error);
    return res.status(500).json({
      error: 'Failed to assign variant',
      message: error.message
    });
  }
}
