import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const files = [
  '/home/ubuntu/nexus-biomedical-website/db/final_part1.sql',
  '/home/ubuntu/nexus-biomedical-website/db/final_part2.sql',
  '/home/ubuntu/nexus-biomedical-website/db/final_part3.sql',
  '/home/ubuntu/nexus-biomedical-website/db/final_part4.sql',
  '/home/ubuntu/nexus-biomedical-website/db/final_part5.sql',
];

let totalAdded = 0;

for (const file of files) {
  try {
    console.log(`\nExecuting: ${file.split('/').pop()}`);
    const sql = readFileSync(file, 'utf-8');
    await connection.query(sql);
    const count = (sql.match(/\('\d/g) || []).length;
    totalAdded += count;
    console.log(`✓ Added ${count} chemicals`);
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
  }
}

const [rows] = await connection.query('SELECT COUNT(*) as total FROM edc_chemicals');
console.log(`\n========================================`);
console.log(`Total EDCs in database: ${rows[0].total}`);
console.log(`Newly added in this run: ${totalAdded}`);
console.log(`========================================`);

await connection.end();
