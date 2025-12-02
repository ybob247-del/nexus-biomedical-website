import pg from 'pg';
const { Pool } = pg;

// Convert mysql:// to postgresql://
const pgUrl = process.env.DATABASE_URL.replace('mysql://', 'postgresql://').replace('?ssl={"rejectUnauthorized":true}', '');

console.log('Testing with PostgreSQL protocol...');
const pool = new Pool({
  connectionString: pgUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  try {
    console.log('Connecting to database...');
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Connection successful:', result.rows);
    
    console.log('\nTesting user query...');
    const userResult = await pool.query('SELECT id, email FROM users LIMIT 1');
    console.log('✅ User query successful:', userResult.rows);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
