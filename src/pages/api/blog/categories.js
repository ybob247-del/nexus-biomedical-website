import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    const query = 'SELECT * FROM blog_categories ORDER BY name ASC';
    const [categories] = await connection.execute(query);
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Blog categories API error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await connection.end();
  }
}
