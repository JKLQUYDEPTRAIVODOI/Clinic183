const db = require('../config/db');
const pool = require('../config/db');

const statisticsController = {
  // Get doctor dashboard statistics
  getDoctorDashboardStats: async (req, res) => {
    try {
      const doctorId = req.doctor.id;
      
      // Get total patients count
      const [patientCountResult] = await db.query(`
        SELECT COUNT(DISTINCT p.id) as total
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.doctor_id = ?
      `, [doctorId]);
      
      // Get total appointments count
      const [appointmentCountResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM appointments
        WHERE doctor_id = ?
      `, [doctorId]);
      
      // Get today's appointments count
      const [todayAppointmentsResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM appointments
        WHERE doctor_id = ?
        AND DATE(appointment_date) = CURDATE()
      `, [doctorId]);
      
      // Get pending appointments count
      const [pendingAppointmentsResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM appointments
        WHERE doctor_id = ?
        AND status = 'pending'
      `, [doctorId]);

      // Get recent appointments
      const [recentAppointments] = await db.query(`
        SELECT 
          a.*,
          p.id as patient_id,
          u.name as patient_name,
          mr.diagnosis
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        LEFT JOIN medical_records mr ON a.id = mr.appointment_id
        WHERE a.doctor_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
        LIMIT 5
      `, [doctorId]);

      res.json({
        totalPatients: patientCountResult[0].total,
        totalAppointments: appointmentCountResult[0].total,
        todayAppointments: todayAppointmentsResult[0].total,
        pendingAppointments: pendingAppointmentsResult[0].total,
        recentAppointments: recentAppointments.map(appointment => ({
          id: appointment.id,
          patientName: appointment.patient_name,
          appointmentDate: appointment.appointment_date,
          appointmentTime: appointment.appointment_time,
          status: appointment.status,
          diagnosis: appointment.diagnosis || '',
          reason: appointment.reason || ''
        }))
      });
    } catch (error) {
      console.error('Error in getDoctorDashboardStats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get admin dashboard statistics
  getAdminDashboardStats: async (req, res) => {
    try {
      // Get total users count
      const [userCountResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM users
      `);

      // Get total doctors count
      const [doctorCountResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM doctors d
        JOIN users u ON d.user_id = u.id
      `);

      // Get total patients count
      const [patientCountResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM patients p
        JOIN users u ON p.user_id = u.id
      `);

      // Get total appointments count
      const [appointmentCountResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM appointments
      `);

      // Get total medicines count
      const [medicineCountResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM medicines
      `);

      // Get total revenue
      const [revenueResult] = await db.query(`
        SELECT COALESCE(SUM(total_amount), 0) as total
        FROM invoices
        WHERE payment_status = 'paid'
      `);

      res.json({
        totalUsers: userCountResult[0].total,
        totalDoctors: doctorCountResult[0].total,
        totalPatients: patientCountResult[0].total,
        totalAppointments: appointmentCountResult[0].total,
        totalMedicines: medicineCountResult[0].total,
        totalRevenue: Number(revenueResult[0].total)
      });
    } catch (error) {
      console.error('Error in getAdminDashboardStats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get patient dashboard statistics
  getPatientDashboardStats: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get patient_id from patients table
      const [patientResult] = await pool.query(
        'SELECT id FROM patients WHERE user_id = ?',
        [userId]
      );

      if (patientResult.length === 0) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const patientId = patientResult[0].id;

      // Get total appointments for this patient
      const [totalAppointments] = await pool.query(
        'SELECT COUNT(*) as total FROM appointments WHERE patient_id = ?',
        [patientId]
      );

      // Get upcoming appointments count
      const [upcomingAppointments] = await pool.query(
        'SELECT COUNT(*) as total FROM appointments WHERE patient_id = ? AND appointment_date >= CURDATE() AND status != "cancelled"',
        [patientId]
      );

      // Get active prescriptions count
      const [activePrescriptions] = await pool.query(
        `SELECT COUNT(DISTINCT p.id) as total 
         FROM prescriptions p 
         JOIN medical_records mr ON p.medical_record_id = mr.id 
         JOIN appointments a ON mr.appointment_id = a.id 
         WHERE a.patient_id = ?`,
        [patientId]
      );

      // Get pending invoices count
      const [pendingInvoices] = await pool.query(
        `SELECT COUNT(*) as total 
         FROM invoices i 
         JOIN appointments a ON i.appointment_id = a.id 
         WHERE a.patient_id = ? AND i.payment_status = "pending"`,
        [patientId]
      );

      res.json({
        totalAppointments: totalAppointments[0].total,
        upcomingAppointments: upcomingAppointments[0].total,
        activePrescriptions: activePrescriptions[0].total,
        pendingInvoices: pendingInvoices[0].total
      });
    } catch (error) {
      console.error('Error getting patient dashboard stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = statisticsController; 