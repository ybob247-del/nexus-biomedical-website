/**
 * API: Grant Beta Tester Access
 * POST /api/admin/grant-beta-access
 * 
 * Grants beta tester status to a user (30-60 days free access to all platforms)
 * ADMIN ONLY - Requires admin authentication
 */

import { query } from '../db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userEmail, betaDays } = req.body;
    
    // Get admin user from JWT token
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

    // TODO: Add admin check here
    // For now, only the owner can grant beta access
    const adminUserId = decoded.userId;
    
    // Check if admin is the owner
    const adminResult = await query(
      'SELECT email FROM users WHERE id = $1',
      [adminUserId]
    );

    if (adminResult.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validate inputs
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const days = betaDays || 60; // Default to 60 days
    if (days < 1 || days > 365) {
      return res.status(400).json({ error: 'Beta days must be between 1 and 365' });
    }

    // Find user by email
    const userResult = await query(
      'SELECT id, email, is_beta_tester FROM users WHERE email = $1',
      [userEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Check if already beta tester
    if (user.is_beta_tester) {
      return res.status(400).json({ 
        error: 'Already beta tester',
        message: `${userEmail} is already a beta tester`
      });
    }

    // Grant beta access using database function
    const grantResult = await query(
      'SELECT grant_beta_access($1, $2) as success',
      [user.id, days]
    );

    if (!grantResult.rows[0].success) {
      return res.status(500).json({ error: 'Failed to grant beta access' });
    }

    // Get updated user info
    const updatedUserResult = await query(
      'SELECT beta_access_expires FROM users WHERE id = $1',
      [user.id]
    );

    const betaExpires = updatedUserResult.rows[0].beta_access_expires;

    // Return success
    return res.status(200).json({
      success: true,
      message: `Beta access granted to ${userEmail}`,
      user: {
        email: userEmail,
        betaDays: days,
        betaExpiresAt: betaExpires,
        daysRemaining: Math.ceil((new Date(betaExpires) - new Date()) / (1000 * 60 * 60 * 24))
      }
    });

  } catch (error) {
    console.error('Error granting beta access:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to grant beta access. Please try again later.'
    });
  }
}

