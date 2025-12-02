import mysql from 'mysql2/promise';

const url = new URL(process.env.DATABASE_URL.replace('?ssl={"rejectUnauthorized":true}', ''));

console.log('Testing MySQL connection WITHOUT SSL...');

const poolConfig = {
  host: url.hostname,
  port: parseInt(url.port) || 4000,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: false,  // Disable SSL
  connectTimeout: 5000,
};

const pool = mysql.createPool(poolConfig);

try {
  console.log('Attempting connection...');
  const [rows] = await pool.execute('SELECT 1 as test');
  console.log('✅ Connection successful (no SSL):', rows);
  await pool.end();
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  console.error('Error code:', error.code);
}
