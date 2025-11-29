/**
 * Get Referral Stats API
 * Returns referral statistics for a user
 */

import pool from '../../db/pool.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.query.user_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get all referrals for this user
    const query = `
      SELECT 
        id,
        referral_code,
        referred_email,
        status,
        reward_granted,
        completed_assessment,
        created_at,
        completed_assessment_at,
        reward_granted_at
      FROM referral_program 
      WHERE referrer_user_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    const referrals = result.rows;

    // Calculate stats
    const stats = {
      total: referrals.length,
      completed: referrals.filter(r => r.status === 'completed').length,
      signedUp: referrals.filter(r => r.status === 'signed_up').length,
      pending: referrals.filter(r => r.status === 'pending').length,
      rewardsEarned: referrals.filter(r => r.reward_granted).length
    };

    return res.status(200).json({
      success: true,
      stats,
      referrals
    });

  } catch (error) {
    console.error('[Referral] Error getting stats:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get referral stats'
    });
  }
}
