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
    const { name, email, organization, role, platform, message } = req.body

    // Validate required fields
    if (!name || !email || !organization || !role || !platform) {
      return res.status(400).json({ error: 'All required fields must be provided' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Create beta_requests table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS beta_requests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        platform VARCHAR(100) NOT NULL,
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `)

    // Check if email already exists
    const existingRequest = await pool.query(
      'SELECT id FROM beta_requests WHERE email = $1',
      [email]
    )

    if (existingRequest.rows.length > 0) {
      return res.status(409).json({ 
        error: 'A beta request with this email already exists',
        message: 'You have already submitted a beta access request. We will be in touch soon!'
      })
    }

    // Get IP address and user agent from request
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const userAgent = req.headers['user-agent']

    // Insert beta request into database
    const result = await pool.query(
      `INSERT INTO beta_requests (name, email, organization, role, platform, message, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, created_at`,
      [name, email, organization, role, platform, message || null, ipAddress, userAgent]
    )

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Beta access request submitted successfully',
      id: result.rows[0].id,
      timestamp: result.rows[0].created_at
    })

  } catch (error) {
    console.error('Beta signup error:', error)
    return res.status(500).json({ 
      error: 'Failed to submit beta request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
