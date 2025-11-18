/**
 * Combined Admin API
 * Handles all admin operations through query parameters
 * 
 * Routes:
 * - POST /api/admin?action=grant-beta-access - Grant beta tester access
 * - POST /api/admin?action=send-beta-invite - Send beta invite email
 */

import { query } from './utils/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { action } = req.query;

  try {
    switch (action) {
      case 'grant-beta-access':
        return await handleGrantBetaAccess(req, res);
      case 'send-beta-invite':
        return await handleSendBetaInvite(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action parameter' });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process admin request'
    });
  }
}

// Grant beta tester access
async function handleGrantBetaAccess(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  const adminUserId = decoded.userId;
  
  // Check if admin exists
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

  // Grant beta access
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
}

// Send beta invite
async function handleSendBetaInvite(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, days } = req.body;

  // Validate input
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!days || days < 1 || days > 365) {
    return res.status(400).json({ error: 'Days must be between 1 and 365' });
  }

  // Trigger n8n workflow
  const n8nWebhookUrl = process.env.N8N_BETA_INVITE_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/beta-invite';

  const response = await fetch(n8nWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      days,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to trigger n8n workflow');
  }

  return res.status(200).json({
    success: true,
    message: `Beta invite sent to ${email}`,
    email,
    days,
  });
}
