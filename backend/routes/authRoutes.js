const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Public authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Verify token endpoint
router.post('/verify-token', authenticateToken, userController.verifyToken);

// Get current user
router.get('/me', authenticateToken, userController.getCurrentUser);

module.exports = router; 