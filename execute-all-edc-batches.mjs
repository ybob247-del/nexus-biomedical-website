import pg from 'pg';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL
});

await client.connect();

const batchFiles = [
  '/home/ubuntu/nexus-biomedical-website/db/exec_batch_02.sql',  // 15 PFAS
  '/home/ubuntu/nexus-biomedical-website/db/exec_batch_03.sql',  // 20 Pharmaceuticals
  '/home/ubuntu/nexus-biomedical-website/db/exec_batch_04.sql',  // 10 PCBs
  '/home/ubuntu/nexus-biomedical-website/db/exec_batch_05.sql',  // 20 Pesticides
  '/home/ubuntu/nexus-biomedical-website/db/exec_batch_06.sql',  // 15 Industrial
  '/home/ubuntu/nexus-biomedical-website/db/exec_batch_07.sql',  // 9 Flame retardants
];

let totalInserted = 0;

for (const file of batchFiles) {
  try {
    console.log(`\nProcessing: ${file}`);
    const sqlContent = readFileSync(file, 'utf-8');
    
    // Execute the INSERT
    await client.query(sqlContent);
    
    // Count how many were inserted
    const count = (sqlContent.match(/\('\d/g) || []).length;
    totalInserted += count;
    console.log(`✓ Inserted ${count} chemicals`);
  } catch (error) {
    console.error(`✗ Error in ${file}:`, error.message);
  }
}

// Get final count
const result = await client.query('SELECT COUNT(*) as total FROM edc_chemicals');
console.log(`\n========================================`);
console.log(`Total EDCs in database: ${result.rows[0].total}`);
console.log(`Newly inserted: ${totalInserted}`);
console.log(`========================================`);

await client.end();
