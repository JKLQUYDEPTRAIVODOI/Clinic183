const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { authenticateToken, authorizeDoctor } = require('../middleware/auth');

// Get doctor dashboard statistics
router.get('/doctor/dashboard', authenticateToken, authorizeDoctor, statisticsController.getDoctorDashboardStats);

module.exports = router; 