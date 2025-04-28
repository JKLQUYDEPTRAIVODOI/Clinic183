const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { authenticateToken, authorizeDoctor, authorizeAdmin } = require('../middleware/auth');

// Get doctor dashboard statistics
router.get('/doctor/dashboard', authenticateToken, authorizeDoctor, statisticsController.getDoctorDashboardStats);

// Get admin dashboard statistics
router.get('/admin/dashboard', authenticateToken, authorizeAdmin, statisticsController.getAdminDashboardStats);

// Patient dashboard statistics
router.get('/patient/dashboard', authenticateToken, statisticsController.getPatientDashboardStats);

module.exports = router; 