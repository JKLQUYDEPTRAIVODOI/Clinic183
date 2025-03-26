import api from './api';

const statisticsService = {
  // Get doctor dashboard statistics
  getDoctorDashboardStats: async () => {
    try {
      const response = await api.get('/statistics/doctor/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor dashboard stats:', error);
      throw error;
    }
  },

  // Get admin dashboard statistics
  getAdminDashboardStats: async () => {
    try {
      const response = await api.get('/statistics/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw error;
    }
  },

  getPatientDashboardStats: async () => {
    const response = await api.get('/statistics/patient/dashboard');
    return response.data;
  }
};

export default statisticsService; 