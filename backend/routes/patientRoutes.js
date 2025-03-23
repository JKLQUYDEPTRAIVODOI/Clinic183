const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeDoctor } = require('../middleware/auth');

// Get all patients (doctor only)
router.get('/', authenticateToken, authorizeDoctor, patientController.getAllPatients);

// Get patient by ID (doctor only)
router.get('/:id', authenticateToken, authorizeDoctor, patientController.getPatientById);

// Update patient (doctor only)
router.put('/:id', authenticateToken, authorizeDoctor, patientController.updatePatient);

// Tìm kiếm bệnh nhân
router.get('/search', authenticateToken, patientController.searchPatients);

module.exports = router; 