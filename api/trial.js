/**
 * Combined Trial Management API
 * Handles all trial-related operations through query parameters
 * 
 * Routes:
 * - POST /api/trial?action=activate - Activate free trial
 * - POST /api/trial?action=activate-platform - Activate specific platform
 * - GET /api/trial?action=check-access - Check trial access
 * - POST /api/trial?action=track-usage - Track usage
 */

import { query } from './utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { action } = req.query;

  try {
    switch (action) {
      case 'activate':
        return await handleActivate(req, res);
      case 'activate-platform':
        return await handleActivatePlatform(req, res);
      case 'check-access':
        return await handleCheckAccess(req, res);
      case 'track-usage':
        return await handleTrackUsage(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action parameter' });
    }
  } catch (error) {
    console.error('Trial API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process trial request'
    });
  }
}

// Activate free trial
async function handleActivate(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    'SELECT id, email, email_verified, phone_verified, trial_status FROM users WHERE id = $1',
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

  // Require phone verification
  if (!user.phone_verified) {
    return res.status(403).json({ 
      error: 'Phone verification required',
      message: 'Please verify your phone number before starting your free trial'
    });
  }

  // Check if user already has an active trial
  if (user.trial_status === 'active') {
    return res.status(400).json({ 
      error: 'Trial already active',
      message: 'You already have an active free trial'
    });
  }

  // Check if user already used their trial
  if (user.trial_status === 'expired' || user.trial_status === 'converted') {
    return res.status(400).json({ 
      error: 'Trial already used',
      message: 'You have already used your free trial. Please subscribe to continue.'
    });
  }

  // Activate trial
  const activateResult = await query(
    'SELECT activate_trial($1, $2) as success',
    [userId, platform]
  );

  if (!activateResult.rows[0].success) {
    return res.status(500).json({ error: 'Failed to activate trial' });
  }

  // Get trial details
  const trialResult = await query(
    'SELECT trial_start_date, trial_end_date, trial_platform FROM users WHERE id = $1',
    [userId]
  );

  const trial = trialResult.rows[0];

  return res.status(200).json({
    success: true,
    message: 'Free trial activated successfully',
    trial: {
      platform: trial.trial_platform,
      startDate: trial.trial_start_date,
      endDate: trial.trial_end_date,
      daysRemaining: Math.ceil((new Date(trial.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))
    }
  });
}

// Activate specific platform
async function handleActivatePlatform(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform } = req.body;
  
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

  const validPlatforms = ['RxGuard', 'PediCalc', 'SkinScan', 'ElderWatch', 'ReguReady', 'ClinicalIQ'];
  if (!platform || !validPlatforms.includes(platform)) {
    return res.status(400).json({ error: 'Invalid platform specified' });
  }

  // Check user's trial status
  const userResult = await query(
    'SELECT trial_status, trial_platform, trial_end_date FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = userResult.rows[0];

  // Check if trial is active
  if (user.trial_status !== 'active') {
    return res.status(403).json({ 
      error: 'No active trial',
      message: 'Please activate your free trial first'
    });
  }

  // Check if trial has expired
  if (new Date(user.trial_end_date) < new Date()) {
    return res.status(403).json({ 
      error: 'Trial expired',
      message: 'Your free trial has expired. Please subscribe to continue.'
    });
  }

  // Activate platform access
  const result = await query(
    `INSERT INTO platform_access (user_id, platform, access_type, expires_at) 
     VALUES ($1, $2, 'trial', $3)
     ON CONFLICT (user_id, platform) 
     DO UPDATE SET access_type = 'trial', expires_at = $3, updated_at = CURRENT_TIMESTAMP
     RETURNING id`,
    [userId, platform, user.trial_end_date]
  );

  return res.status(200).json({
    success: true,
    message: `${platform} platform activated successfully`,
    expiresAt: user.trial_end_date
  });
}

// Check trial access
async function handleCheckAccess(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  // Get user's trial status
  const result = await query(
    'SELECT trial_status, trial_platform, trial_start_date, trial_end_date FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = result.rows[0];

  return res.status(200).json({
    hasAccess: user.trial_status === 'active' && new Date(user.trial_end_date) > new Date(),
    trial: {
      status: user.trial_status,
      platform: user.trial_platform,
      startDate: user.trial_start_date,
      endDate: user.trial_end_date,
      daysRemaining: user.trial_end_date 
        ? Math.ceil((new Date(user.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    }
  });
}

// Track usage
async function handleTrackUsage(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { platform, action, metadata } = req.body;
  
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

  if (!platform || !action) {
    return res.status(400).json({ error: 'Platform and action are required' });
  }

  // Insert usage record
  await query(
    `INSERT INTO usage_tracking (user_id, platform, action, metadata, created_at) 
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
    [userId, platform, action, JSON.stringify(metadata || {})]
  );

  return res.status(200).json({
    success: true,
    message: 'Usage tracked successfully'
  });
}
