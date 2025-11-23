/**
 * Forgot Password API Endpoint
 * POST /api/auth/forgot-password
 * Sends password reset email with token
 */

import { query } from '../utils/db.mjs';
import { generateRandomToken, isValidEmail } from '../utils/auth.mjs';
import { sendEmail } from '../utils/emailService.mjs';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user by email
    const userResult = await query(
      'SELECT id, email, first_name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Always return success to prevent email enumeration attacks
    // Even if user doesn't exist, we say we sent the email
    if (userResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = generateRandomToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    // First, delete any existing tokens for this user
    await query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1',
      [user.id]
    );

    // Insert new token
    await query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    );

    // Send password reset email
    const resetUrl = `https://nexusbiomedical.ai/reset-password?token=${resetToken}`;
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Reset Your Password
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${user.first_name || 'there'},
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your Nexus Biomedical Intelligence account.
              </p>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                Click the button below to reset your password. This link will expire in 1 hour.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; margin-bottom: 20px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>

              <div style="background-color: #f9fafb; border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 6px;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                  <strong>Security tip:</strong> Never share your password or reset links with anyone. Nexus Biomedical Intelligence will never ask for your password via email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@nexusbiomedical.ai" style="color: #00CED1; text-decoration: none;">support@nexusbiomedical.ai</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Nexus Biomedical Intelligence. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await sendEmail({
      to: email,
      subject: 'Reset Your Password - Nexus Biomedical Intelligence',
      html: emailHtml,
    });

    // Log password reset request
    await query(
      `INSERT INTO audit_log (user_id, event_type, event_data, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [
        user.id,
        'password_reset_requested',
        JSON.stringify({ email: user.email }),
        req.headers['x-forwarded-for'] || req.connection.remoteAddress
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      error: 'Failed to process password reset request',
      message: error.message,
    });
  }
};
