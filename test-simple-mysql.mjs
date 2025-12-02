import mysql from 'mysql2/promise';

console.log('Testing with simple config...');

try {
  const connection = await mysql.createConnection({
    host: 'gateway02.us-east-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '2bdzn41uM6mMWcv.97707ddd6929',
    password: 'H5SnzaA7CqYS45l06gin',
    database: '3gcYftfyZmb2335Uoynmho',
    ssl: {
      rejectUnauthorized: false
    },
    connectTimeout: 10000
  });
  
  console.log('✅ Connected!');
  const [rows] = await connection.execute('SELECT 1 as test');
  console.log('✅ Query successful:', rows);
  await connection.end();
} catch (error) {
  console.error('❌ Failed:', error.message);
  console.error('Code:', error.code);
  console.error('errno:', error.errno);
}
