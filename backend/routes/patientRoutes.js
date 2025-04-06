const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeDoctor, authorizeAdmin, authorizePatient } = require('../middleware/auth');

// Middleware to authorize admin or doctor
const authorizeAdminOrDoctor = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && (req.user.role !== 'doctor' || !req.doctor))) {
    return res.status(403).json({ message: 'Access denied. Admin or Doctor only.' });
  }
  next();
};

// Middleware to authorize admin, doctor, or the patient themselves
const authorizeAdminDoctorOrSelf = (req, res, next) => {
  // Allow admin and doctor
  if (req.user && (req.user.role === 'admin' || (req.user.role === 'doctor' && req.doctor))) {
    return next();
  }
  
  // Allow patient to access their own data
  if (req.user && req.user.role === 'patient' && req.patient && req.params.id == req.patient.id) {
    return next();
  }
  
  return res.status(403).json({ message: 'Access denied. You can only access your own data.' });
};

// Get current patient's profile
router.get('/me', authenticateToken, authorizePatient, patientController.getMyProfile);

// Update current patient's profile
router.put('/me', authenticateToken, authorizePatient, patientController.updateMyProfile);

// Tìm kiếm bệnh nhân (admin or doctor only)
router.get('/search', authenticateToken, authorizeAdminOrDoctor, patientController.searchPatients);

// Get all patients (admin or doctor only)
router.get('/', authenticateToken, authorizeAdminOrDoctor, patientController.getAllPatients);

// Get patient by ID (admin, doctor, or the patient themselves)
router.get('/:id', authenticateToken, authorizeAdminDoctorOrSelf, patientController.getPatientById);

// Update patient (admin, doctor, or the patient themselves)
router.put('/:id', authenticateToken, authorizeAdminDoctorOrSelf, patientController.updatePatient);

module.exports = router;