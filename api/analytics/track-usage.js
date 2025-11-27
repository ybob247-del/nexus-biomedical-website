/**
 * Usage Analytics Tracking API
 * POST /api/analytics/track-usage
 * Tracks user actions and feature usage during trial period
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform, action, metadata } = req.body;

    if (!platform || !action) {
      return res.status(400).json({ error: 'Platform and action are required' });
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

    // Record the usage event
    await query(
      `INSERT INTO usage_analytics (
        user_id,
        platform,
        action,
        metadata,
        created_at
      ) VALUES ($1, $2, $3, $4, NOW())`,
      [userId, platform, action, JSON.stringify(metadata || {})]
    );

    return res.status(200).json({
      success: true,
      message: 'Usage tracked successfully'
    });

  } catch (error) {
    console.error('Usage tracking error:', error);
    // Don't fail the request if analytics tracking fails
    return res.status(200).json({
      success: false,
      message: 'Analytics tracking failed but request continued'
    });
  }
}
