const Invoice = require('../models/invoiceModel');

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    // Lấy tham số phân trang từ query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Invoice.getAll(page, limit);
    
    res.json(result);
  } catch (error) {
    console.error('Error getting invoices:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    
    const invoice = await Invoice.getById(invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Error getting invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const { patientId, patientName, items, totalAmount, paymentStatus } = req.body;
    
    // Validate required fields
    if (!patientId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Chuẩn bị dữ liệu hóa đơn
    const invoiceData = {
      patientId,
      totalAmount,
      paymentStatus: paymentStatus || 'pending',
      items: items.map(item => ({
        name: item.name,
        price: item.amount || item.price,
        type: 'service',
        quantity: 1
      }))
    };
    
    // Tạo hóa đơn mới
    const invoiceId = await Invoice.create(invoiceData);
    
    // Lấy hóa đơn vừa tạo
    const newInvoice = await Invoice.getById(invoiceId);
    
    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: newInvoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const { patientId, patientName, items, totalAmount, paymentStatus, paymentDate } = req.body;
    
    // Kiểm tra xem hóa đơn có tồn tại không
    const existingInvoice = await Invoice.getById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Chuẩn bị dữ liệu cập nhật
    const invoiceData = {
      patientId: patientId || existingInvoice.patient_id,
      totalAmount: totalAmount || existingInvoice.total_amount,
      paymentStatus: paymentStatus || existingInvoice.payment_status,
      paymentDate: paymentDate || existingInvoice.payment_date
    };
    
    // Nếu có items, cập nhật
    if (items && Array.isArray(items)) {
      invoiceData.items = items.map(item => ({
        name: item.name,
        price: item.amount || item.price,
        type: 'service',
        quantity: 1
      }));
    }
    
    // Cập nhật hóa đơn
    const updated = await Invoice.update(invoiceId, invoiceData);
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update invoice' });
    }
    
    // Lấy hóa đơn đã cập nhật
    const updatedInvoice = await Invoice.getById(invoiceId);
    
    res.json({
      message: 'Invoice updated successfully',
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const { status } = req.body;
    
    // Validate status
    if (!status || !['pending', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Kiểm tra xem hóa đơn có tồn tại không
    const existingInvoice = await Invoice.getById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Cập nhật trạng thái
    const paymentDate = status === 'paid' ? new Date() : null;
    const updated = await Invoice.updateStatus(invoiceId, status, paymentDate);
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update invoice status' });
    }
    
    // Lấy hóa đơn đã cập nhật
    const updatedInvoice = await Invoice.getById(invoiceId);
    
    res.json({
      message: 'Invoice status updated successfully',
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    
    // Kiểm tra xem hóa đơn có tồn tại không
    const existingInvoice = await Invoice.getById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Xóa hóa đơn
    const deleted = await Invoice.delete(invoiceId);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete invoice' });
    }
    
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get invoices by patient ID
exports.getInvoicesByPatientId = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    
    const invoices = await Invoice.getByPatientId(patientId);
    
    res.json(invoices);
  } catch (error) {
    console.error('Error getting patient invoices:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 