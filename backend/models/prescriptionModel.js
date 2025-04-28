const db = require('../config/db');

class Prescription {
  // Lấy tất cả đơn thuốc
  static async getAll() {
    const query = `
      SELECT 
        p.*,
        m.diagnosis,
        m.notes as medical_record_notes,
        p_user.name as patient_name,
        d_user.name as doctor_name,
        a.appointment_date,
        a.appointment_time,
        a.id as appointment_id
      FROM prescriptions p
      JOIN medical_records m ON p.medical_record_id = m.id
      JOIN appointments a ON m.appointment_id = a.id
      JOIN patients pat ON a.patient_id = pat.id
      JOIN users p_user ON pat.user_id = p_user.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users d_user ON doc.user_id = d_user.id
      ORDER BY p.created_at DESC
    `;
    const [prescriptions] = await db.query(query);

    // Lấy chi tiết thuốc cho tất cả đơn thuốc
    const prescriptionIds = prescriptions.map(p => p.id);
    if (prescriptionIds.length > 0) {
      const itemsQuery = `
        SELECT pi.*, m.name as medicine_name, m.unit
        FROM prescription_items pi
        JOIN medicines m ON pi.medicine_id = m.id
        WHERE pi.prescription_id IN (?)
      `;
      const [items] = await db.query(itemsQuery, [prescriptionIds]);

      // Gán items vào đơn thuốc tương ứng
      prescriptions.forEach(prescription => {
        prescription.items = items.filter(item => item.prescription_id === prescription.id);
      });
    }

    return prescriptions;
  }

  // Lấy đơn thuốc theo ID
  static async getById(id) {
    const query = `
      SELECT 
        p.*,
        m.diagnosis,
        m.notes as medical_record_notes,
        p_user.name as patient_name,
        d_user.name as doctor_name,
        a.appointment_date,
        a.appointment_time,
        a.id as appointment_id
      FROM prescriptions p
      JOIN medical_records m ON p.medical_record_id = m.id
      JOIN appointments a ON m.appointment_id = a.id
      JOIN patients pat ON a.patient_id = pat.id
      JOIN users p_user ON pat.user_id = p_user.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users d_user ON doc.user_id = d_user.id
      WHERE p.id = ?
    `;
    const [prescriptions] = await db.query(query, [id]);
    if (prescriptions.length === 0) return null;

    // Lấy chi tiết thuốc trong đơn
    const itemsQuery = `
      SELECT pi.*, m.name as medicine_name, m.unit, m.unit_in_stock
      FROM prescription_items pi
      JOIN medicines m ON pi.medicine_id = m.id
      WHERE pi.prescription_id = ?
    `;
    const [items] = await db.query(itemsQuery, [id]);
    prescriptions[0].items = items;

    return prescriptions[0];
  }

  // Lấy đơn thuốc theo bệnh nhân
  static async getByPatientId(patientId) {
    const query = `
      SELECT p.*, m.diagnosis, m.notes as medical_record_notes,
             u.name as patient_name, d.name as doctor_name
      FROM prescriptions p
      JOIN medical_records m ON p.medical_record_id = m.id
      JOIN appointments a ON m.appointment_id = a.id
      JOIN users u ON a.patient_id = u.id
      JOIN users d ON a.doctor_id = d.id
      WHERE a.patient_id = ?
      ORDER BY p.created_at DESC
    `;
    const [prescriptions] = await db.query(query, [patientId]);
    return prescriptions;
  }

  // Lấy đơn thuốc theo bác sĩ
  static async getByDoctorId(doctorId) {
    const query = `
      SELECT 
        p.*,
        m.diagnosis,
        m.notes as medical_record_notes,
        p_user.name as patient_name,
        d_user.name as doctor_name,
        a.appointment_date,
        a.appointment_time,
        a.id as appointment_id
      FROM prescriptions p
      JOIN medical_records m ON p.medical_record_id = m.id
      JOIN appointments a ON m.appointment_id = a.id
      JOIN patients pat ON a.patient_id = pat.id
      JOIN users p_user ON pat.user_id = p_user.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users d_user ON doc.user_id = d_user.id
      WHERE doc.user_id = ?
      ORDER BY p.created_at DESC
    `;
    const [prescriptions] = await db.query(query, [doctorId]);

    // Lấy chi tiết thuốc cho tất cả đơn thuốc
    const prescriptionIds = prescriptions.map(p => p.id);
    if (prescriptionIds.length > 0) {
      const itemsQuery = `
        SELECT pi.*, m.name as medicine_name, m.unit
        FROM prescription_items pi
        JOIN medicines m ON pi.medicine_id = m.id
        WHERE pi.prescription_id IN (?)
      `;
      const [items] = await db.query(itemsQuery, [prescriptionIds]);

      // Gán items vào đơn thuốc tương ứng
      prescriptions.forEach(prescription => {
        prescription.items = items.filter(item => item.prescription_id === prescription.id);
      });
    }

    return prescriptions;
  }

