const db = require('../config/db');

class Service {
  // Lấy tất cả dịch vụ
  static async getAll() {
    try {
      const [services] = await db.execute(
        `SELECT s.*, COALESCE(sp.price, 0) as price 
         FROM services s 
         LEFT JOIN service_prices sp ON s.id = sp.service_id 
         AND sp.effective_to IS NULL 
         ORDER BY s.name ASC`
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
        `SELECT s.*, COALESCE(sp.price, 0) as price 
         FROM services s 
         LEFT JOIN service_prices sp ON s.id = sp.service_id 
         AND sp.effective_to IS NULL 
         WHERE s.id = ?`,
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
        `SELECT s.*, COALESCE(sp.price, 0) as price 
         FROM services s 
         LEFT JOIN service_prices sp ON s.id = sp.service_id 
         AND sp.effective_to IS NULL 
         WHERE s.name LIKE ? 
         ORDER BY s.name ASC`,
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
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { name, description, price } = serviceData;
      
      // Insert into services table
      const [serviceResult] = await connection.execute(
        `INSERT INTO services (name, description) VALUES (?, ?)`,
        [name, description]
      );
      
      const serviceId = serviceResult.insertId;

      // Insert initial price
      if (price) {
        await connection.execute(
          `INSERT INTO service_prices (service_id, price) VALUES (?, ?)`,
          [serviceId, price]
        );
      }

      await connection.commit();
      return serviceId;
    } catch (error) {
      await connection.rollback();
      console.error('Error creating service:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Cập nhật dịch vụ
  static async update(id, serviceData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { name, description, price } = serviceData;
      
      // Update services table
      await connection.execute(
        `UPDATE services SET name = ?, description = ? WHERE id = ?`,
        [name, description, id]
      );

      // Update price if changed
      const [currentPrice] = await connection.execute(
        `SELECT price FROM service_prices 
         WHERE service_id = ? AND effective_to IS NULL`,
        [id]
      );

      if (currentPrice.length === 0 || currentPrice[0].price !== price) {
        // Set effective_to for current price
        await connection.execute(
          `UPDATE service_prices 
           SET effective_to = CURRENT_TIMESTAMP 
           WHERE service_id = ? AND effective_to IS NULL`,
          [id]
        );

        // Insert new price
        await connection.execute(
          `INSERT INTO service_prices (service_id, price) VALUES (?, ?)`,
          [id, price]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Error updating service:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Xóa dịch vụ
  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Delete from service_prices first
      await connection.execute(
        `DELETE FROM service_prices WHERE service_id = ?`,
        [id]
      );

      // Then delete from services
      const [result] = await connection.execute(
        `DELETE FROM services WHERE id = ?`,
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Error deleting service:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy lịch sử giá của dịch vụ
  static async getPriceHistory(id) {
    try {
      const [history] = await db.execute(
        `SELECT * FROM service_prices 
         WHERE service_id = ? 
         ORDER BY effective_from DESC`,
        [id]
      );
      return history;
    } catch (error) {
      console.error('Error getting service price history:', error);
      throw error;
    }
  }
}

module.exports = Service; 