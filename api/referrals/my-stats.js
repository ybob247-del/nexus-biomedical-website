/**
 * My Referral Stats API
 * GET /api/referrals/my-stats
 * Returns referral statistics for the authenticated user
 */

import { query } from '../utils/db.js';
import { extractToken, verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Get referral code
    const codeResult = await query(
      'SELECT * FROM referral_codes WHERE user_id = $1',
      [decoded.userId]
    );

    if (codeResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'No referral code found',
        message: 'Generate a referral code first'
      });
    }

    const referralCode = codeResult.rows[0];

    // Get referral signups with user details
    const signupsResult = await query(
      `SELECT 
        rs.id,
        rs.referred_user_id,
        rs.converted,
        rs.converted_at,
        rs.reward_amount,
        rs.reward_granted,
        rs.created_at,
        u.email as referred_email,
        u.name as referred_name
       FROM referral_signups rs
       JOIN users u ON rs.referred_user_id = u.id
       WHERE rs.referrer_user_id = $1
       ORDER BY rs.created_at DESC`,
      [decoded.userId]
    );

    // Calculate pending rewards
    const pendingRewardsResult = await query(
      `SELECT SUM(reward_amount) as total
       FROM referral_signups
       WHERE referrer_user_id = $1 
       AND converted = true 
       AND reward_granted = false`,
      [decoded.userId]
    );

    const pendingRewards = parseFloat(pendingRewardsResult.rows[0]?.total || 0);

    return res.status(200).json({
      success: true,
      referralCode: referralCode.code,
      stats: {
        totalSignups: parseInt(referralCode.total_signups),
        totalConversions: parseInt(referralCode.total_conversions),
        totalRewardsEarned: parseFloat(referralCode.total_rewards_earned),
        pendingRewards
      },
      signups: signupsResult.rows.map(signup => ({
        id: signup.id,
        referredEmail: signup.referred_email,
        referredName: signup.referred_name,
        converted: signup.converted,
        convertedAt: signup.converted_at,
        rewardAmount: parseFloat(signup.reward_amount || 0),
        rewardGranted: signup.reward_granted,
        signedUpAt: signup.created_at
      }))
    });

  } catch (error) {
    console.error('Get referral stats error:', error);
    return res.status(500).json({
      error: 'Failed to get referral stats',
      message: error.message
    });
  }
}
