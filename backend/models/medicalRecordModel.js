const db = require('../config/db');

class MedicalRecord {
  // Get all medical records
  static async getAll() {
    try {
      const [records] = await db.query(`
        SELECT mr.*, 
               a.appointment_date, a.appointment_time,
               u1.name as patient_name, p.id as patient_id,
               u2.name as doctor_name, d.id as doctor_id
        FROM medical_records mr
        JOIN appointments a ON mr.appointment_id = a.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u1 ON p.user_id = u1.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u2 ON d.user_id = u2.id
        ORDER BY mr.created_at DESC
      `);
      return records;
    } catch (error) {
      throw error;
    }
  }

  // Get medical record by ID
  static async getById(id) {
    try {
      const [records] = await db.query(`
        SELECT mr.*, 
               a.appointment_date, a.appointment_time,
               u1.name as patient_name, p.id as patient_id,
               u2.name as doctor_name, d.id as doctor_id,
               d.specialization as doctor_specialization
        FROM medical_records mr
        JOIN appointments a ON mr.appointment_id = a.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u1 ON p.user_id = u1.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u2 ON d.user_id = u2.id
        WHERE mr.id = ?
      `, [id]);

      // Get prescription if exists
      if (records[0]) {
        const [prescriptions] = await db.query(`
          SELECT p.*, 
                 pi.medicine_id,
                 m.name as medicine_name,
                 pi.dosage,
                 pi.frequency,
                 pi.duration,
                 pi.instructions
          FROM prescriptions p
          JOIN prescription_items pi ON p.id = pi.prescription_id
          JOIN medicines m ON pi.medicine_id = m.id
          WHERE p.medical_record_id = ?
        `, [id]);

        if (prescriptions.length > 0) {
          records[0].prescription = {
            id: prescriptions[0].id,
            items: prescriptions.map(item => ({
              medicine_name: item.medicine_name,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              instructions: item.instructions
            }))
          };
        }
      }

      return records[0];
    } catch (error) {
      throw error;
    }
  }

  // Get medical records by patient ID
  static async getByPatientId(patientId) {
    try {
      // Get medical records with basic info
      const [records] = await db.query(`
        SELECT mr.*, 
               a.appointment_date, a.appointment_time,
               u2.name as doctor_name, d.id as doctor_id,
               d.specialization as doctor_specialization
        FROM medical_records mr
        JOIN appointments a ON mr.appointment_id = a.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u2 ON d.user_id = u2.id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `, [patientId]);

      // Get prescriptions for each medical record
      for (let record of records) {
        // Get prescription
        const [prescriptions] = await db.query(`
          SELECT p.*, 
                 pi.medicine_id,
                 m.name as medicine_name,
                 pi.dosage,
                 pi.frequency,
                 pi.duration,
                 pi.instructions
          FROM prescriptions p
          JOIN prescription_items pi ON p.id = pi.prescription_id
          JOIN medicines m ON pi.medicine_id = m.id
          WHERE p.medical_record_id = ?
        `, [record.id]);

        if (prescriptions.length > 0) {
          record.prescription = {
            id: prescriptions[0].id,
            medicines: prescriptions.map(item => ({
              name: item.medicine_name,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              instructions: item.instructions
            }))
          };
        }

        // Get tests (if you have a tests table)
        // const [tests] = await db.query(`
        //   SELECT t.*
        //   FROM tests t
        //   WHERE t.medical_record_id = ?
        // `, [record.id]);
        // if (tests.length > 0) {
        //   record.tests = tests;
        // }
      }

      return records;
    } catch (error) {
      throw error;
    }
  }

  // Get medical records by doctor ID
  static async getByDoctorId(doctorId) {
    try {
      const [records] = await db.query(`
        SELECT mr.*, 
               a.appointment_date, a.appointment_time,
               u1.name as patient_name, p.id as patient_id
        FROM medical_records mr
        JOIN appointments a ON mr.appointment_id = a.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u1 ON p.user_id = u1.id
        WHERE a.doctor_id = ?
        ORDER BY mr.created_at DESC
      `, [doctorId]);
      return records;
    } catch (error) {
      throw error;
    }
  }

  // Create new medical record
  static async create(medicalRecordData) {
    try {
      const { appointment_id, diagnosis, notes } = medicalRecordData;
      const [result] = await db.query(
        'INSERT INTO medical_records (appointment_id, diagnosis, notes) VALUES (?, ?, ?)',
        [appointment_id, diagnosis, notes]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update medical record
  static async update(id, medicalRecordData) {
    try {
      const { diagnosis, notes } = medicalRecordData;
      const [result] = await db.query(
        'UPDATE medical_records SET diagnosis = ?, notes = ? WHERE id = ?',
        [diagnosis, notes, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete medical record
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM medical_records WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MedicalRecord; 