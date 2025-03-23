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
  }
};

export default statisticsService; 