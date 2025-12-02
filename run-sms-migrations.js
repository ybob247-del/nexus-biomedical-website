import { query } from './api/utils/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting SMS System Database Migrations...\n');

async function runMigration(filePath, name) {
  try {
    console.log(`📄 Running migration: ${name}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    await query(sql);
    
    console.log(`✅ ${name} completed successfully\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} failed:`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}\n`);
    return false;
  }
}

async function verifyTables() {
  console.log('🔍 Verifying database tables...\n');
  
  try {
    // Check for SMS tables
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
      AND table_name LIKE 'sms_%'
      ORDER BY table_name
    `);
    
    console.log('📊 SMS Tables Found:');
    tables.forEach(row => {
      console.log(`   ✓ ${row.table_name || row.TABLE_NAME}`);
    });
    
    // Check notification_preferences column
    const columns = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = DATABASE()
      AND table_name = 'users'
      AND column_name = 'notification_preferences'
    `);
    
    if (columns.length > 0) {
      console.log('\n✅ notification_preferences column exists in users table');
    } else {
      console.log('\n⚠️  notification_preferences column NOT found in users table');
    }
    
    // Count seeded data
    const campaigns = await query('SELECT COUNT(*) as count FROM sms_campaigns');
    const tips = await query('SELECT COUNT(*) as count FROM sms_health_tips');
    
    console.log(`\n📈 Seeded Data:`);
    console.log(`   Campaigns: ${campaigns[0].count}`);
    console.log(`   Health Tips: ${tips[0].count}`);
    
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

async function main() {
  const migrations = [
    {
      file: './db/migrations/COMPLETE_SMS_SYSTEM_MIGRATION.sql',
      name: 'Complete SMS System Migration'
    }
  ];
  
  let allSuccess = true;
  
  for (const migration of migrations) {
    const success = await runMigration(
      path.join(__dirname, migration.file),
      migration.name
    );
    
    if (!success) {
      allSuccess = false;
      console.error('⚠️  Migration failed. Stopping execution.\n');
      break;
    }
  }
  
  if (allSuccess) {
    console.log('✅ All migrations completed successfully!\n');
    
    // Verify the results
    await verifyTables();
    
    console.log('\n🎉 SMS System is ready for production!');
    console.log('\nNext steps:');
    console.log('1. Test SMS preferences UI at /settings/sms');
    console.log('2. Complete an EndoGuard assessment to trigger SMS');
    console.log('3. Monitor SMS delivery in sms_message_history table');
    console.log('4. Deploy to production via Publish button\n');
    
    process.exit(0);
  } else {
    console.error('❌ Migration process failed. Please check errors above.\n');
    process.exit(1);
  }
}

main();
