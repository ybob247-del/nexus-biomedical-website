/**
 * Check Platform Access API
 * GET /api/platform-access/check?platform=RxGuard
 * Checks if user has access to a specific platform (trial or subscription)
 */

import { query } from '../utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    const { platform } = req.query;

    if (!platform) {
      return res.status(400).json({ error: 'Platform parameter is required' });
    }

    // Check if user has active subscription
    let subscriptionResult;
    try {
      subscriptionResult = await query(
        `SELECT s.id, s.status, s.current_period_end
         FROM subscriptions s
         JOIN platform_access pa ON pa.subscription_id = s.id
         WHERE pa.user_id = $1 
           AND pa.platform = $2 
           AND pa.is_active = TRUE
           AND s.status = 'active'
         LIMIT 1`,
        [userId, platform]
      );
    } catch (dbError) {
      console.warn('Database query failed (tables may not exist):', dbError.message);
      // Tables don't exist - return no access gracefully
      return res.status(200).json({
        hasAccess: false,
        accessType: 'none',
        message: 'No active trial or subscription found. Please start a free trial or subscribe.'
      });
    }

    if (subscriptionResult.rows.length > 0) {
      return res.status(200).json({
        hasAccess: true,
        accessType: 'subscription',
        subscription: subscriptionResult.rows[0],
        message: 'Full access via subscription'
      });
    }

    // Check if user has active trial
    let trialResult;
    try {
      trialResult = await query(
        `SELECT id, trial_start_date, trial_end_date, trial_status
         FROM platform_trials
         WHERE user_id = $1 AND platform = $2
         LIMIT 1`,
        [userId, platform]
      );
    } catch (dbError) {
      console.warn('Database query failed (tables may not exist):', dbError.message);
      // Tables don't exist - return no access gracefully
      return res.status(200).json({
        hasAccess: false,
        accessType: 'none',
        message: 'No active trial or subscription found. Please start a free trial or subscribe.'
      });
    }

    if (trialResult.rows.length > 0) {
      const trial = trialResult.rows[0];
      const now = new Date();
      const endDate = new Date(trial.trial_end_date);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

      if (trial.trial_status === 'active' && endDate > now) {
        return res.status(200).json({
          hasAccess: true,
          accessType: 'trial',
          daysRemaining,
          trialEndDate: trial.trial_end_date,
          message: `Free trial: ${daysRemaining} days remaining`
        });
      } else {
        return res.status(200).json({
          hasAccess: false,
          accessType: 'trial_expired',
          message: 'Your free trial has expired. Please subscribe to continue.'
        });
      }
    }

    // No access
    return res.status(200).json({
      hasAccess: false,
      accessType: 'none',
      message: 'No active trial or subscription found. Please start a free trial or subscribe.'
    });

  } catch (error) {
    console.error('Platform access check error:', error);
    return res.status(500).json({
      error: 'Failed to check platform access',
      message: error.message
    });
  }
}
