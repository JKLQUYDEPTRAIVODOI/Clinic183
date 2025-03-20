const db = require('../config/db');

class Medicine {
  // Lấy tất cả thuốc
  static async getAll() {
    try {
      const [medicines] = await db.execute(
        `SELECT * FROM medicines ORDER BY name ASC`
      );
      return medicines;
    } catch (error) {
      console.error('Error getting medicines:', error);
      throw error;
    }
  }

  // Lấy thuốc theo ID
  static async getById(id) {
    try {
      const [medicines] = await db.execute(
        `SELECT * FROM medicines WHERE id = ?`,
        [id]
      );
      return medicines.length > 0 ? medicines[0] : null;
    } catch (error) {
      console.error('Error getting medicine by id:', error);
      throw error;
    }
  }

  // Tìm kiếm thuốc theo tên
  static async searchByName(name) {
    try {
      const [medicines] = await db.execute(
        `SELECT * FROM medicines WHERE name LIKE ? ORDER BY name ASC`,
        [`%${name}%`]
      );
      return medicines;
    } catch (error) {
      console.error('Error searching medicines:', error);
      throw error;
    }
  }

  // Thêm thuốc mới
  static async create(medicineData) {
    try {
      const { name, description, price, stock } = medicineData;
      const [result] = await db.execute(
        `INSERT INTO medicines (name, description, price, stock) VALUES (?, ?, ?, ?)`,
        [name, description, price, stock || 0]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating medicine:', error);
      throw error;
    }
  }

  // Cập nhật thuốc
  static async update(id, medicineData) {
    try {
      const { name, description, price, stock } = medicineData;
      const [result] = await db.execute(
        `UPDATE medicines SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?`,
        [name, description, price, stock, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  }

  // Xóa thuốc
  static async delete(id) {
    try {
      const [result] = await db.execute(
        `DELETE FROM medicines WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  }

  // Cập nhật số lượng thuốc trong kho
  static async updateStock(id, quantity) {
    try {
      const [result] = await db.execute(
        `UPDATE medicines SET stock = stock + ? WHERE id = ?`,
        [quantity, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating medicine stock:', error);
      throw error;
    }
  }
}

module.exports = Medicine; 