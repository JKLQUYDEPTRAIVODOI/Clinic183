const db = require('../config/db');

class Doctor {
  // Get all doctors
  static async getAll() {
    const query = `
      SELECT d.*, u.name, u.email, u.created_at
      FROM doctors d
      LEFT JOIN users u ON d.user_id = u.id
    `;
    try {
      const [doctors] = await db.query(query);
      return doctors;
    } catch (error) {
      console.error('Error getting doctors:', error);
      throw error;
    }
  }

  // Get doctor by ID
  static async getById(id) {
    const query = `
      SELECT d.*, u.name, u.email, u.created_at
      FROM doctors d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `;
    try {
      const [doctors] = await db.query(query, [id]);
      return doctors[0];
    } catch (error) {
      console.error('Error getting doctor:', error);
      throw error;
    }
  }

  // Get doctor by user ID
  static async getByUserId(userId) {
    const query = `
      SELECT d.*, u.name, u.email, u.created_at
      FROM doctors d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.user_id = ?
    `;
    try {
      const [doctors] = await db.query(query, [userId]);
      return doctors[0];
    } catch (error) {
      console.error('Error getting doctor by user ID:', error);
      throw error;
    }
  }

  // Create new doctor
  static async create(doctorData) {
    const { user_id, specialization, experience_years, bio } = doctorData;
    const query = 'INSERT INTO doctors (user_id, specialization, experience_years, bio) VALUES (?, ?, ?, ?)';
    try {
      const [result] = await db.query(query, [user_id, specialization, experience_years || null, bio || null]);
      return result.insertId;
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  }

  // Update doctor
  static async update(id, doctorData) {
    const { specialization, experience_years, bio } = doctorData;
    const query = 'UPDATE doctors SET specialization = ?, experience_years = ?, bio = ? WHERE id = ?';
    try {
      const [result] = await db.query(query, [specialization, experience_years || null, bio || null, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
  }

  // Delete doctor
  static async delete(id) {
    const query = 'DELETE FROM doctors WHERE id = ?';
    try {
      const [result] = await db.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  }
}

module.exports = Doctor; 