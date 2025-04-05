const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clinic_hms'
  });

  try {
    console.log('Running migration...');
    
    // Read and execute the migration SQL
    const migrationPath = path.join(__dirname, '../migrations/update_appointments_nullable.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    await connection.query(migrationSQL);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    await connection.end();
  }
}

runMigration(); 