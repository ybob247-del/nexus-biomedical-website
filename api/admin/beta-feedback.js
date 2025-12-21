const { query } = require('../utils/db');
const { verifyToken } = require('../utils/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId || decoded.id;

    // Check if user is admin (user_id 30001 is the admin owner)
    if (userId !== 30001) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const { track, week, export_csv } = req.query;

    // Build query with filters
    let sql = `
      SELECT 
        bf.*,
        u.email,
        u.first_name,
        u.last_name
      FROM beta_feedback bf
      LEFT JOIN users u ON bf.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (track) {
      sql += ` AND bf.track = $${paramCount}`;
      params.push(track);
      paramCount++;
    }

    if (week) {
      sql += ` AND bf.week_number = $${paramCount}`;
      params.push(parseInt(week));
      paramCount++;
    }

    sql += ` ORDER BY bf.created_at DESC`;

    const result = await query(sql, params);

    // Calculate summary statistics
    const stats = {
      total_responses: result.rows.length,
      avg_nps: 0,
      avg_satisfaction: 0,
      avg_ease_of_use: 0,
      avg_accuracy: 0,
      avg_usefulness: 0,
      would_recommend_count: 0,
      would_pay_count: 0,
      mobile_app_interest: {
        yes_definitely: 0,
        maybe: 0,
        no_web_fine: 0,
        no_preference: 0
      },
      by_track: {}
    };

    if (result.rows.length > 0) {
      const validNPS = result.rows.filter(r => r.nps_score !== null);
      const validSat = result.rows.filter(r => r.overall_satisfaction !== null);
      const validEase = result.rows.filter(r => r.ease_of_use_rating !== null);
      const validAcc = result.rows.filter(r => r.accuracy_rating !== null);
      const validUse = result.rows.filter(r => r.usefulness_rating !== null);

      stats.avg_nps = validNPS.length > 0 
        ? (validNPS.reduce((sum, r) => sum + r.nps_score, 0) / validNPS.length).toFixed(1)
        : 0;
      
      stats.avg_satisfaction = validSat.length > 0
        ? (validSat.reduce((sum, r) => sum + r.overall_satisfaction, 0) / validSat.length).toFixed(1)
        : 0;

      stats.avg_ease_of_use = validEase.length > 0
        ? (validEase.reduce((sum, r) => sum + r.ease_of_use_rating, 0) / validEase.length).toFixed(1)
        : 0;

      stats.avg_accuracy = validAcc.length > 0
        ? (validAcc.reduce((sum, r) => sum + r.accuracy_rating, 0) / validAcc.length).toFixed(1)
        : 0;

      stats.avg_usefulness = validUse.length > 0
        ? (validUse.reduce((sum, r) => sum + r.usefulness_rating, 0) / validUse.length).toFixed(1)
        : 0;

      stats.would_recommend_count = result.rows.filter(r => r.would_recommend === true).length;
      stats.would_pay_count = result.rows.filter(r => r.would_pay_after_beta === true).length;

      // Mobile app preferences
      result.rows.forEach(r => {
        if (r.prefer_mobile_app) {
          stats.mobile_app_interest[r.prefer_mobile_app] = 
            (stats.mobile_app_interest[r.prefer_mobile_app] || 0) + 1;
        }

        // Track-specific stats
        if (r.track) {
          if (!stats.by_track[r.track]) {
            stats.by_track[r.track] = { count: 0, avg_nps: 0, avg_satisfaction: 0 };
          }
          stats.by_track[r.track].count++;
        }
      });
    }

    // If CSV export requested
    if (export_csv === 'true') {
      const csvHeaders = [
        'ID', 'Email', 'Name', 'Track', 'Week', 'NPS', 'Satisfaction',
        'Ease of Use', 'Accuracy', 'Usefulness', 'Mobile App Preference',
        'Mobile Platforms', 'What Works Well', 'Needs Improvement',
        'Feature Requests', 'Testimonial', 'Would Recommend', 'Would Pay',
        'Submitted At'
      ];

      const csvRows = result.rows.map(r => [
        r.id,
        r.email,
        `${r.first_name} ${r.last_name}`,
        r.track || '',
        r.week_number || '',
        r.nps_score || '',
        r.overall_satisfaction || '',
        r.ease_of_use_rating || '',
        r.accuracy_rating || '',
        r.usefulness_rating || '',
        r.prefer_mobile_app || '',
        r.mobile_platforms ? r.mobile_platforms.join(', ') : '',
        r.what_works_well || '',
        r.what_needs_improvement || '',
        r.feature_requests || '',
        r.testimonial || '',
        r.would_recommend ? 'Yes' : 'No',
        r.would_pay_after_beta ? 'Yes' : 'No',
        r.created_at
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

      const csv = [csvHeaders.join(','), ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=beta-feedback.csv');
      return res.send(csv);
    }

    res.json({
      success: true,
      feedback: result.rows,
      stats
    });

  } catch (error) {
    console.error('Error fetching beta feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback', details: error.message });
  }
};
