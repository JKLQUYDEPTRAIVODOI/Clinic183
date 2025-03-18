const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Verify token endpoint
router.post('/verify-token', auth, userController.verifyToken);

// Protected routes
router.get('/me', auth, userController.getCurrentUser);

// Admin only routes
router.get('/', auth, authorize('admin'), userController.getAllUsers);
router.put('/:id', auth, authorize('admin'), userController.updateUser);
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);

module.exports = router; 