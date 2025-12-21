import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const sql = readFileSync('/home/ubuntu/nexus-biomedical-website/db/final_45_unique_edcs.sql', 'utf-8');
  
  // Split into individual INSERT statements
  const lines = sql.split('\n').filter(line => line.trim().startsWith('('));
  
  let added = 0;
  let duplicates = 0;
  
  for (const line of lines) {
    try {
      const insertSQL = `INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES ${line.trim().replace(/,$/, '')};`;
      
      await connection.query(insertSQL);
      added++;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        duplicates++;
      } else {
        console.error('Error:', err.message);
      }
    }
  }
  
  const [result] = await connection.query('SELECT COUNT(*) as total FROM edc_chemicals');
  
  console.log(`\n========================================`);
  console.log(`Successfully added: ${added} EDCs`);
  console.log(`Duplicates skipped: ${duplicates}`);
  console.log(`Total EDCs in database: ${result[0].total}`);
  console.log(`========================================`);
  
} finally {
  await connection.end();
}
