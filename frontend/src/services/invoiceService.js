import api from './api';

const invoiceService = {
  // Get all invoices
  getAllInvoices: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/invoices?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  },

  // Get invoice by ID
  getInvoiceById: async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw error;
    }
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  // Update invoice
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Update invoice status
  updateInvoiceStatus: async (id, status) => {
    try {
      const response = await api.patch(`/invoices/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    try {
      const response = await api.delete(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  // Get invoices by patient ID
  getInvoicesByPatientId: async (patientId) => {
    try {
      const response = await api.get(`/invoices/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting patient invoices:', error);
      throw error;
    }
  },

  // Get current patient's invoices
  getMyInvoices: async () => {
    try {
      const response = await api.get('/invoices/me');
      return response.data;
    } catch (error) {
      console.error('Error getting my invoices:', error);
      throw error;
    }
  }
};

export default invoiceService; 