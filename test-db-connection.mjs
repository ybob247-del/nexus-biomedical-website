import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ Connection successful:', result.rows);
    
    console.log('\nTesting user query...');
    const userResult = await pool.query('SELECT id, email FROM users LIMIT 1');
    console.log('✅ User query successful:', userResult.rows);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testConnection();
