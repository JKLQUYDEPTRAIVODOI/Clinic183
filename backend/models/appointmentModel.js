const db = require('../config/db');

class Appointment {
  // Get all appointments
  static async getAll() {
    const query = `
      SELECT a.*, 
        COALESCE(p.id, NULL) AS patient_id,
        COALESCE(u_patient.name, a.guest_name) AS patient_name,
        COALESCE(d.id, NULL) AS doctor_id,
        COALESCE(u_doctor.name, NULL) AS doctor_name,
        COALESCE(d.specialization, a.department) AS specialization,
        a.tracking_code,
        a.guest_name,
        a.guest_phone,
        a.guest_email,
        a.symptoms,
        a.preferred_date,
        a.preferred_time,
        a.department,
        CASE WHEN i.id IS NOT NULL THEN true ELSE false END as has_invoice
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u_patient ON p.user_id = u_patient.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users u_doctor ON d.user_id = u_doctor.id
      LEFT JOIN invoices i ON a.id = i.appointment_id
      ORDER BY 
        CASE 
          WHEN a.tracking_code IS NOT NULL THEN a.preferred_date
          ELSE a.appointment_date
        END DESC,
        CASE 
          WHEN a.tracking_code IS NOT NULL THEN a.preferred_time
          ELSE a.appointment_time
        END DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  // Get appointment by ID
  static async getById(id) {
    const query = `
      SELECT a.*, 
        COALESCE(p.id, NULL) AS patient_id,
        COALESCE(u_patient.name, a.guest_name) AS patient_name,
        COALESCE(d.id, NULL) AS doctor_id,
        COALESCE(u_doctor.name, NULL) AS doctor_name,
        COALESCE(d.specialization, a.department) AS specialization,
        a.tracking_code,
        a.guest_name,
        a.guest_phone,
        a.guest_email,
        a.symptoms,
        a.preferred_date,
        a.preferred_time,
        a.department
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u_patient ON p.user_id = u_patient.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users u_doctor ON d.user_id = u_doctor.id
      WHERE a.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Get appointments by patient ID
  static async getByPatientId(patientId) {
    const query = `
      SELECT a.*, 
        COALESCE(d.id, NULL) AS doctor_id,
        COALESCE(u.name, NULL) AS doctor_name,
        COALESCE(d.specialization, a.department) AS specialization
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
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
        COALESCE(p.id, NULL) AS patient_id,
        COALESCE(u_patient.name, a.guest_name) AS patient_name,
        d.id AS doctor_id,
        u_doctor.name AS doctor_name,
        d.specialization AS doctor_specialization,
        mr.id AS medical_record_id,
        mr.diagnosis,
        mr.notes,
        a.tracking_code,
        a.guest_name,
        a.guest_phone,
        a.guest_email,
        a.symptoms,
        a.preferred_date,
        a.preferred_time,
        a.department
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u_patient ON p.user_id = u_patient.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u_doctor ON d.user_id = u_doctor.id
      LEFT JOIN medical_records mr ON mr.appointment_id = a.id
      WHERE a.doctor_id = ?
      ORDER BY 
        CASE 
          WHEN a.tracking_code IS NOT NULL THEN a.preferred_date
          ELSE a.appointment_date
        END DESC,
        CASE 
          WHEN a.tracking_code IS NOT NULL THEN a.preferred_time
          ELSE a.appointment_time
        END DESC
    `;
    const [rows] = await db.execute(query, [doctorId]);
    return rows;
  }

  // Get appointment by tracking code
  static async getByTrackingCode(trackingCode) {
    const query = `
      SELECT a.*, 
        COALESCE(d.id, NULL) AS doctor_id,
        COALESCE(u_doctor.name, NULL) AS doctor_name,
        COALESCE(d.specialization, a.department) AS specialization
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users u_doctor ON d.user_id = u_doctor.id
      WHERE a.tracking_code = ?
    `;
    const [rows] = await db.execute(query, [trackingCode]);
    return rows[0];
  }

  // Create a new appointment
  static async create(appointmentData) {
    const {
      patient_id = null,
      doctor_id = null,
      appointment_date = null,
      appointment_time = null,
      reason = '',
      status = 'pending',
      tracking_code = null,
      guest_name = null,
      guest_phone = null,
      guest_email = null,
      symptoms = null,
      preferred_date = null,
      preferred_time = null,
      department = null
    } = appointmentData;

    const query = `
      INSERT INTO appointments (
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        reason,
        status,
        tracking_code,
        guest_name,
        guest_phone,
        guest_email,
        symptoms,
        preferred_date,
        preferred_time,
        department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
      status,
      tracking_code,
      guest_name,
      guest_phone,
      guest_email,
      symptoms,
      preferred_date,
      preferred_time,
      department
    ]);

    return result.insertId;
  }

  // Update an appointment
  static async update(id, appointmentData) {
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
      status,
      guest_name,
      guest_phone,
      guest_email,
      symptoms,
      preferred_date,
      preferred_time,
      department
    } = appointmentData;

    const query = `
      UPDATE appointments
      SET patient_id = ?,
          doctor_id = ?,
          appointment_date = ?,
          appointment_time = ?,
          reason = ?,
          status = ?,
          guest_name = ?,
          guest_phone = ?,
          guest_email = ?,
          symptoms = ?,
          preferred_date = ?,
          preferred_time = ?,
          department = ?
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
      status,
      guest_name,
      guest_phone,
      guest_email,
      symptoms,
      preferred_date,
      preferred_time,
      department,
      id
    ]);

    return result.affectedRows > 0;
  }

  // Update appointment status
  static async updateStatus(id, status, adminNote = null) {
    let query = `
      UPDATE appointments
      SET status = ?
    `;
    const params = [status];

    if (adminNote !== null) {
      query += `, admin_note = ?`;
      params.push(adminNote);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    const [result] = await db.execute(query, params);
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
      AND (
        (tracking_code IS NULL AND appointment_date = ? AND appointment_time = ?)
        OR
        (tracking_code IS NOT NULL AND preferred_date = ? AND preferred_time = ?)
      )
      AND status NOT IN ('cancelled', 'rejected')
    `;

    let params = [doctorId, date, time, date, time];

    if (appointmentId) {
      query += ` AND id != ?`;
      params.push(appointmentId);
    }

    const [rows] = await db.execute(query, params);
    return rows[0].count > 0;
  }

  // Convert guest appointment to regular appointment
  static async convertToRegular(id, patientId) {
    const query = `
      UPDATE appointments
      SET patient_id = ?,
          appointment_date = preferred_date,
          appointment_time = preferred_time,
          reason = COALESCE(symptoms, reason),
          tracking_code = NULL,
          guest_name = NULL,
          guest_phone = NULL,
          guest_email = NULL,
          symptoms = NULL,
          preferred_date = NULL,
          preferred_time = NULL,
          department = NULL
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [patientId, id]);
    return result.affectedRows > 0;
  }

  // Assign doctor to guest appointment
  static async assignDoctor(id, doctorId) {
    const query = `
      UPDATE appointments
      SET doctor_id = ?,
          appointment_date = preferred_date,
          appointment_time = preferred_time,
          status = 'accepted'
      WHERE id = ?
    `;

    const [result] = await db.execute(query, [doctorId, id]);
    return result.affectedRows > 0;
  }
}

module.exports = Appointment; 