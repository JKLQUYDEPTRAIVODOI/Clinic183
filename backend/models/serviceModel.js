const db = require('../config/db');

class Service {
  // Lấy tất cả dịch vụ
  static async getAll() {
    try {
      const [services] = await db.execute(
        `SELECT * FROM services ORDER BY name ASC`
      );
      return services;
    } catch (error) {
      console.error('Error getting services:', error);
      throw error;
    }
  }

  // Lấy dịch vụ theo ID
  static async getById(id) {
    try {
      const [services] = await db.execute(
        `SELECT * FROM services WHERE id = ?`,
        [id]
      );
      return services.length > 0 ? services[0] : null;
    } catch (error) {
      console.error('Error getting service by id:', error);
      throw error;
    }
  }

  // Tìm kiếm dịch vụ theo tên
  static async searchByName(name) {
    try {
      const [services] = await db.execute(
        `SELECT * FROM services WHERE name LIKE ? ORDER BY name ASC`,
        [`%${name}%`]
      );
      return services;
    } catch (error) {
      console.error('Error searching services:', error);
      throw error;
    }
  }

  // Thêm dịch vụ mới
  static async create(serviceData) {
    try {
      const { name, description, price } = serviceData;
      const [result] = await db.execute(
        `INSERT INTO services (name, description, price) VALUES (?, ?, ?)`,
        [name, description, price]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  // Cập nhật dịch vụ
  static async update(id, serviceData) {
    try {
      const { name, description, price } = serviceData;
      const [result] = await db.execute(
        `UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?`,
        [name, description, price, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  // Xóa dịch vụ
  static async delete(id) {
    try {
      const [result] = await db.execute(
        `DELETE FROM services WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
}

module.exports = Service; 