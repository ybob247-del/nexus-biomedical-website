import { query } from './api/utils/db.js';

async function test() {
  try {
    console.log('Testing database connection with restored code...');
    const result = await query('SELECT 1 as test', []);
    console.log('✅ Connection successful:', result.rows);
    
    const users = await query('SELECT id, email FROM users LIMIT 1', []);
    console.log('✅ User query successful:', users.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

test();
