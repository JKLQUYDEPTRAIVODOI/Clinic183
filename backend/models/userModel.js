const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password, role = 'patient' } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [name, email, hashedPassword, role]);
    return result.insertId;
  }
  
  // Find user by email
  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }
  
  // Find user by ID
  static async findById(id) {
    const query = `SELECT id, name, email, role, created_at FROM users WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }
  
  // Update user
  static async update(id, userData) {
    const { name, email, role } = userData;
    
    const query = `
      UPDATE users
      SET name = ?, email = ?, role = ?
      WHERE id = ?
    `;
    
    const [result] = await db.execute(query, [name, email, role, id]);
    return result.affectedRows > 0;
  }
  
  // Delete user
  static async delete(id) {
    const query = `DELETE FROM users WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
  
  // Get all users
  static async getAll() {
    const query = `SELECT id, name, email, role, created_at FROM users`;
    const [rows] = await db.execute(query);
    return rows;
  }
  
  // Compare password
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 