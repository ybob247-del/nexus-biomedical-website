/**
 * Reset Password API Endpoint
 * POST /api/auth/reset-password
 * Resets user password using valid token
 */

const { query } = require('../utils/db');
const { hashPassword, validatePassword } = require('../utils/auth');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Find valid reset token
    const tokenResult = await query(
      `SELECT prt.user_id, prt.expires_at, u.email, u.first_name
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired reset token',
      });
    }

    const resetData = tokenResult.rows[0];

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, resetData.user_id]
    );

    // Delete used reset token
    await query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1',
      [resetData.user_id]
    );

    // Log password reset
    await query(
      `INSERT INTO audit_log (user_id, event_type, event_data, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [
        resetData.user_id,
        'password_reset_completed',
        JSON.stringify({ email: resetData.email }),
        req.headers['x-forwarded-for'] || req.connection.remoteAddress
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      error: 'Failed to reset password',
      message: error.message,
    });
  }
};
