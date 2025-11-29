/**
 * Run database migration for notification_preferences
 */

import pg from 'pg';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
});

async function runMigration() {
  try {
    console.log('Running notification_preferences migration...');
    
    const migrationSQL = fs.readFileSync(
      join(__dirname, 'db/migrations/add-notification-preferences.sql'),
      'utf8'
    );

    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the column was added
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'notification_preferences'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Verified: notification_preferences column exists');
      console.log('   Type:', result.rows[0].data_type);
    } else {
      console.log('⚠️  Warning: Column not found after migration');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();
