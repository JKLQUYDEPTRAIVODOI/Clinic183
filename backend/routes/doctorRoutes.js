const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeAdmin, authorizeDoctor } = require('../middleware/auth');

// Get all doctors (public)
router.get('/', doctorController.getAllDoctors);

// Get current doctor's profile
router.get('/me', authenticateToken, authorizeDoctor, doctorController.getCurrentDoctorProfile);

// Update current doctor's profile
router.put('/me', authenticateToken, authorizeDoctor, doctorController.updateCurrentDoctorProfile);

// Get doctor by ID (public)
router.get('/:id', doctorController.getDoctorById);

// Create doctor (admin only)
router.post('/', authenticateToken, authorizeAdmin, doctorController.createDoctor);

// Update doctor (admin or doctor only)
router.put('/:id', authenticateToken, authorizeDoctor, doctorController.updateDoctor);

// Delete doctor (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, doctorController.deleteDoctor);

module.exports = router; 