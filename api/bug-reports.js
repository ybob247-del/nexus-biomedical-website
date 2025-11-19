import pg from 'pg'

const { Pool } = pg

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { description, email, screenshot, url, userAgent, timestamp } = req.body

    // Validate required fields
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' })
    }

    // Create bug_reports table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bug_reports (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        email VARCHAR(255),
        screenshot TEXT,
        url TEXT,
        user_agent TEXT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45)
      )
    `)

    // Get IP address from request
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    // Insert bug report into database
    const result = await pool.query(
      `INSERT INTO bug_reports (description, email, screenshot, url, user_agent, ip_address) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, created_at`,
      [description, email || 'anonymous', screenshot, url, userAgent, ipAddress]
    )

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Bug report submitted successfully',
      id: result.rows[0].id,
      timestamp: result.rows[0].created_at
    })
  } catch (error) {
    console.error('Bug report submission error:', error)
    return res.status(500).json({ 
      error: 'Failed to submit bug report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
