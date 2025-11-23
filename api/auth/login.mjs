/**
 * User Login API Endpoint
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token
 */

import { query } from '../utils/db.mjs';
import { comparePassword, generateToken, isValidEmail } from '../utils/auth.mjs';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Find user by email
    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Log login event
    await query(
      `INSERT INTO audit_log (user_id, event_type, event_data, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [
        user.id,
        'login',
        JSON.stringify({ email: user.email }),
        req.headers['x-forwarded-for'] || req.connection.remoteAddress
      ]
    );

    // Return user data and token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Login failed',
      message: error.message,
    });
  }
};

