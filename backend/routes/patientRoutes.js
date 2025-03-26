const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeDoctor, authorizeAdmin } = require('../middleware/auth');

// Middleware to authorize admin or doctor
const authorizeAdminOrDoctor = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && (req.user.role !== 'doctor' || !req.doctor))) {
    return res.status(403).json({ message: 'Access denied. Admin or Doctor only.' });
  }
  next();
};

// Get current patient's profile
router.get('/me', authenticateToken, patientController.getMyProfile);

// Get all patients (admin or doctor only)
router.get('/', authenticateToken, authorizeAdminOrDoctor, patientController.getAllPatients);

// Get patient by ID (admin or doctor only)
router.get('/:id', authenticateToken, authorizeAdminOrDoctor, patientController.getPatientById);

// Update patient (admin or doctor only)
router.put('/:id', authenticateToken, authorizeAdminOrDoctor, patientController.updatePatient);

// Update current patient's profile
router.put('/me', authenticateToken, patientController.updateMyProfile);

// Tìm kiếm bệnh nhân
router.get('/search', authenticateToken, patientController.searchPatients);

module.exports = router; 