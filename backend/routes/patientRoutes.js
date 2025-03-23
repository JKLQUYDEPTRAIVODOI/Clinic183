const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeDoctor } = require('../middleware/auth');

// Get current patient's profile
router.get('/me', authenticateToken, patientController.getMyProfile);

// Get all patients (doctor only)
router.get('/', authenticateToken, authorizeDoctor, patientController.getAllPatients);

// Get patient by ID (doctor only)
router.get('/:id', authenticateToken, authorizeDoctor, patientController.getPatientById);

// Update patient (doctor only)
router.put('/:id', authenticateToken, authorizeDoctor, patientController.updatePatient);

// Update current patient's profile
router.put('/me', authenticateToken, patientController.updateMyProfile);

// Tìm kiếm bệnh nhân
router.get('/search', authenticateToken, patientController.searchPatients);

module.exports = router; 