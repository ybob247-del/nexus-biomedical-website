/**
 * Start Platform Trial API Endpoint
 * POST /api/trials/start
 * Starts a free trial for a platform
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
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

    const { platformId } = req.body;

    if (!platformId) {
      return res.status(400).json({ error: 'Platform ID is required' });
    }

    // Check if user's email is verified
    const userResult = await query(
      'SELECT id, email_verified_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    if (!user.email_verified_at) {
      return res.status(403).json({ error: 'Email verification required to start trial' });
    }

    // Check if user already has an active trial for this platform
    const existingTrial = await query(
      `SELECT id, trial_end FROM platform_trials
       WHERE user_id = $1 AND platform_id = $2`,
      [decoded.userId, platformId]
    );

    if (existingTrial.rows.length > 0) {
      const trial = existingTrial.rows[0];
      const trialEnd = new Date(trial.trial_end);
      const now = new Date();

      if (trialEnd > now) {
        return res.status(400).json({
          error: 'You already have an active trial for this platform',
          trial_end: trial.trial_end
        });
      }
    }

    // Define trial parameters based on platform
    const trialParams = {
      'rxguard': { duration: 14, usage_limit: 100 },
      'endoguard': { duration: 14, usage_limit: 50 },
      'elderwatch': { duration: 14, usage_limit: null },
    };

    const params = trialParams[platformId];
    if (!params) {
      return res.status(400).json({ error: 'Invalid platform ID' });
    }

    // Calculate trial end date
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + params.duration);

    // Create or update trial
    if (existingTrial.rows.length > 0) {
      // Update existing expired trial
      await query(
        `UPDATE platform_trials
         SET trial_start = $1, trial_end = $2, usage_count = 0, usage_limit = $3
         WHERE id = $4`,
        [trialStart, trialEnd, params.usage_limit, existingTrial.rows[0].id]
      );
    } else {
      // Create new trial
      await query(
        `INSERT INTO platform_trials (user_id, platform_id, trial_start, trial_end, usage_count, usage_limit)
         VALUES ($1, $2, $3, $4, 0, $5)`,
        [decoded.userId, platformId, trialStart, trialEnd, params.usage_limit]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Trial started successfully',
      trial: {
        platform_id: platformId,
        trial_start: trialStart,
        trial_end: trialEnd,
        usage_limit: params.usage_limit
      }
    });

  } catch (error) {
    console.error('Start trial error:', error);
    return res.status(500).json({
      error: 'Failed to start trial',
      message: error.message,
    });
  }
}
