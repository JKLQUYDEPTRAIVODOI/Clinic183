const Invoice = require('../models/invoiceModel');
const Patient = require('../models/patientModel');

const invoiceController = {
  // Lấy danh sách hóa đơn
  getAllInvoices: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await Invoice.getAll(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error in getAllInvoices:', error);
      res.status(500).json({ 
        message: 'Lỗi khi lấy danh sách hóa đơn',
        error: error.message 
      });
    }
  },

  // Lấy chi tiết hóa đơn
  getInvoiceById: async (req, res) => {
    try {
      const invoice = await Invoice.getById(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
      }
      res.json(invoice);
    } catch (error) {
      console.error('Error in getInvoiceById:', error);
      res.status(500).json({ 
        message: 'Lỗi khi lấy thông tin hóa đơn',
        error: error.message 
      });
    }
  },

  // Tạo hóa đơn mới
  createInvoice: async (req, res) => {
    try {
      // Validate request body
      if (!req.body.appointment_id) {
        return res.status(400).json({ message: 'ID cuộc hẹn là bắt buộc' });
      }
      if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
        return res.status(400).json({ message: 'Hóa đơn phải có ít nhất một mục' });
      }

      // Validate each item
      for (const item of req.body.items) {
        if (!item.type || !item.id || !item.quantity) {
          return res.status(400).json({ 
            message: 'Mỗi mục phải có type, id và quantity',
            item 
          });
        }
        if (!['service', 'medicine'].includes(item.type)) {
          return res.status(400).json({ 
            message: 'Loại mục không hợp lệ',
            type: item.type 
          });
        }
        if (item.quantity <= 0) {
          return res.status(400).json({ 
            message: 'Số lượng phải lớn hơn 0',
            quantity: item.quantity 
          });
        }
      }

      const invoice = await Invoice.create(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      console.error('Error in createInvoice:', error);
      if (error.message.includes('không tồn tại')) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes('không đủ số lượng')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ 
        message: 'Lỗi khi tạo hóa đơn',
        error: error.message 
      });
    }
  },

  // Cập nhật hóa đơn
  updateInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const invoiceData = req.body;

      const updatedInvoice = await Invoice.update(id, invoiceData);

      if (!updatedInvoice) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hóa đơn'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật hóa đơn thành công',
        invoice: updatedInvoice
      });
    } catch (error) {
      console.error('Error in updateInvoice:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật hóa đơn',
        error: error.message
      });
    }
  },

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: async (req, res) => {
    try {
      const { status } = req.body;
      if (!['pending', 'paid', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      }

      const invoice = await Invoice.updateStatus(req.params.id, status);
      if (!invoice) {
        return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
      }
      res.json(invoice);
    } catch (error) {
      console.error('Error in updateInvoiceStatus:', error);
      res.status(500).json({ 
        message: 'Lỗi khi cập nhật trạng thái hóa đơn',
        error: error.message 
      });
    }
  },

  // Xóa hóa đơn
  deleteInvoice: async (req, res) => {
    try {
      const invoice = await Invoice.delete(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
      }
      res.json({ message: 'Xóa hóa đơn thành công' });
    } catch (error) {
      console.error('Error in deleteInvoice:', error);
      res.status(500).json({ 
        message: 'Lỗi khi xóa hóa đơn',
        error: error.message 
      });
    }
  },

  // Update invoice status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedInvoice = await Invoice.updateStatus(id, status);

      if (!updatedInvoice) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hóa đơn'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái hóa đơn thành công',
        invoice: updatedInvoice
      });
    } catch (error) {
      console.error('Error in updateStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái hóa đơn',
        error: error.message
      });
    }
  },

  // Lấy hóa đơn của bệnh nhân hiện tại
  getMyInvoices: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Lấy patient_id từ user_id
      const patient = await Patient.getByUserId(userId);
      if (!patient) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin bệnh nhân' });
      }

      const invoices = await Invoice.getByPatientId(patient.id);
      res.json(invoices);
    } catch (error) {
      console.error('Error in getMyInvoices:', error);
      res.status(500).json({ 
        message: 'Lỗi khi lấy danh sách hóa đơn',
        error: error.message 
      });
    }
  }
};

module.exports = invoiceController; 