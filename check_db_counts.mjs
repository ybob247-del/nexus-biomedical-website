import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  // Count EDC chemicals
  const [edcCount] = await connection.query('SELECT COUNT(*) as count FROM edc_chemicals');
  console.log(`\n✅ EDC Chemicals in database: ${edcCount[0].count}`);
  
  // Check if literature table exists
  const [tables] = await connection.query("SHOW TABLES LIKE 'edc_literature_references'");
  
  if (tables.length > 0) {
    const [litCount] = await connection.query('SELECT COUNT(*) as count FROM edc_literature_references');
    console.log(`✅ Literature references in database: ${litCount[0].count}`);
  } else {
    console.log(`❌ edc_literature_references table does not exist yet`);
  }
  
  // Check other tables
  const [assessments] = await connection.query('SELECT COUNT(*) as count FROM user_assessments');
  console.log(`✅ User assessments: ${assessments[0].count}`);
  
  // Check if certain tables exist
  const tablesToCheck = [
    'supplement_protocols',
    'product_database',
    'exposure_assessments',
    'recommendations',
    'progress_tracking'
  ];
  
  console.log('\n📊 Table Status:');
  for (const table of tablesToCheck) {
    const [exists] = await connection.query(`SHOW TABLES LIKE '${table}'`);
    if (exists.length > 0) {
      const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ✅ ${table}: ${count[0].count} records`);
    } else {
      console.log(`  ❌ ${table}: NOT CREATED`);
    }
  }
  
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}
