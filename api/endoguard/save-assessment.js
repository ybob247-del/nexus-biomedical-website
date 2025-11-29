/**
 * Save EndoGuard Assessment API
 * POST /api/endoguard/save-assessment
 * Saves user's hormone health assessment results to database
 */

import { query } from '../utils/db.js';
import jwt from 'jsonwebtoken';
import { sendSMSToUser } from '../utils/smsHelper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.userId;
    const { assessmentData, results } = req.body;

    if (!assessmentData || !results) {
      return res.status(400).json({ error: 'Assessment data and results are required' });
    }

    // Insert assessment into database
    const result = await query(
      `INSERT INTO user_assessments (
        user_id,
        platform,
        assessment_type,
        assessment_data,
        results,
        risk_score,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING id, created_at`,
      [
        userId,
        'EndoGuard',
        'hormone_health',
        JSON.stringify(assessmentData),
        JSON.stringify(results),
        results.overallRisk || 0
      ]
    );

    const assessment = result.rows[0];

    // Get user info for SMS
    const userResult = await query(
      'SELECT first_name, email FROM users WHERE id = $1',
      [userId]
    );
    const userName = userResult.rows[0]?.first_name || 'there';
    const riskScore = results.overallRisk || 0;

    // Send SMS notification for assessment completion
    try {
      // Always send completion SMS
      await sendSMSToUser(userId, 'assessmentCompleted', [userName, riskScore]);

      // Send high-risk alert if risk score >= 70
      if (riskScore >= 70) {
        await sendSMSToUser(userId, 'highRiskAlert', [userName, riskScore]);
      }
    } catch (smsError) {
      // Don't fail the request if SMS fails
      console.error('Failed to send SMS notification:', smsError);
    }

    return res.status(201).json({
      success: true,
      message: 'Assessment saved successfully',
      assessment: {
        id: assessment.id,
        createdAt: assessment.created_at
      }
    });

  } catch (error) {
    console.error('Save assessment error:', error);
    return res.status(500).json({
      error: 'Failed to save assessment',
      message: error.message
    });
  }
}
