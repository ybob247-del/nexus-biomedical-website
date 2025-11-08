/**
 * API: Track Platform Usage
 * POST /api/trial/track-usage
 * 
 * Tracks when a user performs an action on a platform
 * Used to enforce usage limits (e.g., 100 drug checks for RxGuard trial)
 */

import { query } from '../db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform, action, metadata } = req.body;
    
    // Get user from JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.userId;

    // Validate inputs
    const validPlatforms = ['RxGuard', 'PediCalc', 'MedWatch', 'ElderWatch', 'ReguReady', 'ClinicalIQ'];
    if (!platform || !validPlatforms.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform specified' });
    }

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    // First, check if user can access this platform
    const accessResult = await query(
      'SELECT * FROM can_access_platform($1, $2)',
      [userId, platform]
    );

    if (accessResult.rows.length === 0 || !accessResult.rows[0].can_access) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: accessResult.rows[0]?.message || 'You do not have access to this platform'
      });
    }

    // Track usage using database function
    const trackResult = await query(
      'SELECT track_platform_usage($1, $2, $3, $4) as success',
      [userId, platform, action, metadata ? JSON.stringify(metadata) : null]
    );

    if (!trackResult.rows[0].success) {
      return res.status(500).json({ error: 'Failed to track usage' });
    }

    // Get updated usage stats
    const statsResult = await query(
      'SELECT * FROM can_access_platform($1, $2)',
      [userId, platform]
    );

    const stats = statsResult.rows[0];

    // Return success with updated stats
    return res.status(200).json({
      success: true,
      message: 'Usage tracked successfully',
      stats: {
        platform: platform,
        action: action,
        usageCount: stats.usage_count,
        usageLimit: stats.usage_limit,
        usageRemaining: stats.usage_limit - stats.usage_count,
        trialDaysRemaining: stats.trial_days_remaining,
        accessType: stats.access_type
      }
    });

  } catch (error) {
    console.error('Error tracking usage:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to track usage. Please try again later.'
    });
  }
}

