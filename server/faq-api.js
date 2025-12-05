/**
 * FAQ API - Provides FAQ data from database
 */

import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const router = express.Router();

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/faq - Get FAQs by language and optional category
router.get('/faq', async (req, res) => {
  try {
    const { language = 'en', category } = req.query;

    // Build query
    let query = 'SELECT * FROM faq_items WHERE is_active = true AND language = $1';
    const params = [language];

    if (category && category !== 'all') {
      query += ' AND category = $2';
      params.push(category);
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    // Execute query
    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('FAQ API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch FAQs',
      details: error.message 
    });
  }
});

export default router;
