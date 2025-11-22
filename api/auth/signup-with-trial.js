/**
 * User Signup API with Automatic Trial Activation
 * POST /api/auth/signup
 * Creates a new user account and activates free trials for selected platforms
 */

const { query } = require('../utils/db');
const { hashPassword, generateToken, isValidEmail, validatePassword } = require('../utils/auth');
const { createTrial } = require('../services/trialService');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, firstName, lastName, platform } = req.body;

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
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, name)
       VALUES (?, ?, ?)`,
      [email.toLowerCase(), passwordHash, `${firstName || ''} ${lastName || ''}`.trim() || null]
    );

    const userId = result.insertId;

    // Get user data
    const userResult = await query(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = userResult[0];

    // Determine which platform(s) to activate trial for
    const platformsToActivate = [];
    
    if (platform) {
      // User came from a specific platform's "Start Free Trial" button
      platformsToActivate.push(platform);
    } else {
      // Default: activate both RxGuard and EndoGuard Premium trials
      platformsToActivate.push('rxguard', 'endoguard_premium');
    }

    // Create trials for each platform
    const trials = [];
    for (const platformKey of platformsToActivate) {
      try {
        const trial = await createTrial(userId, platformKey);
        trials.push(trial);
      } catch (error) {
        console.error(`Failed to create trial for ${platformKey}:`, error);
        // Continue with other trials even if one fails
      }
    }

    // Generate JWT token
    const token = generateToken(user);

    // TODO: Send welcome email with trial details
    // await sendWelcomeEmail(user.email, trials);

    // Return user data, token, and trial details
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      },
      trials: trials.map(t => ({
        platform: t.platformName,
        trialDays: t.trialDays,
        expiresAt: t.expiresAt,
        usageLimit: t.usageLimit
      })),
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
