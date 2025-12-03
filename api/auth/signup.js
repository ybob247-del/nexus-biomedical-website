/**
 * User Signup API Endpoint
 * POST /api/auth/signup
 * Creates a new user account
 */

import { query } from '../utils/db.js';
import { hashPassword, generateToken, isValidEmail, validatePassword } from '../utils/auth.js';
import { sendEmail } from '../utils/emailService.js';
import { welcomeEmail } from '../../src/utils/emailTemplates.js';

export default async function handler(req, res) {
  // Set timeout to prevent hanging
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error('Signup API timeout - request took too long');
      return res.status(504).json({ 
        error: 'Request timeout', 
        message: 'The server took too long to respond. Please try again.' 
      });
    }
  }, 25000); // 25 second timeout

  try {
    // Debug logging for DATABASE_URL
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
    console.log('DATABASE_URL starts with postgresql:', process.env.DATABASE_URL?.startsWith('postgresql://'));
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      clearTimeout(timeout);
      return res.status(405).json({ error: 'Method not allowed' });
    }

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

    // TODO: Re-enable audit_log and platform_trials after fixing database schema
    // Temporarily disabled to allow signups while debugging foreign key constraints
    /*
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
    */
    console.log(`User ${user.id} created successfully. Audit log and trials temporarily disabled.`);

    // Send welcome email (don't block signup if email fails)
    try {
      const userLanguage = req.body.language || 'en'; // Get language from request or default to English
      const emailTemplate = welcomeEmail[userLanguage] || welcomeEmail.en;
      
      await sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });
      
      console.log(`Welcome email sent to ${user.email} in ${userLanguage}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail signup if email fails
    }

    // Clear timeout before responding
    clearTimeout(timeout);
    
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
    clearTimeout(timeout);
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Always return JSON, never HTML
    return res.status(500).json({
      error: 'Failed to create account',
      message: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

