import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    if (req.method === 'GET') {
      const { category, limit = 10, offset = 0 } = req.query;
      let query = 'SELECT * FROM blog_posts WHERE published_at <= NOW() ORDER BY published_at DESC';
      const params = [];

      if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
      }

      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));

      const [posts] = await connection.execute(query, params);
      return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
      const { title, slug, content, excerpt, author, category, tags, featured_image } = req.body;

      if (!title || !slug || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const tagsJson = tags ? JSON.stringify(tags) : null;
      const query = `
        INSERT INTO blog_posts (title, slug, content, excerpt, author, category, tags, featured_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await connection.execute(query, [
        title,
        slug,
        content,
        excerpt || '',
        author || '',
        category || '',
        tagsJson,
        featured_image || '',
      ]);

      return res.status(201).json({ id: result.insertId, message: 'Post created successfully' });
    }
  } catch (error) {
    console.error('Blog API error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await connection.end();
  }
}
