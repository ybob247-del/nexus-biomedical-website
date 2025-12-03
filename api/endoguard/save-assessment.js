/**
 * Save EndoGuard Assessment API
 * POST /api/endoguard/save-assessment
 * Saves user's hormone health assessment results to database
 */

import { query } from '../utils/db.js';
import jwt from 'jsonwebtoken';
import { sendSMSToUser } from '../utils/smsHelper.js';
import { sendEmail } from '../utils/emailService.js';
import { assessmentCompletionEmail } from '../../src/utils/emailTemplates.js';

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

    // Get user info for SMS and email
    const userResult = await query(
      'SELECT first_name, email, language FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];
    const userName = user?.first_name || 'there';
    const userEmail = user?.email;
    const userLanguage = user?.language || 'en';
    const riskScore = results.overallRisk || 0;
    const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'moderate' : 'low';

    // Send email notification for assessment completion
    try {
      const emailTemplate = assessmentCompletionEmail[userLanguage] || assessmentCompletionEmail.en;
      const emailHtml = typeof emailTemplate.html === 'function' 
        ? emailTemplate.html('EndoGuard', riskScore, riskLevel)
        : emailTemplate.html;
      
      await sendEmail({
        to: userEmail,
        subject: emailTemplate.subject.replace('{platform}', 'EndoGuard'),
        html: emailHtml
      });
      
      console.log(`Assessment completion email sent to ${userEmail} in ${userLanguage}`);
    } catch (emailError) {
      console.error('Failed to send assessment email:', emailError);
      // Don't fail the request if email fails
    }

    // Send SMS notification for assessment completion
    try {
      // Always send completion SMS (platform, score)
      await sendSMSToUser(userId, 'assessmentCompleted', ['EndoGuard', riskScore]);

      // Send high-risk alert if risk score >= 70 (platform)
      if (riskScore >= 70) {
        await sendSMSToUser(userId, 'highRiskAlert', ['EndoGuard']);
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
