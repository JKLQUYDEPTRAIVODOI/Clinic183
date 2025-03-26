const db = require('../config/db');

class Patient {
  // Create new patient
  static async create({ user_id }) {
    const query = `
      INSERT INTO patients (user_id)
      VALUES (?)
    `;
    try {
      const [result] = await db.execute(query, [user_id]);
      return result.insertId;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  // Get all patients
  static async getAll() {
    const query = `
      SELECT p.*, u.name, u.email, u.created_at
      FROM patients p
      LEFT JOIN users u ON p.user_id = u.id
    `;
    try {
      const [patients] = await db.query(query);
      return patients;
    } catch (error) {
      console.error('Error getting patients:', error);
      throw error;
    }
  }

  // Get patient by ID
  static async getById(id) {
    const query = `
      SELECT p.*, u.name, u.email, u.created_at
      FROM patients p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;
    try {
      const [patients] = await db.query(query, [id]);
      return patients[0];
    } catch (error) {
      console.error('Error getting patient:', error);
      throw error;
    }
  }

  // Update patient
  static async update(id, patientData) {
    const {
      date_of_birth,
      gender,
      blood_group,
      address,
      phone,
      medical_history,
      allergies,
      current_medications
    } = patientData;

    const query = `
      UPDATE patients 
      SET 
        date_of_birth = ?,
        gender = ?,
        blood_group = ?,
        address = ?,
        phone = ?,
        medical_history = ?,
        allergies = ?,
        current_medications = ?
      WHERE id = ?
    `;

    try {
      const [result] = await db.query(query, [
        date_of_birth,
        gender,
        blood_group,
        address,
        phone,
        medical_history,
        allergies,
        current_medications,
        id
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  // Tìm kiếm bệnh nhân theo tên
  static async searchByName(name) {
    try {
      const [patients] = await db.execute(
        `SELECT p.id, p.user_id, u.name, p.date_of_birth, p.gender, p.phone 
         FROM patients p 
         JOIN users u ON p.user_id = u.id 
         WHERE u.name LIKE ? 
         ORDER BY u.name ASC`,
        [`%${name}%`]
      );
      return patients;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }

  // Lấy bệnh nhân theo user_id
  static async getByUserId(userId) {
    try {
      const [patients] = await db.execute(
        `SELECT p.*, u.name, u.email 
         FROM patients p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.user_id = ?`,
        [userId]
      );
      return patients.length > 0 ? patients[0] : null;
    } catch (error) {
      console.error('Error getting patient by user_id:', error);
      throw error;
    }
  }
}

module.exports = Patient; 