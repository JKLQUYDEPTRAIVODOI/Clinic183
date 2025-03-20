const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Verify token endpoint
router.post('/verify-token', authenticateToken, userController.verifyToken);

// Protected routes
router.get('/me', authenticateToken, userController.getCurrentUser);

// Admin only routes
router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers);
router.put('/:id', authenticateToken, authorizeAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, authorizeAdmin, userController.deleteUser);

module.exports = router; 