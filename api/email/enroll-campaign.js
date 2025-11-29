/**
 * Enroll User in Email Drip Campaign
 * Called after assessment completion
 */

import pool from '../../db/pool.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, userName, assessmentDate, riskScore, campaignType } = req.body;

    if (!email || !assessmentDate || riskScore === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, assessmentDate, riskScore' 
      });
    }

    // Check if user is already enrolled in this campaign
    const existingQuery = `
      SELECT id FROM email_campaigns 
      WHERE email = $1 
      AND campaign_type = $2 
      AND assessment_date = $3
      AND unsubscribed = FALSE
    `;
    
    const existing = await pool.query(existingQuery, [
      email,
      campaignType || 'endoguard_drip',
      assessmentDate
    ]);

    if (existing.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'User already enrolled in campaign',
        campaignId: existing.rows[0].id
      });
    }

    // Enroll user in drip campaign
    const insertQuery = `
      INSERT INTO email_campaigns (
        user_id,
        email,
        user_name,
        assessment_date,
        risk_score,
        campaign_type
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const result = await pool.query(insertQuery, [
      userId || null,
      email,
      userName || null,
      assessmentDate,
      riskScore,
      campaignType || 'endoguard_drip'
    ]);

    console.log(`[Campaign Enrollment] User ${email} enrolled in ${campaignType || 'endoguard_drip'}`);

    return res.status(200).json({
      success: true,
      message: 'Successfully enrolled in email campaign',
      campaignId: result.rows[0].id
    });

  } catch (error) {
    console.error('[Campaign Enrollment] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to enroll in campaign'
    });
  }
}
