import pg from 'pg';
const { Pool } = pg;

const pgUrl = process.env.DATABASE_URL
  .replace('mysql://', 'postgresql://')
  .replace('?ssl={"rejectUnauthorized":true}', '');

console.log('Testing different SSL configurations...\n');

// Test 1: No SSL
console.log('Test 1: No SSL');
try {
  const pool1 = new Pool({
    connectionString: pgUrl,
    ssl: false,
    connectionTimeoutMillis: 5000,
  });
  const result1 = await pool1.query('SELECT 1');
  console.log('✅ No SSL works:', result1.rows);
  await pool1.end();
} catch (error) {
  console.log('❌ No SSL failed:', error.message);
}

// Test 2: SSL with rejectUnauthorized: false
console.log('\nTest 2: SSL rejectUnauthorized: false');
try {
  const pool2 = new Pool({
    connectionString: pgUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  const result2 = await pool2.query('SELECT 1');
  console.log('✅ SSL (rejectUnauthorized: false) works:', result2.rows);
  await pool2.end();
} catch (error) {
  console.log('❌ SSL (rejectUnauthorized: false) failed:', error.message);
}

// Test 3: SSL with rejectUnauthorized: true
console.log('\nTest 3: SSL rejectUnauthorized: true');
try {
  const pool3 = new Pool({
    connectionString: pgUrl,
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 5000,
  });
  const result3 = await pool3.query('SELECT 1');
  console.log('✅ SSL (rejectUnauthorized: true) works:', result3.rows);
  await pool3.end();
} catch (error) {
  console.log('❌ SSL (rejectUnauthorized: true) failed:', error.message);
}

