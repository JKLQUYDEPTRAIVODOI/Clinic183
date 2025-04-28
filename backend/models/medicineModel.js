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
      const { name, description, price, unit_in_stock, unit } = medicineData;
      
      // Kiểm tra và chuẩn bị dữ liệu
      const insertData = {
        name: name || null,
        description: description || null,
        price: !isNaN(parseFloat(price)) ? parseFloat(price) : 0,
        unit_in_stock: !isNaN(parseInt(unit_in_stock)) ? parseInt(unit_in_stock) : 0,
        unit: unit || 'Viên'
      };

      // Tạo câu query động
      const fields = Object.keys(insertData).join(', ');
      const placeholders = Object.keys(insertData).map(() => '?').join(', ');
      const values = Object.values(insertData);

      console.log('Inserting medicine with data:', insertData); // Debug log

      const [result] = await db.execute(
        `INSERT INTO medicines (${fields}) VALUES (${placeholders})`,
        values
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
      const { name, description, price, unit_in_stock, unit } = medicineData;
      
      // Kiểm tra và chuẩn bị dữ liệu
      const updateData = {
        name: name || null,
        description: description || null,
        price: !isNaN(parseFloat(price)) ? parseFloat(price) : 0,
        unit_in_stock: !isNaN(parseInt(unit_in_stock)) ? parseInt(unit_in_stock) : 0,
        unit: unit || 'Viên'
      };

      console.log('Updating medicine with data:', updateData); // Debug log

      // Tạo câu query động dựa trên các trường có giá trị
      const updateFields = Object.entries(updateData)
        .map(([key, value]) => `${key} = ?`)
        .join(', ');
      
      const values = [...Object.values(updateData), id];

      const [result] = await db.execute(
        `UPDATE medicines SET ${updateFields} WHERE id = ?`,
        values
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
      const parsedQuantity = !isNaN(parseInt(quantity)) ? parseInt(quantity) : 0;
      console.log('Updating stock with quantity:', parsedQuantity); // Debug log

      const [result] = await db.execute(
        `UPDATE medicines SET unit_in_stock = unit_in_stock + ? WHERE id = ?`,
        [parsedQuantity, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating medicine stock:', error);
      throw error;
    }
  }
}

module.exports = Medicine; 