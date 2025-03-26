const db = require('../config/db');

class Appointment {
  // Get all appointments
  static async getAll() {
    const query = `
      SELECT a.*, 
        p.id AS patient_id, 
        u_patient.name AS patient_name,
        d.id AS doctor_id, 
        u_doctor.name AS doctor_name,
        d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u_patient ON p.user_id = u_patient.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u_doctor ON d.user_id = u_doctor.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Get appointments by patient ID
  static async getByPatientId(patientId) {
    const query = `
      SELECT a.*, 
        d.id AS doctor_id, 
        u.name AS doctor_name,
        d.specialization
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
    const [rows] = await db.execute(query, [patientId]);
    return rows;
  }

  // Get appointments by doctor ID
  static async getByDoctorId(doctorId) {
    const query = `
      SELECT a.*, 
        p.id AS patient_id, 
        u_patient.name AS patient_name,
        d.id AS doctor_id,
        u_doctor.name AS doctor_name,
        d.specialization AS doctor_specialization,
        mr.id AS medical_record_id,
        mr.diagnosis,
        mr.notes
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u_patient ON p.user_id = u_patient.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u_doctor ON d.user_id = u_doctor.id
      LEFT JOIN medical_records mr ON mr.appointment_id = a.id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `;
    const [rows] = await db.execute(query, [doctorId]);
    return rows;
  }

  // Get appointment by ID
  static async getById(id) {
    const query = `
      SELECT a.*, 
        p.id AS patient_id, 
        u_patient.name AS patient_name,
        d.id AS doctor_id, 
        u_doctor.name AS doctor_name,
        d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u_patient ON p.user_id = u_patient.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u_doctor ON d.user_id = u_doctor.id
      WHERE a.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Create a new appointment
  static async create(appointmentData) {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason, status = 'pending' } = appointmentData;
    
    const query = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      patient_id, 
      doctor_id, 
      appointment_date, 
      appointment_time, 
      reason, 
      status
    ]);
    
    return result.insertId;
  }

  // Update an appointment
  static async update(id, appointmentData) {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason, status } = appointmentData;
    
    const query = `
      UPDATE appointments
      SET patient_id = ?,
          doctor_id = ?,
          appointment_date = ?,
          appointment_time = ?,
          reason = ?,
          status = ?
      WHERE id = ?
    `;
    
    const [result] = await db.execute(query, [
      patient_id, 
      doctor_id, 
      appointment_date, 
      appointment_time, 
      reason, 
      status, 
      id
    ]);
    
    return result.affectedRows > 0;
  }

  // Update appointment status
  static async updateStatus(id, status) {
    const query = `
      UPDATE appointments
      SET status = ?
      WHERE id = ?
    `;
    
    const [result] = await db.execute(query, [status, id]);
    return result.affectedRows > 0;
  }

  // Delete an appointment
  static async delete(id) {
    const query = `DELETE FROM appointments WHERE id = ?`;
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  // Check for appointment conflicts
  static async checkConflict(doctorId, date, time, appointmentId = null) {
    let query = `
      SELECT COUNT(*) as count
      FROM appointments
      WHERE doctor_id = ?
      AND appointment_date = ?
      AND appointment_time = ?
      AND status NOT IN ('cancelled', 'rejected')
    `;
    
    let params = [doctorId, date, time];
    
    // If updating an existing appointment, exclude it from the check
    if (appointmentId) {
      query += ` AND id != ?`;
      params.push(appointmentId);
    }
    
    const [rows] = await db.execute(query, params);
    return rows[0].count > 0;
  }
}

module.exports = Appointment; 