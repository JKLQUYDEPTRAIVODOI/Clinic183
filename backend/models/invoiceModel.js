const db = require('../config/db');

class Invoice {
  // Create a new invoice
  static async create(invoiceData) {
    const { 
      appointment_id, 
      tax_percent = 10,
      discount_percent = 0,
      payment_method = '',
      paid_amount = 0,
      notes = '',
      items 
    } = invoiceData;
    
    // Validate input data
    if (!appointment_id || !Array.isArray(items) || items.length === 0) {
      throw new Error('Dữ liệu hóa đơn không hợp lệ');
    }

    // Validate each item
    for (const item of items) {
      if (!item.type || !item.id || !item.quantity) {
        throw new Error('Dữ liệu chi tiết hóa đơn không hợp lệ');
      }
      if (!['service', 'medicine'].includes(item.type)) {
        throw new Error('Loại mục không hợp lệ');
      }
      if (item.quantity <= 0) {
        throw new Error('Số lượng phải lớn hơn 0');
      }
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if appointment exists and is completed
      const [appointment] = await connection.query(
        'SELECT * FROM appointments WHERE id = ? AND status = ?',
        [appointment_id, 'completed']
      );

      if (!appointment || appointment.length === 0) {
        throw new Error('Cuộc hẹn không tồn tại hoặc chưa hoàn thành');
      }

      // Check if invoice already exists for this appointment
      const [existingInvoice] = await connection.query(
        'SELECT id FROM invoices WHERE appointment_id = ?',
        [appointment_id]
      );

      if (existingInvoice && existingInvoice.length > 0) {
        throw new Error('Đã tồn tại hóa đơn cho cuộc hẹn này');
      }

      // Calculate totals
      let subtotal = 0;
      const invoiceItems = [];

      for (const item of items) {
        let unit_price_at_time = 0;
        let name = '';
        let description = '';

        if (item.type === 'service') {
          // Get current service price
          const [servicePrice] = await connection.query(
            `SELECT sp.price, s.name, s.description 
             FROM service_prices sp
             JOIN services s ON sp.service_id = s.id
             WHERE sp.service_id = ? 
             AND sp.effective_from <= NOW()
             AND (sp.effective_to IS NULL OR sp.effective_to > NOW())`,
            [item.id]
          );
          
          if (!servicePrice || servicePrice.length === 0) {
            throw new Error(`Không tìm thấy giá dịch vụ với ID ${item.id}`);
          }
          
          unit_price_at_time = servicePrice[0].price;
          name = servicePrice[0].name;
          description = servicePrice[0].description;
        } else {
          // Get medicine price and check stock
          const [medicine] = await connection.query(
            'SELECT name, price, description, unit_in_stock FROM medicines WHERE id = ?',
            [item.id]
          );
          
          if (!medicine || medicine.length === 0) {
            throw new Error(`Thuốc với ID ${item.id} không tồn tại`);
          }
          
          if (medicine[0].unit_in_stock < item.quantity) {
            throw new Error(`Thuốc ${medicine[0].name} không đủ số lượng trong kho`);
          }
          
          unit_price_at_time = medicine[0].price;
          name = medicine[0].name;
          description = medicine[0].description;
        }

        const item_subtotal = unit_price_at_time * item.quantity - (item.discount_amount || 0);
        subtotal += item_subtotal;

        invoiceItems.push({
          item_type: item.type,
          item_id: item.id,
          quantity: item.quantity,
          unit_price_at_time,
          discount_amount: item.discount_amount || 0,
          name,
          description
        });
      }

      // Calculate tax and discount amounts
      const tax_amount = subtotal * (tax_percent / 100);
      const discount_amount = subtotal * (discount_percent / 100);

      // Insert invoice
      const [invoiceResult] = await connection.query(
        `INSERT INTO invoices (
          appointment_id,
          subtotal,
          tax_percent,
          tax_amount,
          discount_percent,
          discount_amount,
          paid_amount,
          payment_method,
          payment_status,
          notes,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          appointment_id,
          subtotal,
          tax_percent,
          tax_amount,
          discount_percent,
          discount_amount,
          paid_amount,
          payment_method,
          paid_amount >= (subtotal + tax_amount - discount_amount) ? 'paid' : 'pending',
          notes
        ]
      );

      const invoice_id = invoiceResult.insertId;

      // Insert invoice items
      for (const item of invoiceItems) {
        await connection.query(
          `INSERT INTO invoice_items (
            invoice_id,
            item_type,
            item_id,
            quantity,
            unit_price_at_time,
            discount_amount
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            invoice_id,
            item.item_type,
            item.item_id,
            item.quantity,
            item.unit_price_at_time,
            item.discount_amount
          ]
        );

        // Update medicine stock if it's a medicine
        if (item.item_type === 'medicine') {
          await connection.query(
            'UPDATE medicines SET unit_in_stock = unit_in_stock - ? WHERE id = ?',
            [item.quantity, item.item_id]
          );
        }
      }

      await connection.commit();

      // Get the created invoice with all details
      return await Invoice.getById(invoice_id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all invoices with pagination
  static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    try {
      // Get total count
      const [countResult] = await db.execute('SELECT COUNT(*) as total FROM invoices');
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      // Get invoices with details
      const [invoices] = await db.execute(`
        SELECT 
          i.*,
          a.appointment_date,
          a.appointment_time,
          p.id as patient_id,
          u.name as patient_name,
          d.id as doctor_id,
          du.name as doctor_name
        FROM invoices i
        JOIN appointments a ON i.appointment_id = a.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        ORDER BY i.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);

      // Get items for each invoice
      for (let invoice of invoices) {
        const [items] = await db.execute(`
          SELECT 
            ii.*,
            CASE 
              WHEN ii.item_type = 'service' THEN s.name
              WHEN ii.item_type = 'medicine' THEN m.name
            END as name,
            CASE 
              WHEN ii.item_type = 'service' THEN s.description
              WHEN ii.item_type = 'medicine' THEN m.description
            END as description,
            CASE 
              WHEN ii.item_type = 'service' THEN sp.price
              WHEN ii.item_type = 'medicine' THEN m.price
            END as current_price
          FROM invoice_items ii
          LEFT JOIN services s ON ii.item_type = 'service' AND ii.item_id = s.id
          LEFT JOIN medicines m ON ii.item_type = 'medicine' AND ii.item_id = m.id
          LEFT JOIN service_prices sp ON ii.item_type = 'service' 
            AND ii.item_id = sp.service_id
            AND sp.effective_from <= NOW()
            AND (sp.effective_to IS NULL OR sp.effective_to > NOW())
          WHERE ii.invoice_id = ?
        `, [invoice.id]);
        invoice.items = items;
      }

      return {
        invoices,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages
        }
      };
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }

  // Get invoice by ID
  static async getById(id) {
    try {
      const [invoices] = await db.execute(`
        SELECT 
          i.*,
          a.appointment_date,
          a.appointment_time,
          p.id as patient_id,
          u.name as patient_name,
          d.id as doctor_id,
          du.name as doctor_name
        FROM invoices i
        JOIN appointments a ON i.appointment_id = a.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        WHERE i.id = ?
      `, [id]);

      if (invoices.length === 0) {
        return null;
      }

      const invoice = invoices[0];

      const [items] = await db.execute(`
        SELECT 
          ii.*,
          CASE 
            WHEN ii.item_type = 'service' THEN s.name
            WHEN ii.item_type = 'medicine' THEN m.name
          END as name,
          CASE 
            WHEN ii.item_type = 'service' THEN s.description
            WHEN ii.item_type = 'medicine' THEN m.description
          END as description,
          CASE 
            WHEN ii.item_type = 'service' THEN sp.price
            WHEN ii.item_type = 'medicine' THEN m.price
          END as current_price
        FROM invoice_items ii
        LEFT JOIN services s ON ii.item_type = 'service' AND ii.item_id = s.id
        LEFT JOIN medicines m ON ii.item_type = 'medicine' AND ii.item_id = m.id
        LEFT JOIN service_prices sp ON ii.item_type = 'service' 
          AND ii.item_id = sp.service_id
          AND sp.effective_from <= NOW()
          AND (sp.effective_to IS NULL OR sp.effective_to > NOW())
        WHERE ii.invoice_id = ?
      `, [id]);

      invoice.items = items;
      return invoice;
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  // Update invoice
  static async update(id, invoiceData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { 
        tax_percent,
        tax_amount,
        discount_percent,
        discount_amount,
        payment_method,
        payment_status,
        paid_amount,
        notes,
        items 
      } = invoiceData;

      // Get current invoice to compare changes
      const [currentInvoice] = await connection.query(
        'SELECT * FROM invoices WHERE id = ?',
        [id]
      );

      if (!currentInvoice || currentInvoice.length === 0) {
        throw new Error('Hóa đơn không tồn tại');
      }

      // Calculate new subtotal if items are provided
      let subtotal = currentInvoice[0].subtotal;
      if (items && items.length > 0) {
        subtotal = 0;
        
        // Get current items to restore medicine stock
        const [currentItems] = await connection.query(
          'SELECT * FROM invoice_items WHERE invoice_id = ?',
          [id]
        );

        // Restore medicine stock for current items
        for (const item of currentItems) {
          if (item.item_type === 'medicine') {
            await connection.query(
              'UPDATE medicines SET unit_in_stock = unit_in_stock + ? WHERE id = ?',
              [item.quantity, item.item_id]
            );
          }
        }

        // Delete current items
        await connection.query(
          'DELETE FROM invoice_items WHERE invoice_id = ?',
          [id]
        );

        // Insert new items and calculate new subtotal
        for (const item of items) {
          let unit_price_at_time = 0;

          if (item.type === 'service') {
            const [servicePrice] = await connection.query(
              `SELECT sp.price 
               FROM service_prices sp
               WHERE sp.service_id = ? 
               AND sp.effective_from <= NOW()
               AND (sp.effective_to IS NULL OR sp.effective_to > NOW())`,
              [item.id]
            );
            
            if (!servicePrice || servicePrice.length === 0) {
              throw new Error(`Không tìm thấy giá dịch vụ với ID ${item.id}`);
            }
            
            unit_price_at_time = servicePrice[0].price;
          } else {
            const [medicine] = await connection.query(
              'SELECT price, unit_in_stock FROM medicines WHERE id = ?',
              [item.id]
            );
            
            if (!medicine || medicine.length === 0) {
              throw new Error(`Thuốc với ID ${item.id} không tồn tại`);
            }
            
            if (medicine[0].unit_in_stock < item.quantity) {
              throw new Error(`Thuốc không đủ số lượng trong kho`);
            }
            
            unit_price_at_time = medicine[0].price;

            // Update medicine stock
            await connection.query(
              'UPDATE medicines SET unit_in_stock = unit_in_stock - ? WHERE id = ?',
              [item.quantity, item.item_id]
            );
          }

          // Insert new item
          await connection.query(
            `INSERT INTO invoice_items (
              invoice_id,
              item_type,
              item_id,
              quantity,
              unit_price_at_time,
              discount_amount
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              id,
              item.type,
              item.id,
              item.quantity,
              unit_price_at_time,
              item.discount_amount || 0
            ]
          );

          subtotal += unit_price_at_time * item.quantity - (item.discount_amount || 0);
        }
      }

      // Calculate new tax and discount amounts
      const newTaxAmount = tax_percent ? subtotal * (tax_percent / 100) : tax_amount;
      const newDiscountAmount = discount_percent ? subtotal * (discount_percent / 100) : discount_amount;

      // Update invoice
      await connection.query(
        `UPDATE invoices SET
          subtotal = ?,
          tax_percent = ?,
          tax_amount = ?,
          discount_percent = ?,
          discount_amount = ?,
          payment_method = ?,
          payment_status = ?,
          paid_amount = ?,
          payment_date = ?,
          notes = ?,
          updated_at = NOW()
        WHERE id = ?`,
        [
          subtotal,
          tax_percent || currentInvoice[0].tax_percent,
          newTaxAmount,
          discount_percent || currentInvoice[0].discount_percent,
          newDiscountAmount,
          payment_method || currentInvoice[0].payment_method,
          payment_status || currentInvoice[0].payment_status,
          paid_amount || currentInvoice[0].paid_amount,
          payment_status === 'paid' ? new Date() : null,
          notes || currentInvoice[0].notes,
          id
        ]
      );

      await connection.commit();
      return await Invoice.getById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update invoice status
  static async updateStatus(id, status) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      if (!['pending', 'paid', 'cancelled'].includes(status)) {
        throw new Error('Trạng thái không hợp lệ');
      }

      const [invoice] = await connection.execute(
        'SELECT * FROM invoices WHERE id = ?',
        [id]
      );

      if (invoice.length === 0) {
        throw new Error('Không tìm thấy hóa đơn');
      }

      await connection.execute(
        `UPDATE invoices SET 
          payment_status = ?,
          payment_date = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [status, status === 'paid' ? new Date() : null, id]
      );

      await connection.commit();
      return await Invoice.getById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete invoice
  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Delete invoice items first
      await connection.execute(
        'DELETE FROM invoice_items WHERE invoice_id = ?',
        [id]
      );

      // Then delete invoice
      const [result] = await connection.execute(
        'DELETE FROM invoices WHERE id = ?',
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
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