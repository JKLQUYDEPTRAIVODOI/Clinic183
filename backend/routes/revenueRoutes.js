const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Tất cả các route đều yêu cầu xác thực và quyền admin
router.use(authenticateToken, authorizeAdmin);

// Lấy tổng quan doanh thu
router.get('/summary', revenueController.getRevenueSummary);

// Lấy doanh thu theo thời gian
router.get('/by-time', revenueController.getRevenueByTime);

// Lấy doanh thu theo dịch vụ
router.get('/by-service', revenueController.getRevenueByService);

// Lấy doanh thu theo bác sĩ
router.get('/by-doctor', revenueController.getRevenueByDoctor);

module.exports = router; 