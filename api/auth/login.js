/**
 * User Login API Endpoint
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token
 */

import { query } from '../utils/db.js';
import { comparePassword, generateToken, isValidEmail } from '../utils/auth.js';

export default async function handler(req, res) {
  // Set timeout to prevent hanging
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error('Login API timeout - request took too long');
      return res.status(504).json({ 
        error: 'Request timeout', 
        message: 'The server took too long to respond. Please try again.' 
      });
    }
  }, 25000); // 25 second timeout

  try {
    // Debug logging for DATABASE_URL
    console.log('LOGIN - DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('LOGIN - DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      clearTimeout(timeout);
      return res.status(405).json({ error: 'Method not allowed' });
    }
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
      'SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    // MySQL returns result as [rows, fields]
    const rows = Array.isArray(result) ? result[0] : result.rows;
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // TODO: Re-enable audit_log after fixing database schema
    // Temporarily disabled to allow logins while debugging foreign key constraints
    /*
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
    */

    // Clear timeout before responding
    clearTimeout(timeout);
    
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
    clearTimeout(timeout);
    console.error('Login error:', error);
    console.error('Login error stack:', error.stack);
    console.error('Login error details:', JSON.stringify(error, null, 2));
    
    // Always return JSON, never HTML
    return res.status(500).json({
      error: 'Login failed',
      message: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

