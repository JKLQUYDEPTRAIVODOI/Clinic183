import api from './api';
import axios from 'axios';

const serviceService = {
  // Lấy tất cả dịch vụ
  getAllServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy dịch vụ theo ID
  getServiceById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm dịch vụ theo tên
  searchServices: async (searchTerm) => {
    try {
      const response = await api.get(`/services/search?name=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo dịch vụ mới
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật dịch vụ
  updateService: async (id, serviceData) => {
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy giá hiện tại của dịch vụ
  getServicePrice: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}/price`);
      return response.data;
    } catch (error) {
      console.error('Error getting service price:', error);
      throw error;
    }
  },

  // Xóa dịch vụ
  deleteService: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getServicePriceHistory: async (id) => {
    try {
      const response = await api.get(`/services/${id}/price-history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default serviceService; 