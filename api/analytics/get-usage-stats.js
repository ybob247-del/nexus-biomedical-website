/**
 * Get Usage Statistics API
 * GET /api/analytics/get-usage-stats?platform=rxguard
 * Returns usage statistics for the authenticated user
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform } = req.query;

    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
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

    // Get trial info
    const trialResult = await query(
      `SELECT trial_start, trial_end, status
       FROM subscriptions
       WHERE user_id = $1 AND platform = $2
       ORDER BY created_at DESC LIMIT 1`,
      [userId, platform]
    );

    const trial = trialResult.rows[0];
    const isTrialing = trial && trial.status === 'trialing';

    // Get usage statistics
    const usageResult = await query(
      `SELECT 
        action,
        COUNT(*) as count,
        MAX(created_at) as last_used
       FROM usage_analytics
       WHERE user_id = $1 AND platform = $2
       GROUP BY action
       ORDER BY count DESC`,
      [userId, platform]
    );

    // Get total actions
    const totalResult = await query(
      `SELECT COUNT(*) as total
       FROM usage_analytics
       WHERE user_id = $1 AND platform = $2`,
      [userId, platform]
    );

    // Get actions by day
    const dailyResult = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
       FROM usage_analytics
       WHERE user_id = $1 AND platform = $2
       GROUP BY DATE(created_at)
       ORDER BY date DESC
       LIMIT 30`,
      [userId, platform]
    );

    // Calculate engagement score (0-100)
    const totalActions = parseInt(totalResult.rows[0]?.total || 0);
    let engagementScore = 0;
    
    if (totalActions > 0) {
      // Simple scoring: more actions = higher score, capped at 100
      engagementScore = Math.min(100, Math.floor((totalActions / 10) * 100));
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalActions,
        engagementScore,
        actionBreakdown: usageResult.rows,
        dailyActivity: dailyResult.rows,
        trial: isTrialing ? {
          daysRemaining: Math.ceil((new Date(trial.trial_end) - new Date()) / (1000 * 60 * 60 * 24)),
          trialEnd: trial.trial_end
        } : null
      }
    });

  } catch (error) {
    console.error('Get usage stats error:', error);
    return res.status(500).json({
      error: 'Failed to get usage statistics',
      message: error.message
    });
  }
}
