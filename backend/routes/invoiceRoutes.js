const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticateToken, authorizeAdmin, authorizePatient } = require('../middleware/auth');

// Get all invoices - Admin only
router.get('/', authenticateToken, authorizeAdmin, invoiceController.getAllInvoices);

// Route để lấy hóa đơn của bệnh nhân hiện tại
router.get('/me', authenticateToken, authorizePatient, invoiceController.getMyInvoices);

// Get invoice by ID - Admin only
router.get('/:id', authenticateToken, authorizeAdmin, invoiceController.getInvoiceById);

// Create new invoice - Admin only
router.post('/', authenticateToken, authorizeAdmin, invoiceController.createInvoice);

// Update invoice - Admin only
router.put('/:id', authenticateToken, authorizeAdmin, invoiceController.updateInvoice);

// Update payment status - Admin only
router.patch('/:id/status', authenticateToken, authorizeAdmin, invoiceController.updateStatus);

// Delete invoice - Admin only
router.delete('/:id', authenticateToken, authorizeAdmin, invoiceController.deleteInvoice);

module.exports = router; 