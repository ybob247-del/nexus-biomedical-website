/**
 * Track Referral Signup API
 * Records when a referred user signs up and grants rewards
 */

import pool from '../../db/pool.js';

/**
 * Grant free month reward to referrer
 */
async function grantReward(referrerId) {
  try {
    // Add 30 days to user's subscription
    const updateQuery = `
      UPDATE platform_trials
      SET trial_end_date = trial_end_date + INTERVAL '30 days',
        updated_at = NOW()
      WHERE user_id = $1
        AND platform_name = 'EndoGuard'
      RETURNING trial_end_date
    `;
    
    const result = await pool.query(updateQuery, [referrerId]);
    
    if (result.rows.length > 0) {
      console.log(`[Referral] Granted 30-day extension to user ${referrerId}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Referral] Error granting reward:', error);
    return false;
  }
}

/**
 * Track referral signup
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { referralCode, email, userId } = req.body;

    if (!referralCode || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: referralCode, email' 
      });
    }

    // Find referral record
    const findQuery = `
      SELECT * FROM referral_program 
      WHERE referral_code = $1
    `;
    
    const referral = await pool.query(findQuery, [referralCode]);

    if (referral.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    const referralRecord = referral.rows[0];

    // Check if this email was already referred
    const duplicateQuery = `
      SELECT id FROM referral_program 
      WHERE referred_email = $1
    `;
    
    const duplicate = await pool.query(duplicateQuery, [email]);

    if (duplicate.rows.length > 0) {
      return res.status(400).json({ 
        error: 'This email has already been referred',
        message: 'Each user can only be referred once'
      });
    }

    // Update referral record with referred user info
    const updateQuery = `
      UPDATE referral_program 
      SET referred_email = $1,
          referred_user_id = $2,
          status = 'signed_up',
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, [
      email,
      userId || null,
      referralRecord.id
    ]);

    console.log(`[Referral] Tracked signup for code ${referralCode}: ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Referral signup tracked',
      referral: result.rows[0]
    });

  } catch (error) {
    console.error('[Referral] Error tracking signup:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to track referral signup'
    });
  }
}

/**
 * Check referral completion and grant rewards
 */
export async function checkAndGrantReward(userId) {
  try {
    // Find referral where this user was referred
    const query = `
      SELECT * FROM referral_program 
      WHERE referred_user_id = $1
        AND reward_granted = FALSE
    `;
    
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return; // No pending rewards
    }

    const referral = result.rows[0];

    // Check if user completed assessment
    const assessmentQuery = `
      SELECT id FROM assessment_history 
      WHERE user_id = $1 
      LIMIT 1
    `;
    
    const assessment = await pool.query(assessmentQuery, [userId]);
    const completedAssessment = assessment.rows.length > 0;

    // Update referral record
    if (completedAssessment && !referral.completed_assessment) {
      await pool.query(`
        UPDATE referral_program 
        SET completed_assessment = TRUE,
            completed_assessment_at = NOW(),
            status = 'completed',
            reward_granted = TRUE,
            reward_granted_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
      `, [referral.id]);

      // Grant reward to referrer
      const rewardGranted = await grantReward(referral.referrer_user_id);

      if (rewardGranted) {
        console.log(`[Referral] Reward granted! User ${referral.referrer_user_id} earned free month for referring user ${userId}`);
      }
    }

  } catch (error) {
    console.error('[Referral] Error checking/granting reward:', error);
  }
}
