const db = require('../config/db');

const runMigration = async () => {
  try {
    // Drop foreign key constraints
    console.log('Dropping foreign key constraints...');
    await db.execute('SET FOREIGN_KEY_CHECKS = 0;');
    await db.execute('ALTER TABLE appointments DROP FOREIGN KEY IF EXISTS appointments_ibfk_1;');
    await db.execute('ALTER TABLE appointments DROP FOREIGN KEY IF EXISTS appointments_ibfk_2;');
    
    // Modify columns to allow NULL
    console.log('Modifying columns to allow NULL...');
    await db.execute('ALTER TABLE appointments MODIFY COLUMN patient_id INT NULL DEFAULT NULL;');
    await db.execute('ALTER TABLE appointments MODIFY COLUMN doctor_id INT NULL DEFAULT NULL;');
    
    // Add back the foreign key constraints
    console.log('Adding back foreign key constraints...');
    await db.execute(`
      ALTER TABLE appointments 
      ADD CONSTRAINT appointments_ibfk_1 
      FOREIGN KEY (patient_id) 
      REFERENCES patients(id) 
      ON DELETE CASCADE;
    `);
    
    await db.execute(`
      ALTER TABLE appointments 
      ADD CONSTRAINT appointments_ibfk_2 
      FOREIGN KEY (doctor_id) 
      REFERENCES doctors(id) 
      ON DELETE CASCADE;
    `);

    await db.execute('SET FOREIGN_KEY_CHECKS = 1;');
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migration:', error);
    await db.execute('SET FOREIGN_KEY_CHECKS = 1;').catch(console.error);
    process.exit(1);
  }
};

runMigration(); 