import { query } from '../utils/db.js';

/**
 * API endpoint for tour analytics statistics
 * GET /api/analytics/tour-stats
 * 
 * Query parameters:
 * - dateRange: '7' | '30' | '90' | 'all' (default: '30')
 * - tourName: filter by specific tour (optional)
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dateRange = '30', tourName } = req.query;

    // Build date filter
    let dateFilter = '';
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      dateFilter = `AND created_at >= DATE_SUB(NOW(), INTERVAL ${days} DAY)`;
    }

    // Build tour filter
    const tourFilter = tourName ? `AND tour_name = '${tourName}'` : '';

    // 1. Overall statistics
    const overallStats = await query(`
      SELECT 
        COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END) as total_starts,
        COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) as total_completions,
        COUNT(DISTINCT CASE WHEN event_type = 'skipped' THEN CONCAT(user_id, '-', tour_name) END) as total_skips,
        ROUND(
          COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) * 100.0 / 
          NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END), 0),
          2
        ) as completion_rate
      FROM tour_analytics
      WHERE 1=1 ${dateFilter} ${tourFilter}
    `);

    // 2. Per-tour statistics
    const perTourStats = await query(`
      SELECT 
        tour_name,
        COUNT(DISTINCT CASE WHEN event_type = 'started' THEN user_id END) as starts,
        COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN user_id END) as completions,
        COUNT(DISTINCT CASE WHEN event_type = 'skipped' THEN user_id END) as skips,
        ROUND(
          COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN user_id END) * 100.0 / 
          NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'started' THEN user_id END), 0),
          2
        ) as completion_rate
      FROM tour_analytics
      WHERE 1=1 ${dateFilter} ${tourFilter}
      GROUP BY tour_name
      ORDER BY starts DESC
    `);

    // 3. Step-by-step drop-off analysis (for specific tour if provided)
    let stepAnalysis = [];
    if (tourName) {
      stepAnalysis = await query(`
        SELECT 
          JSON_EXTRACT(metadata, '$.stepIndex') as step_index,
          COUNT(*) as views,
          COUNT(DISTINCT user_id) as unique_users
        FROM tour_analytics
        WHERE event_type = 'step_viewed' 
          AND tour_name = ?
          ${dateFilter}
        GROUP BY step_index
        ORDER BY step_index
      `, [tourName]);
    }

    // 4. Daily trend (last 30 days)
    const dailyTrend = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END) as starts,
        COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) as completions
      FROM tour_analytics
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ${tourFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    // 5. User engagement (anonymous vs logged-in)
    const userEngagement = await query(`
      SELECT 
        CASE 
          WHEN user_id = 'anonymous' THEN 'anonymous'
          ELSE 'logged_in'
        END as user_type,
        COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END) as starts,
        COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) as completions,
        ROUND(
          COUNT(DISTINCT CASE WHEN event_type = 'completed' THEN CONCAT(user_id, '-', tour_name) END) * 100.0 / 
          NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'started' THEN CONCAT(user_id, '-', tour_name) END), 0),
          2
        ) as completion_rate
      FROM tour_analytics
      WHERE 1=1 ${dateFilter} ${tourFilter}
      GROUP BY user_type
    `);

    // 6. Available tours list
    const availableTours = await query(`
      SELECT DISTINCT tour_name
      FROM tour_analytics
      ORDER BY tour_name
    `);

    return res.status(200).json({
      success: true,
      dateRange,
      tourName: tourName || 'all',
      overall: overallStats[0],
      perTour: perTourStats,
      stepAnalysis,
      dailyTrend,
      userEngagement,
      availableTours: availableTours.map(t => t.tour_name)
    });

  } catch (error) {
    console.error('Tour stats API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch tour statistics',
      details: error.message 
    });
  }
}
