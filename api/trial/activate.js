/**
 * API: Activate Free Trial
 * POST /api/trial/activate
 * 
 * Activates a 14-day free trial for a user (no credit card required)
 * Requires: email and phone verification
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

    // Activate trial using database function
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

    // Return success with trial details
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

  } catch (error) {
    console.error('Error activating trial:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to activate trial. Please try again later.'
    });
  }
}

