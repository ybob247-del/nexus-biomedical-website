/**
 * Free Trial Activation API
 * POST /api/trials/activate
 * Grants free trial access to a platform without payment method
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

    // Define trial periods for each platform
    const trialPeriods = {
      rxguard: 14, // 14 days
      endoguard: 30, // 30 days
      elderwatch: 14,
      pedicalcpro: 14,
      clinicaliq: 14,
      reguready: 14,
      skinscanpro: 14
    };

    const trialDays = trialPeriods[platform.toLowerCase()] || 14;

    // Check if user already has an active trial or subscription for this platform
    const existingAccess = await query(
      `SELECT id FROM platform_access 
       WHERE user_id = $1 AND platform = $2 AND is_active = true`,
      [userId, platform]
    );

    if (existingAccess.rows.length > 0) {
      return res.status(400).json({
        error: 'You already have active access to this platform',
        hasAccess: true
      });
    }

    // Check if user has already used a trial for this platform
    const existingTrial = await query(
      `SELECT id FROM subscriptions 
       WHERE user_id = $1 AND platform = $2 AND trial_start IS NOT NULL`,
      [userId, platform]
    );

    if (existingTrial.rows.length > 0) {
      return res.status(400).json({
        error: 'You have already used your free trial for this platform',
        alreadyUsedTrial: true
      });
    }

    // Calculate trial period
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + trialDays);

    // Create subscription record with trial status
    const subscriptionResult = await query(
      `INSERT INTO subscriptions (
        user_id,
        platform,
        status,
        trial_start,
        trial_end,
        created_at,
        updated_at
      ) VALUES ($1, $2, 'trialing', $3, $4, NOW(), NOW())
      RETURNING id`,
      [userId, platform, trialStart, trialEnd]
    );

    const subscriptionId = subscriptionResult.rows[0].id;

    // Grant platform access
    await query(
      `INSERT INTO platform_access (
        user_id,
        subscription_id,
        platform,
        is_active,
        access_granted_at,
        access_expires_at,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, true, NOW(), $4, NOW(), NOW())`,
      [userId, subscriptionId, platform, trialEnd]
    );

    return res.status(200).json({
      success: true,
      message: `${trialDays}-day free trial activated for ${platform}`,
      trialStart,
      trialEnd,
      trialDays,
      platform
    });

  } catch (error) {
    console.error('Trial activation error:', error);
    return res.status(500).json({
      error: 'Failed to activate trial',
      message: error.message
    });
  }
}
