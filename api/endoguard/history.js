import pool from '../db.js';

/**
 * Get user's assessment history for progress tracking
 * GET /api/endoguard/history
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from session/auth
    const userId = req.session?.userId || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get query parameters
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // Fetch assessment history from database
    const query = `
      SELECT 
        id,
        assessment_type,
        results,
        overall_risk_score,
        overall_risk_level,
        edc_risk_score,
        symptom_count,
        symptom_severity,
        bmi,
        completed_at,
        created_at
      FROM assessment_history
      WHERE user_id = $1
      ORDER BY completed_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [userId, limit, offset]);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM assessment_history
      WHERE user_id = $1
    `;
    
    const countResult = await pool.query(countQuery, [userId]);
    const total = parseInt(countResult.rows[0]?.total || 0);

    // Calculate statistics
    const stats = {
      totalAssessments: total,
      averageRiskScore: 0,
      latestBMI: null,
      riskTrend: 'stable' // 'improving', 'stable', 'worsening'
    };

    if (result.rows.length > 0) {
      // Calculate average risk score
      const avgScore = result.rows.reduce((sum, row) => sum + (row.overall_risk_score || 0), 0) / result.rows.length;
      stats.averageRiskScore = Math.round(avgScore);

      // Get latest BMI
      stats.latestBMI = result.rows[0].bmi;

      // Calculate trend (compare first and last assessment)
      if (result.rows.length >= 2) {
        const latestScore = result.rows[0].overall_risk_score || 0;
        const oldestScore = result.rows[result.rows.length - 1].overall_risk_score || 0;
        const diff = latestScore - oldestScore;
        
        if (diff < -5) {
          stats.riskTrend = 'improving';
        } else if (diff > 5) {
          stats.riskTrend = 'worsening';
        } else {
          stats.riskTrend = 'stable';
        }
      }
    }

    return res.status(200).json({
      success: true,
      assessments: result.rows,
      stats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Assessment history fetch error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch assessment history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
