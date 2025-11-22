#!/usr/bin/env node
/**
 * Run database migrations for free trial system
 */

import { readFileSync } from 'fs';
import { createConnection } from 'mysql2/promise';

async function runMigrations() {
  console.log('🚀 Running database migrations...\n');

  // Parse DATABASE_URL
  const dbUrl = new URL(process.env.DATABASE_URL);
  
  const connection = await createConnection({
    host: dbUrl.hostname,
    port: dbUrl.port || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1), // Remove leading /
    multipleStatements: true,
    ssl: { rejectUnauthorized: true }
  });

  try {
    // Read migration file
    const sql = readFileSync('./db/migrations/001_free_trial_system_mysql.sql', 'utf8');
    
    console.log('📝 Executing migration: 001_free_trial_system_mysql.sql\n');
    
    // Execute migration
    await connection.query(sql);
    
    console.log('✅ Migration completed successfully!\n');
    
    // Verify platforms
    const [platforms] = await connection.query('SELECT platform_key, platform_name, price_monthly, trial_days FROM platforms');
    
    console.log('📊 Platforms configured:');
    console.table(platforms);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigrations();
