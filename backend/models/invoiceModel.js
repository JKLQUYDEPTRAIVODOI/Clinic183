const db = require('../config/db');

class Invoice {
  // Create a new invoice
  static async create(invoiceData) {
    const connection = await db.getConnection();
    try {
      // Start transaction
      await connection.beginTransaction();
      
      const { patientId, totalAmount, paymentStatus, items } = invoiceData;
      
      // Insert invoice
      const [invoiceResult] = await connection.execute(
        `INSERT INTO invoices (patient_id, total_amount, payment_status) 
         VALUES (?, ?, ?)`,
        [patientId, totalAmount, paymentStatus || 'pending']
      );
      
      const invoiceId = invoiceResult.insertId;
      
      // Insert invoice items
      if (items && items.length > 0) {
        const itemValues = items.map(item => [
          invoiceId,
          item.type || 'service',
          item.itemId || null,
          item.quantity || 1,
          item.price,
          item.name // Thêm tên mục vào bảng
        ]);
        
        const placeholders = items.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        
        await connection.execute(
          `INSERT INTO invoice_items (invoice_id, item_type, item_id, quantity, price, name) 
           VALUES ${placeholders}`,
          itemValues.flat()
        );
      }
      
      // Commit transaction
      await connection.commit();
      
      return invoiceId;
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      console.error('Error creating invoice:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all invoices with pagination
  static async getAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      // Get invoices
      const [invoices] = await db.execute(
        `SELECT i.*, 
                p.user_id,
                u.name as patient_name
         FROM invoices i
         JOIN patients p ON i.patient_id = p.id
         JOIN users u ON p.user_id = u.id
         ORDER BY i.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      
      // Get total count
      const [countResult] = await db.execute('SELECT COUNT(*) as total FROM invoices');
      const totalCount = countResult[0].total;
      
      // Get items for each invoice
      for (const invoice of invoices) {
        const [items] = await db.execute(
          'SELECT * FROM invoice_items WHERE invoice_id = ?',
          [invoice.id]
        );
        invoice.items = items;
      }
      
      return {
        invoices,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  }

  // Get invoice by ID
  static async getById(id) {
    try {
      // Get invoice
      const [invoices] = await db.execute(
        `SELECT i.*, 
                p.user_id,
                u.name as patient_name
         FROM invoices i
         JOIN patients p ON i.patient_id = p.id
         JOIN users u ON p.user_id = u.id
         WHERE i.id = ?`,
        [id]
      );
      
      if (invoices.length === 0) {
        return null;
      }
      
      const invoice = invoices[0];
      
      // Get invoice items
      const [items] = await db.execute(
        'SELECT * FROM invoice_items WHERE invoice_id = ?',
        [id]
      );
      
      invoice.items = items;
      
      return invoice;
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw error;
    }
  }

  // Update invoice
  static async update(id, invoiceData) {
    const connection = await db.getConnection();
    try {
      // Start transaction
      await connection.beginTransaction();
      
      const { patientId, totalAmount, paymentStatus, paymentDate, items } = invoiceData;
      
      // Update invoice
      const [invoiceResult] = await connection.execute(
        `UPDATE invoices 
         SET patient_id = ?,
             total_amount = ?,
             payment_status = ?,
             payment_date = ?
         WHERE id = ?`,
        [
          patientId,
          totalAmount,
          paymentStatus,
          paymentStatus === 'paid' ? paymentDate || new Date() : null,
          id
        ]
      );
      
      // If items are provided, update them
      if (items) {
        // Delete existing items
        await connection.execute('DELETE FROM invoice_items WHERE invoice_id = ?', [id]);
        
        // Insert new items
        if (items.length > 0) {
          const itemValues = items.map(item => [
            id,
            item.type || 'service',
            item.itemId || null,
            item.quantity || 1,
            item.price,
            item.name
          ]);
          
          const placeholders = items.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
          
          await connection.execute(
            `INSERT INTO invoice_items (invoice_id, item_type, item_id, quantity, price, name) 
             VALUES ${placeholders}`,
            itemValues.flat()
          );
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      return invoiceResult.affectedRows > 0;
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      console.error('Error updating invoice:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update invoice status
  static async updateStatus(id, status, paymentDate = null) {
    try {
      const [result] = await db.execute(
        `UPDATE invoices 
         SET payment_status = ?,
             payment_date = ?
         WHERE id = ?`,
        [
          status,
          status === 'paid' ? paymentDate || new Date() : null,
          id
        ]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  // Delete invoice
  static async delete(id) {
    const connection = await db.getConnection();
    try {
      // Start transaction
      await connection.beginTransaction();
      
      // Delete invoice items
      await connection.execute('DELETE FROM invoice_items WHERE invoice_id = ?', [id]);
      
      // Delete invoice
      const [result] = await connection.execute('DELETE FROM invoices WHERE id = ?', [id]);
      
      // Commit transaction
      await connection.commit();
      
      return result.affectedRows > 0;
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      console.error('Error deleting invoice:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get invoices by patient ID
  static async getByPatientId(patientId) {
    try {
      // Get invoices
      const [invoices] = await db.execute(
        `SELECT * FROM invoices WHERE patient_id = ? ORDER BY created_at DESC`,
        [patientId]
      );
      
      // Get items for each invoice
      for (const invoice of invoices) {
        const [items] = await db.execute(
          'SELECT * FROM invoice_items WHERE invoice_id = ?',
          [invoice.id]
        );
        invoice.items = items;
      }
      
      return invoices;
    } catch (error) {
      console.error('Error getting patient invoices:', error);
      throw error;
    }
  }
}

module.exports = Invoice; 