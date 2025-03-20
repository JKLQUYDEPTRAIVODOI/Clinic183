const db = require('../config/db');

class Patient {
  // Lấy tất cả bệnh nhân
  static async getAll() {
    try {
      const [patients] = await db.execute(
        `SELECT p.id, p.user_id, u.name, p.date_of_birth, p.gender, p.phone 
         FROM patients p 
         JOIN users u ON p.user_id = u.id 
         ORDER BY u.name ASC`
      );
      return patients;
    } catch (error) {
      console.error('Error getting patients:', error);
      throw error;
    }
  }

  // Lấy bệnh nhân theo ID
  static async getById(id) {
    try {
      const [patients] = await db.execute(
        `SELECT p.*, u.name, u.email 
         FROM patients p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.id = ?`,
        [id]
      );
      return patients.length > 0 ? patients[0] : null;
    } catch (error) {
      console.error('Error getting patient by id:', error);
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
}

module.exports = Patient; 