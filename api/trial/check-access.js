/**
 * API: Check Platform Access
 * GET /api/trial/check-access?platform=RxGuard
 * 
 * Checks if user can access a specific platform
 * Returns: access status, type (paid/trial/beta/none), usage stats
 */

import { query } from '../db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform } = req.query;
    
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

    // Validate platform
    const validPlatforms = ['RxGuard', 'PediCalc', 'MedWatch', 'ElderWatch', 'ReguReady', 'ClinicalIQ'];
    if (!platform || !validPlatforms.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform specified' });
    }

    // Check access using database function
    const accessResult = await query(
      'SELECT * FROM can_access_platform($1, $2)',
      [userId, platform]
    );

    if (accessResult.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to check access' });
    }

    const access = accessResult.rows[0];

    // Return access details
    return res.status(200).json({
      platform: platform,
      canAccess: access.can_access,
      accessType: access.access_type,
      trialDaysRemaining: access.trial_days_remaining,
      usageCount: access.usage_count,
      usageLimit: access.usage_limit,
      message: access.message
    });

  } catch (error) {
    console.error('Error checking access:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to check access. Please try again later.'
    });
  }
}

