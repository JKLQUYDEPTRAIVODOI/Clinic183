const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Admin only routes
router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers);
router.post('/', authenticateToken, authorizeAdmin, userController.createUser);
router.put('/:id', authenticateToken, authorizeAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, authorizeAdmin, userController.deleteUser);
router.post('/:id/reset-password', authenticateToken, authorizeAdmin, userController.resetPassword);

module.exports = router; 