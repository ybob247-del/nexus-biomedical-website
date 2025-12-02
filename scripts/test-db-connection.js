#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests database connectivity on production/Vercel deployment
 * 
 * Usage: node scripts/test-db-connection.js
 */

import { query } from '../api/utils/db.js';

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  const tests = [
    {
      name: 'Simple SELECT query',
      query: 'SELECT 1 as test',
      expectedRows: 1
    },
    {
      name: 'Check users table exists',
      query: 'SELECT COUNT(*) as count FROM users LIMIT 1',
      expectedRows: 1
    },
    {
      name: 'Check subscriptions table exists',
      query: 'SELECT COUNT(*) as count FROM subscriptions LIMIT 1',
      expectedRows: 1
    },
    {
      name: 'Check platform_access table exists',
      query: 'SELECT COUNT(*) as count FROM platform_access LIMIT 1',
      expectedRows: 1
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    try {
      console.log(`📝 Test: ${test.name}`);
      const startTime = Date.now();
      
      const result = await query(test.query);
      
      const duration = Date.now() - startTime;
      
      if (result && result.rows && result.rows.length >= test.expectedRows) {
        console.log(`✅ PASSED (${duration}ms)`);
        console.log(`   Result:`, JSON.stringify(result.rows[0], null, 2));
        passedTests++;
      } else {
        console.log(`❌ FAILED (${duration}ms)`);
        console.log(`   Expected ${test.expectedRows} rows, got ${result?.rows?.length || 0}`);
        console.log(`   Result:`, result);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ FAILED`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
      failedTests++;
    }
    console.log('');
  }

  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   Total: ${tests.length}`);

  if (failedTests === 0) {
    console.log('\n🎉 All database connection tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some database connection tests failed.');
    console.log('   This may indicate:');
    console.log('   - Database connection timeout issues');
    console.log('   - Missing tables in production database');
    console.log('   - Incorrect DATABASE_URL environment variable');
    process.exit(1);
  }
}

// Run tests
testDatabaseConnection().catch(error => {
  console.error('💥 Fatal error running database tests:');
  console.error(error);
  process.exit(1);
});
