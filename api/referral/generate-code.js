/**
 * Generate Referral Code API
 * Creates a unique referral code for a user
 */

import pool from '../../db/pool.js';
import crypto from 'crypto';

/**
 * Generate unique referral code
 */
function generateReferralCode(userName) {
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  const namePart = userName ? userName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '') : 'USER';
  return `${namePart}${randomPart}`;
}

/**
 * Get or create referral code for user
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    // TODO: Verify JWT token and get user ID
    // For now, accept user_id from query param (development only)
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Check if user already has a referral code
    const existingQuery = `
      SELECT referral_code 
      FROM referral_program 
      WHERE referrer_user_id = $1 
      LIMIT 1
    `;
    
    const existing = await pool.query(existingQuery, [userId]);

    if (existing.rows.length > 0) {
      return res.status(200).json({
        success: true,
        referralCode: existing.rows[0].referral_code,
        isNew: false
      });
    }

    // Get user name for code generation
    const userQuery = `SELECT name FROM users WHERE id = $1`;
    const userResult = await pool.query(userQuery, [userId]);
    const userName = userResult.rows[0]?.name;

    // Generate new referral code
    let referralCode;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      referralCode = generateReferralCode(userName);
      
      // Check if code is unique
      const checkQuery = `SELECT id FROM referral_program WHERE referral_code = $1`;
      const check = await pool.query(checkQuery, [referralCode]);
      
      if (check.rows.length === 0) {
        break; // Code is unique
      }
      
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return res.status(500).json({ error: 'Failed to generate unique referral code' });
    }

    // Create referral code record
    const insertQuery = `
      INSERT INTO referral_program (referrer_user_id, referral_code)
      VALUES ($1, $2)
      RETURNING referral_code
    `;
    
    const result = await pool.query(insertQuery, [userId, referralCode]);

    console.log(`[Referral] Generated code ${referralCode} for user ${userId}`);

    return res.status(200).json({
      success: true,
      referralCode: result.rows[0].referral_code,
      isNew: true
    });

  } catch (error) {
    console.error('[Referral] Error generating code:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate referral code'
    });
  }
}
