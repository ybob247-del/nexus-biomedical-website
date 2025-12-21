const fs = require('fs');
const { query } = require('./db');

async function runMigration() {
  try {
    const sql = fs.readFileSync('db/migrations/20251219175535_create_beta_feedback.sql', 'utf8');
    await query(sql);
    console.log('✅ Beta feedback tables created successfully');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    throw error;
  }
}

runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
