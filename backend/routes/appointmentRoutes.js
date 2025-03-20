const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeAdmin, authorizeDoctor, authorizePatient } = require('../middleware/auth');

// Get all appointments (admin only)
router.get('/', authenticateToken, authorizeAdmin, appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id', authenticateToken, appointmentController.getAppointmentById);

// Get appointments for current patient
router.get('/patient/me', authenticateToken, authorizePatient, appointmentController.getPatientAppointments);

// Get appointments for current doctor
router.get('/doctor/me', authenticateToken, authorizeDoctor, appointmentController.getDoctorAppointments);

// Create a new appointment
router.post('/', authenticateToken, appointmentController.createAppointment);

// Update an appointment
router.put('/:id', authenticateToken, appointmentController.updateAppointment);

// Update appointment status
router.patch('/:id/status', authenticateToken, appointmentController.updateAppointmentStatus);

// Delete an appointment
router.delete('/:id', authenticateToken, appointmentController.deleteAppointment);

module.exports = router; 