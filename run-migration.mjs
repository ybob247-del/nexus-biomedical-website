import fs from 'fs';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

const migrationFile = process.argv[2];
const sql = fs.readFileSync(migrationFile, 'utf8');

try {
  await pool.query(sql);
  console.log('✅ Migration completed successfully');
  process.exit(0);
} catch (err) {
  console.error('❌ Migration error:', err.message);
  process.exit(1);
}
