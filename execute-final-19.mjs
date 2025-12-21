import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const sql = readFileSync('/home/ubuntu/nexus-biomedical-website/db/final_19_truly_unique.sql', 'utf-8');
  
  const lines = sql.split('\n').filter(line => line.trim().startsWith('('));
  
  let added = 0;
  let duplicates = 0;
  const addedChemicals = [];
  
  for (const line of lines) {
    try {
      const insertSQL = `INSERT INTO edc_chemicals (cas_number, chemical_name, common_names, chemical_class, edc_category, hormone_systems_affected, health_effects, common_sources, exposure_routes, bioaccumulation_potential, regulatory_status, epa_data) VALUES ${line.trim().replace(/,$/, '')};`;
      
      await connection.query(insertSQL);
      
      // Extract chemical name for reporting
      const match = line.match(/'([^']+)',\s*'([^']+)'/);
      if (match) {
        addedChemicals.push(match[2]);
      }
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
  
  if (addedChemicals.length > 0) {
    console.log('\nNewly added chemicals:');
    addedChemicals.forEach(name => console.log(`  - ${name}`));
  }
  
} finally {
  await connection.end();
}
