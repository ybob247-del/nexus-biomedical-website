/**
 * Generate Referral Code API
 * POST /api/referrals/generate-code
 * Generates a unique referral code for a user
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

// Generate random referral code
function generateCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking characters
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract and verify token
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if user already has a referral code
    const existingResult = await query(
      'SELECT code FROM referral_codes WHERE user_id = $1',
      [decoded.userId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(200).json({
        success: true,
        code: existingResult.rows[0].code,
        message: 'Referral code already exists'
      });
    }

    // Generate unique code
    let code;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = generateCode();
      const checkResult = await query(
        'SELECT id FROM referral_codes WHERE code = $1',
        [code]
      );
      isUnique = checkResult.rows.length === 0;
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Failed to generate unique code' });
    }

    // Insert referral code
    await query(
      `INSERT INTO referral_codes (user_id, code)
       VALUES ($1, $2)`,
      [decoded.userId, code]
    );

    return res.status(201).json({
      success: true,
      code,
      message: 'Referral code generated successfully'
    });

  } catch (error) {
    console.error('Generate referral code error:', error);
    return res.status(500).json({
      error: 'Failed to generate referral code',
      message: error.message
    });
  }
}
