/**
 * Get User Assessments API
 * GET /api/endoguard/my-assessments
 * Retrieves user's assessment history from database
 */

const { query } = require('../utils/db');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
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

    // Get user's assessments
    const result = await query(
      `SELECT id, assessment_type, assessment_data, results, risk_score, created_at
       FROM user_assessments
       WHERE user_id = $1 AND platform = 'EndoGuard'
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    // Format assessments for frontend
    const assessments = result.rows.map(row => ({
      id: row.id,
      type: row.assessment_type,
      data: row.assessment_data,
      results: row.results,
      riskScore: row.risk_score,
      createdAt: row.created_at
    }));

    return res.status(200).json({
      success: true,
      assessments,
      count: assessments.length
    });

  } catch (error) {
    console.error('Load assessments error:', error);
    return res.status(500).json({
      error: 'Failed to load assessments',
      message: error.message
    });
  }
};