  // Tạo đơn thuốc mới
  static async create(data) {
    const { medical_record_id, diagnosis, items } = data;
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Kiểm tra và cập nhật medical_record
      const [medicalRecords] = await connection.query(
        'SELECT id FROM medical_records WHERE id = ?',
        [medical_record_id]
      );
      
      if (medicalRecords.length === 0) {
        throw new Error('Medical record not found');
      }

      // Cập nhật chẩn đoán trong medical_record
      await connection.query(
        'UPDATE medical_records SET diagnosis = ? WHERE id = ?',
        [diagnosis, medical_record_id]
      );

      // Tạo đơn thuốc
      const [result] = await connection.query(
        'INSERT INTO prescriptions (medical_record_id) VALUES (?)',
        [medical_record_id]
      );
      const prescriptionId = result.insertId;

      // Thêm chi tiết thuốc
      for (const item of items) {
        // Kiểm tra số lượng thuốc trong kho
        const [medicines] = await connection.query(
          'SELECT unit_in_stock FROM medicines WHERE id = ?',
          [item.medicine_id]
        );

        if (medicines.length === 0) {
          throw new Error(`Medicine with id ${item.medicine_id} not found`);
        }

        if (medicines[0].unit_in_stock <= 0) {
          throw new Error(`Medicine with id ${item.medicine_id} is out of stock`);
        }

        // Thêm chi tiết đơn thuốc
        await connection.query(
          `INSERT INTO prescription_items 
           (prescription_id, medicine_id, dosage, frequency, duration, instructions)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [prescriptionId, item.medicine_id, item.dosage, item.frequency, item.duration, item.instructions]
        );

        // Cập nhật số lượng thuốc trong kho
        await connection.query(
          `UPDATE medicines 
           SET unit_in_stock = unit_in_stock - 1
           WHERE id = ? AND unit_in_stock > 0`,
          [item.medicine_id]
        );
      }

      await connection.commit();
      return prescriptionId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Cập nhật đơn thuốc
  static async update(id, data) {
    const { items, diagnosis } = data;
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Kiểm tra đơn thuốc tồn tại và lấy medical_record_id
      const [prescriptions] = await connection.query(
        'SELECT p.*, m.id as medical_record_id FROM prescriptions p JOIN medical_records m ON p.medical_record_id = m.id WHERE p.id = ?',
        [id]
      );

      if (prescriptions.length === 0) {
        throw new Error('Prescription not found');
      }

      // Cập nhật chẩn đoán trong medical_record
      if (diagnosis) {
        await connection.query(
          'UPDATE medical_records SET diagnosis = ? WHERE id = ?',
          [diagnosis, prescriptions[0].medical_record_id]
        );
      }

      // Xóa chi tiết thuốc cũ
      await connection.query('DELETE FROM prescription_items WHERE prescription_id = ?', [id]);

      // Thêm chi tiết thuốc mới
      for (const item of items) {
        // Kiểm tra số lượng thuốc trong kho
        const [medicines] = await connection.query(
          'SELECT unit_in_stock FROM medicines WHERE id = ?',
          [item.medicine_id]
        );

        if (medicines.length === 0) {
          throw new Error(`Medicine with id ${item.medicine_id} not found`);
        }

        if (medicines[0].unit_in_stock <= 0) {
          throw new Error(`Medicine with id ${item.medicine_id} is out of stock`);
        }

        await connection.query(
          `INSERT INTO prescription_items 
           (prescription_id, medicine_id, dosage, frequency, duration, instructions)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, item.medicine_id, item.dosage, item.frequency, item.duration, item.instructions]
        );

        // Cập nhật số lượng thuốc trong kho
        await connection.query(
          `UPDATE medicines 
           SET unit_in_stock = unit_in_stock - 1
           WHERE id = ? AND unit_in_stock > 0`,
          [item.medicine_id]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Xóa đơn thuốc
  static async delete(id) {
    const [result] = await db.query('DELETE FROM prescriptions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Prescription; 