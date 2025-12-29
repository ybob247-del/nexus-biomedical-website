import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Slug is required' });
  }

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    const query = 'SELECT * FROM blog_posts WHERE slug = ? AND published_at <= NOW()';
    const [posts] = await connection.execute(query, [slug]);

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = posts[0];
    if (post.tags) {
      post.tags = JSON.parse(post.tags);
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Blog detail API error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await connection.end();
  }
}
