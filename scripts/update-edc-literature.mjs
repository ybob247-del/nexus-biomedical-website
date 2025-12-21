#!/usr/bin/env node
/**
 * Monthly EDC Literature Update Script
 * 
 * This script should be run monthly (via cron job or manual execution) to:
 * 1. Search PubMed for latest research on each EDC
 * 2. Store new articles in the database
 * 3. Update literature status for each chemical
 * 
 * Usage:
 *   node scripts/update-edc-literature.mjs
 * 
 * Or with specific EDC:
 *   node scripts/update-edc-literature.mjs --edc-id=123
 */

import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import { runMonthlyLiteratureUpdate, updateLiteratureForEDC } from '../server/services/pubmed-service.mjs';

config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const edcIdArg = args.find(arg => arg.startsWith('--edc-id='));
  
  if (edcIdArg) {
    // Update specific EDC
    const edcId = parseInt(edcIdArg.split('=')[1]);
    console.log(`Updating literature for EDC ID: ${edcId}`);
    
    const connection = await mysql.createConnection(DATABASE_URL);
    
    try {
      const [edcs] = await connection.query(
        'SELECT id, chemical_name, cas_number FROM edc_chemicals WHERE id = ?',
        [edcId]
      );
      
      if (edcs.length === 0) {
        console.error(`ERROR: EDC with ID ${edcId} not found`);
        process.exit(1);
      }
      
      const result = await updateLiteratureForEDC(connection, edcs[0]);
      
      console.log('\nUpdate complete:');
      console.log(`Chemical: ${result.chemical_name}`);
      console.log(`Articles found: ${result.articles_found}`);
      console.log(`Articles added: ${result.articles_added}`);
      console.log(`Status: ${result.status}`);
      
    } finally {
      await connection.end();
    }
    
  } else {
    // Run full monthly update
    console.log('Running monthly literature update for all EDCs...\n');
    
    const results = await runMonthlyLiteratureUpdate(DATABASE_URL);
    
    console.log('\n========================================');
    console.log('MONTHLY UPDATE SUMMARY');
    console.log('========================================');
    console.log(`Total EDCs: ${results.total_edcs}`);
    console.log(`Successful updates: ${results.successful}`);
    console.log(`Failed updates: ${results.failed}`);
    console.log(`Total articles found: ${results.total_articles_found}`);
    console.log(`Total articles added: ${results.total_articles_added}`);
    console.log('========================================\n');
    
    // Show details for EDCs with new articles
    const edcsWithNewArticles = results.details.filter(d => d.articles_added > 0);
    
    if (edcsWithNewArticles.length > 0) {
      console.log('EDCs with new articles:');
      edcsWithNewArticles.forEach(d => {
        console.log(`  - ${d.chemical_name}: ${d.articles_added} new articles`);
      });
    }
    
    // Show failures
    const failures = results.details.filter(d => d.status === 'failed');
    
    if (failures.length > 0) {
      console.log('\nFailed updates:');
      failures.forEach(d => {
        console.log(`  - ${d.chemical_name}: ${d.error}`);
      });
    }
  }
  
  console.log('\nDone!');
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
