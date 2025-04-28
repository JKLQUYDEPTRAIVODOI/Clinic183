const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createGuestAppointment,
  getAppointmentByTrackingCode,
  getAllGuestAppointments,
  updateAppointmentStatus,
  addAdminNote
} = require('../controllers/guestAppointmentController');

// Public routes
router.post('/', createGuestAppointment);
router.get('/:trackingCode', getAppointmentByTrackingCode);

// Protected routes (admin only)
router.get('/admin/all', protect, authorize('admin'), getAllGuestAppointments);
router.patch('/:id/status', protect, authorize('admin'), updateAppointmentStatus);
router.patch('/:id/note', protect, authorize('admin'), addAdminNote);

module.exports = router; 