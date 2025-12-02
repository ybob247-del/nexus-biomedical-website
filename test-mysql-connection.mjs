import mysql from 'mysql2/promise';

const url = new URL(process.env.DATABASE_URL.replace('?ssl={"rejectUnauthorized":true}', ''));

const poolConfig = {
  host: url.hostname,
  port: parseInt(url.port) || 4000,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: {
    rejectUnauthorized: false,
  },
  connectTimeout: 10000,
};

console.log('Testing MySQL connection...');
console.log('Host:', poolConfig.host);
console.log('Port:', poolConfig.port);
console.log('Database:', poolConfig.database);

const pool = mysql.createPool(poolConfig);

try {
  const [rows] = await pool.execute('SELECT 1 as test');
  console.log('✅ Connection successful:', rows);
  
  const [users] = await pool.execute('SELECT id, email FROM users LIMIT 1');
  console.log('✅ User query successful:', users);
  
  await pool.end();
} catch (error) {
  console.error('❌ Connection failed:', error.message);
}
