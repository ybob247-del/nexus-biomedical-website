/**
 * Email Verification API Endpoint
 * GET /api/auth/verify-email?token=xxx
 * Verifies user's email address
 */

import { query } from '../utils/db.js';
import { sendWelcomeEmail } from '../utils/email.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    // Validate token
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Find user with this token
    const result = await query(
      `SELECT id, email, first_name, email_verified_at, email_verification_expires
       FROM users
       WHERE email_verification_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid verification token' });
    }

    const user = result.rows[0];

    // Check if already verified
    if (user.email_verified_at) {
      return res.status(200).json({
        success: true,
        message: 'Email already verified',
        alreadyVerified: true
      });
    }

    // Check if token expired
    if (new Date() > new Date(user.email_verification_expires)) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Mark email as verified
    await query(
      `UPDATE users
       SET email_verified_at = NOW(),
           email_verification_token = NULL,
           email_verification_expires = NULL
       WHERE id = $1`,
      [user.id]
    );

    // Send welcome email
    const emailResult = await sendWelcomeEmail(user.email, user.first_name || 'User');
    
    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error);
      // Continue anyway - verification is complete
    }

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
