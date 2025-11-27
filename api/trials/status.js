/**
 * Trial Status API
 * POST /api/trials/status
 * Returns the current trial status for a user and platform
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform } = req.body;

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

    // Check for active subscription
    const subscriptionResult = await query(
      `SELECT id, status, trial_start, trial_end, selected_plan, stripe_subscription_id
       FROM subscriptions
       WHERE user_id = $1 AND platform = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, platform]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(200).json({
        status: 'no_trial',
        message: 'No trial found for this platform'
      });
    }

    const subscription = subscriptionResult.rows[0];
    const now = new Date();
    const trialEnd = new Date(subscription.trial_end);

    // Check if trial is active
    if (subscription.status === 'trialing' && trialEnd > now) {
      const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
      
      return res.status(200).json({
        status: 'trialing',
        trialStart: subscription.trial_start,
        trialEnd: subscription.trial_end,
        daysRemaining,
        selectedPlan: subscription.selected_plan || 'monthly'
      });
    }

    // Check if trial has expired
    if (subscription.status === 'trialing' && trialEnd <= now) {
      return res.status(200).json({
        status: 'expired',
        trialEnd: subscription.trial_end,
        selectedPlan: subscription.selected_plan || 'monthly'
      });
    }

    // Check if user has active paid subscription
    if (subscription.status === 'active' && subscription.stripe_subscription_id) {
      return res.status(200).json({
        status: 'active',
        subscriptionId: subscription.stripe_subscription_id,
        selectedPlan: subscription.selected_plan || 'monthly'
      });
    }

    // Default response
    return res.status(200).json({
      status: subscription.status || 'unknown',
      selectedPlan: subscription.selected_plan || 'monthly'
    });

  } catch (error) {
    console.error('Trial status check error:', error);
    return res.status(500).json({
      error: 'Failed to check trial status',
      message: error.message
    });
  }
}
