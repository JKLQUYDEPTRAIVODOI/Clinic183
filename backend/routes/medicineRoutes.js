const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Lấy tất cả thuốc
router.get('/', authenticateToken, medicineController.getAllMedicines);

// Tìm kiếm thuốc
router.get('/search', authenticateToken, medicineController.searchMedicines);

// Lấy thuốc theo ID
router.get('/:id', authenticateToken, medicineController.getMedicineById);

// Tạo thuốc mới (chỉ admin)
router.post('/', authenticateToken, authorizeAdmin, medicineController.createMedicine);

// Cập nhật thuốc (chỉ admin)
router.put('/:id', authenticateToken, authorizeAdmin, medicineController.updateMedicine);

// Xóa thuốc (chỉ admin)
router.delete('/:id', authenticateToken, authorizeAdmin, medicineController.deleteMedicine);

// Cập nhật số lượng trong kho (chỉ admin)
router.patch('/:id/stock', authenticateToken, authorizeAdmin, medicineController.updateStock);

module.exports = router; 