/**
 * API: Activate Platform-Specific Free Trial
 * POST /api/trial/activate-platform
 * 
 * Activates a free trial for a specific platform
 * - Regular users: 14-day trial per platform
 * - Beta testers: 60-day trial per platform
 * - Each platform has separate trial (can trial RxGuard, then PediCalc, etc.)
 */

import { query } from '../db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { platform } = req.body;
    
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

    // Check if user exists and is verified
    const userResult = await query(
      'SELECT id, email, email_verified, phone_verified, is_beta_tester, beta_access_expires FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Require email verification
    if (!user.email_verified) {
      return res.status(403).json({ 
        error: 'Email verification required',
        message: 'Please verify your email address before starting your free trial'
      });
    }

    // Require phone verification (optional for beta testers)
    if (!user.is_beta_tester && !user.phone_verified) {
      return res.status(403).json({ 
        error: 'Phone verification required',
        message: 'Please verify your phone number before starting your free trial'
      });
    }

    // Check if user already has trial for this platform
    const existingTrialResult = await query(
      'SELECT id, trial_status FROM platform_trials WHERE user_id = $1 AND platform = $2',
      [userId, platform]
    );

    if (existingTrialResult.rows.length > 0) {
      const existingTrial = existingTrialResult.rows[0];
      if (existingTrial.trial_status === 'active') {
        return res.status(400).json({ 
          error: 'Trial already active',
          message: `You already have an active free trial for ${platform}`
        });
      } else {
        return res.status(400).json({ 
          error: 'Trial already used',
          message: `You have already used your free trial for ${platform}. Please subscribe to continue.`
        });
      }
    }

    // Activate trial using database function
    const isBeta = user.is_beta_tester && user.beta_access_expires > new Date();
    const activateResult = await query(
      'SELECT * FROM activate_platform_trial($1, $2, $3)',
      [userId, platform, isBeta]
    );

    if (!activateResult.rows[0].success) {
      return res.status(500).json({ 
        error: 'Failed to activate trial',
        message: activateResult.rows[0].message
      });
    }

    const trial = activateResult.rows[0];

    // Get trial limits
    const limitsResult = await query(
      'SELECT max_uses, regular_trial_days, beta_trial_days FROM trial_limits WHERE platform = $1',
      [platform]
    );

    const limits = limitsResult.rows[0];
    const trialDays = isBeta ? limits.beta_trial_days : limits.regular_trial_days;

    // Return success with trial details
    return res.status(200).json({
      success: true,
      message: `Free trial activated successfully for ${platform}`,
      trial: {
        platform: platform,
        trialType: isBeta ? 'beta' : 'regular',
        trialDays: trialDays,
        endDate: trial.end_date,
        daysRemaining: Math.ceil((new Date(trial.end_date) - new Date()) / (1000 * 60 * 60 * 24)),
        usageLimit: limits.max_uses,
        usageCount: 0
      }
    });

  } catch (error) {
    console.error('Error activating trial:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to activate trial. Please try again later.'
    });
  }
}

