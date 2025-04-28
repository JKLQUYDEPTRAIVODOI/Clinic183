const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Lấy tất cả dịch vụ
router.get('/', serviceController.getAllServices);

// Tìm kiếm dịch vụ
router.get('/search', serviceController.searchServices);

// Lấy dịch vụ theo ID
router.get('/:id', serviceController.getServiceById);
router.get('/:id/price', serviceController.getServicePrice);

// Tạo dịch vụ mới (chỉ admin)
router.post('/', authenticateToken, authorizeAdmin, serviceController.createService);

// Cập nhật dịch vụ (chỉ admin)
router.put('/:id', authenticateToken, authorizeAdmin, serviceController.updateService);

// Xóa dịch vụ (chỉ admin)
router.delete('/:id', authenticateToken, authorizeAdmin, serviceController.deleteService);

// Lấy lịch sử giá dịch vụ (chỉ admin)
router.get('/:id/price-history', authenticateToken, authorizeAdmin, serviceController.getServicePriceHistory);

module.exports = router; 