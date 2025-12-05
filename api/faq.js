import mysql from 'mysql2/promise';

// Parse DATABASE_URL
const parseConnectionString = (url) => {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) throw new Error('Invalid DATABASE_URL format');
  return {
    host: match[3],
    user: match[1],
    password: match[2],
    database: match[5].split('?')[0],
    port: parseInt(match[4]),
    ssl: { rejectUnauthorized: false },
    connectTimeout: 10000
  };
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { language = 'en', category } = req.query;

  let connection;
  try {
    // Create database connection
    const dbConfig = parseConnectionString(process.env.DATABASE_URL);
    connection = await mysql.createConnection(dbConfig);

    // Build query
    let query = 'SELECT * FROM faq_items WHERE is_active = true AND language = ?';
    const params = [language];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    // Execute query
    const [rows] = await connection.execute(query, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('FAQ API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch FAQs',
      details: error.message 
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
