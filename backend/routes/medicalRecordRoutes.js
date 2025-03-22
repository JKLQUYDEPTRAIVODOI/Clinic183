const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { authenticateToken, authorizeAdmin, authorizeDoctor } = require('../middleware/auth');

// Middleware to authorize admin or doctor
const authorizeAdminOrDoctor = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && (req.user.role !== 'doctor' || !req.doctor))) {
    return res.status(403).json({ message: 'Access denied. Admin or Doctor only.' });
  }
  next();
};

// Get all medical records (admin only)
router.get('/', authenticateToken, authorizeAdmin, medicalRecordController.getAllMedicalRecords);

// Get medical record by ID
router.get('/:id', authenticateToken, medicalRecordController.getMedicalRecordById);

// Get medical records for current patient
router.get('/patient/me', authenticateToken, medicalRecordController.getPatientMedicalRecords);

// Get medical records for current doctor
router.get('/doctor/me', authenticateToken, medicalRecordController.getDoctorMedicalRecords);

// Create new medical record (admin or doctor)
router.post('/', authenticateToken, authorizeAdminOrDoctor, medicalRecordController.createMedicalRecord);

// Update medical record (admin or doctor who created it)
router.put('/:id', authenticateToken, authorizeAdminOrDoctor, medicalRecordController.updateMedicalRecord);

// Delete medical record (admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, medicalRecordController.deleteMedicalRecord);

module.exports = router; 