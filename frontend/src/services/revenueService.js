import axios from 'axios';

const API_URL = 'http://localhost:5000/api/revenue';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const revenueService = {
  // Lấy tổng quan doanh thu
  getRevenueSummary: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/summary`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue summary:', error);
      throw error;
    }
  },

  // Lấy doanh thu theo thời gian
  getRevenueByTime: async (startDate, endDate, groupBy = 'month') => {
    try {
      const response = await axios.get(`${API_URL}/by-time`, {
        params: { startDate, endDate, groupBy }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue by time:', error);
      throw error;
    }
  },

  // Lấy doanh thu theo dịch vụ
  getRevenueByService: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/by-service`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue by service:', error);
      throw error;
    }
  },

  // Lấy doanh thu theo bác sĩ
  getRevenueByDoctor: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/by-doctor`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue by doctor:', error);
      throw error;
    }
  }
};

export default revenueService; 