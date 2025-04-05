const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes for guest appointments
router.get('/specializations', appointmentController.getSpecializations);
router.get('/doctors-by-specialization/:specialization', appointmentController.getDoctorsBySpecialization);
router.post('/guest', appointmentController.createGuestAppointment);
router.get('/guest/:tracking_code', appointmentController.getAppointmentByTrackingCode);

// Protected routes
router.use(protect); // Apply protect middleware to all routes below this

// Admin only routes
router.get('/', authorize('admin'), appointmentController.getAllAppointments);
router.post('/guest/:appointmentId/assign-doctor', authorize('admin'), appointmentController.assignDoctorToGuest);
router.post('/guest/convert', authorize('admin'), appointmentController.convertGuestToRegular);

// Doctor routes
router.get('/doctor/:doctorId', authorize('doctor'), appointmentController.getDoctorAppointments);
router.get('/doctor/me', authorize('doctor'), appointmentController.getDoctorAppointments);

// Patient routes
router.get('/patient/:patientId', authorize('patient'), appointmentController.getPatientAppointments);
router.get('/patient/me', authorize('patient'), appointmentController.getPatientAppointments);

// Create new appointment route
router.post('/', appointmentController.createAppointment);

// General authenticated routes
router.route('/:id')
  .get(appointmentController.getAppointmentById)
  .put(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

router.patch('/:id/status', appointmentController.updateAppointmentStatus);

module.exports = router; 