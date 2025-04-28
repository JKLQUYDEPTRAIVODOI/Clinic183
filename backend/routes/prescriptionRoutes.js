const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticateToken, authorizeAdmin, authorizeDoctor } = require('../middleware/auth');

// Middleware to authorize admin or doctor
const authorizeAdminOrDoctor = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'doctor')) {
    return res.status(403).json({ message: 'Access denied. Admin or Doctor only.' });
  }
  next();
};

// Get all prescriptions (admin only)
router.get('/', authenticateToken, authorizeAdmin, prescriptionController.getAllPrescriptions);

// Get prescription by ID
router.get('/:id', authenticateToken, prescriptionController.getPrescriptionById);

// Get prescriptions for current patient
router.get('/patient/me', authenticateToken, prescriptionController.getPatientPrescriptions);

// Get prescriptions for current doctor
router.get('/doctor/me', authenticateToken, authorizeDoctor, prescriptionController.getDoctorPrescriptions);

// Create new prescription (admin or doctor)
router.post('/', authenticateToken, authorizeAdminOrDoctor, prescriptionController.createPrescription);

// Update prescription (admin or doctor)
router.put('/:id', authenticateToken, authorizeAdminOrDoctor, prescriptionController.updatePrescription);

// Delete prescription (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, prescriptionController.deletePrescription);

module.exports = router; 