const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Lấy tất cả dịch vụ
router.get('/', authenticateToken, serviceController.getAllServices);

// Tìm kiếm dịch vụ
router.get('/search', authenticateToken, serviceController.searchServices);

// Lấy dịch vụ theo ID
router.get('/:id', authenticateToken, serviceController.getServiceById);

// Tạo dịch vụ mới (chỉ admin)
router.post('/', authenticateToken, authorizeAdmin, serviceController.createService);

// Cập nhật dịch vụ (chỉ admin)
router.put('/:id', authenticateToken, authorizeAdmin, serviceController.updateService);

// Xóa dịch vụ (chỉ admin)
router.delete('/:id', authenticateToken, authorizeAdmin, serviceController.deleteService);

module.exports = router; 