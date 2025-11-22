/**
 * User Signup API Endpoint
 * POST /api/auth/signup
 * Creates a new user account
 */

const { query } = require('../utils/db');
const { hashPassword, generateToken, isValidEmail, validatePassword } = require('../utils/auth');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name, created_at`,
      [email.toLowerCase(), passwordHash, firstName || null, lastName || null]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = generateToken(user);

    // Log signup event
    await query(
      `INSERT INTO audit_log (user_id, event_type, event_data, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [
        user.id,
        'signup',
        JSON.stringify({ email: user.email }),
        req.headers['x-forwarded-for'] || req.connection.remoteAddress
      ]
    );

    // Automatically create free trials for RxGuard (14 days) and EndoGuard (30 days)
    try {
      // RxGuard: 14-day trial
      await query(
        `INSERT INTO platform_trials (user_id, platform, trial_end_date, trial_type)
         VALUES ($1, 'RxGuard', CURRENT_TIMESTAMP + INTERVAL '14 days', 'regular')
         ON CONFLICT (user_id, platform) DO NOTHING`,
        [user.id]
      );

      // EndoGuard: 30-day trial
      await query(
        `INSERT INTO platform_trials (user_id, platform, trial_end_date, trial_type)
         VALUES ($1, 'EndoGuard', CURRENT_TIMESTAMP + INTERVAL '30 days', 'regular')
         ON CONFLICT (user_id, platform) DO NOTHING`,
        [user.id]
      );

      console.log(`Free trials created for user ${user.id}: RxGuard (14 days), EndoGuard (30 days)`);
    } catch (trialError) {
      console.error('Error creating trials:', trialError);
      // Don't fail signup if trial creation fails
    }

    // Return user data and token
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        createdAt: user.created_at,
      },
      token,
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      error: 'Failed to create account',
      message: error.message,
    });
  }
};

