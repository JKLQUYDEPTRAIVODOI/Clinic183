const db = require('../config/db');

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
  }
};

module.exports = statisticsController; 