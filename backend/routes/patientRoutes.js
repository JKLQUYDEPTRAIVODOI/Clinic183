const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/auth');

// Lấy tất cả bệnh nhân
router.get('/', authenticateToken, patientController.getAllPatients);

// Tìm kiếm bệnh nhân
router.get('/search', authenticateToken, patientController.searchPatients);

// Lấy bệnh nhân theo ID
router.get('/:id', authenticateToken, patientController.getPatientById);

module.exports = router; 