const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Get all invoices - Admin only
router.get('/', authenticateToken, authorizeAdmin, invoiceController.getAllInvoices);

// Get invoice by ID - Admin only
router.get('/:id', authenticateToken, authorizeAdmin, invoiceController.getInvoiceById);

// Create new invoice - Admin only
router.post('/', authenticateToken, authorizeAdmin, invoiceController.createInvoice);

// Update invoice - Admin only
router.put('/:id', authenticateToken, authorizeAdmin, invoiceController.updateInvoice);

// Update invoice status - Admin only
router.patch('/:id/status', authenticateToken, authorizeAdmin, invoiceController.updateInvoiceStatus);

// Delete invoice - Admin only
router.delete('/:id', authenticateToken, authorizeAdmin, invoiceController.deleteInvoice);

// Get invoices by patient ID - Admin and patient
router.get('/patient/:patientId', authenticateToken, invoiceController.getInvoicesByPatientId);

module.exports = router; 