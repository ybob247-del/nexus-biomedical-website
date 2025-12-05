import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DATABASE_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DATABASE_PORT || '4000'),
  user: process.env.DATABASE_USER || '2Zp1WgPVMBCuYRo.root',
  password: process.env.DATABASE_PASSWORD || 'Nexus2024!Biomedical',
  database: process.env.DATABASE_NAME || 'nexus_biomedical_db',
  ssl: {
    rejectUnauthorized: true
  },
  connectTimeout: 10000
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // POST: Log chatbot interaction
    if (req.method === 'POST') {
      const {
        session_id,
        user_id,
        question,
        answer,
        matched_faq_id,
        language,
        response_time_ms,
        user_satisfied,
        user_feedback
      } = req.body;

      if (!session_id || !question || !answer) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: session_id, question, answer'
        });
      }

      const query = `
        INSERT INTO chatbot_analytics 
        (session_id, user_id, question, answer, matched_faq_id, language, response_time_ms, user_satisfied, user_feedback)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.execute(query, [
        session_id,
        user_id || null,
        question,
        answer,
        matched_faq_id || null,
        language || 'en',
        response_time_ms || null,
        user_satisfied !== undefined ? user_satisfied : null,
        user_feedback || null
      ]);

      return res.status(201).json({
        success: true,
        message: 'Analytics logged successfully'
      });
    }

    // GET: Retrieve analytics data
    if (req.method === 'GET') {
      const { timeRange = '7', language } = req.query;

      // Calculate date range
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Build base query
      let whereClause = 'WHERE created_at >= ?';
      const params = [startDate.toISOString().slice(0, 19).replace('T', ' ')];

      if (language && language !== 'all') {
        whereClause += ' AND language = ?';
        params.push(language);
      }

      // Get overall statistics
      const [statsRows] = await connection.execute(`
        SELECT 
          COUNT(*) as total_interactions,
          COUNT(DISTINCT session_id) as unique_sessions,
          COUNT(DISTINCT user_id) as unique_users,
          AVG(response_time_ms) as avg_response_time,
          SUM(CASE WHEN user_satisfied = 1 THEN 1 ELSE 0 END) as satisfied_count,
          SUM(CASE WHEN user_satisfied = 0 THEN 1 ELSE 0 END) as unsatisfied_count,
          COUNT(user_satisfied) as total_feedback
        FROM chatbot_analytics
        ${whereClause}
      `, params);

      const stats = statsRows[0];
      stats.satisfaction_rate = stats.total_feedback > 0 
        ? (stats.satisfied_count / stats.total_feedback * 100).toFixed(2)
        : 0;

      // Get popular questions
      const [popularQuestions] = await connection.execute(`
        SELECT 
          question,
          COUNT(*) as count,
          language,
          AVG(CASE WHEN user_satisfied IS NOT NULL THEN user_satisfied ELSE NULL END) as avg_satisfaction
        FROM chatbot_analytics
        ${whereClause}
        GROUP BY question, language
        ORDER BY count DESC
        LIMIT 20
      `, params);

      // Get questions by language
      const [languageStats] = await connection.execute(`
        SELECT 
          language,
          COUNT(*) as count
        FROM chatbot_analytics
        ${whereClause}
        GROUP BY language
        ORDER BY count DESC
      `, params);

      // Get daily interaction trends
      const [dailyTrends] = await connection.execute(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as interactions,
          COUNT(DISTINCT session_id) as sessions,
          AVG(response_time_ms) as avg_response_time
        FROM chatbot_analytics
        ${whereClause}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `, params);

      // Get most matched FAQs
      const [matchedFAQs] = await connection.execute(`
        SELECT 
          ca.matched_faq_id,
          faq.question as faq_question,
          faq.category,
          COUNT(*) as match_count
        FROM chatbot_analytics ca
        LEFT JOIN faq_items faq ON ca.matched_faq_id = faq.id
        ${whereClause} AND ca.matched_faq_id IS NOT NULL
        GROUP BY ca.matched_faq_id, faq.question, faq.category
        ORDER BY match_count DESC
        LIMIT 15
      `, params);

      // Get recent feedback
      const [recentFeedback] = await connection.execute(`
        SELECT 
          question,
          answer,
          user_satisfied,
          user_feedback,
          language,
          created_at
        FROM chatbot_analytics
        ${whereClause} AND user_feedback IS NOT NULL
        ORDER BY created_at DESC
        LIMIT 10
      `, params);

      return res.status(200).json({
        success: true,
        timeRange: daysAgo,
        stats,
        popularQuestions,
        languageStats,
        dailyTrends,
        matchedFAQs,
        recentFeedback
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Chatbot analytics error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process analytics request',
      details: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
