import api from './api';

const medicineService = {
  // Lấy tất cả thuốc
  getAllMedicines: async () => {
    try {
      const response = await api.get('/medicines');
      return response.data;
    } catch (error) {
      console.error('Error getting medicines:', error);
      throw error;
    }
  },

  // Lấy thuốc theo ID
  getMedicineById: async (id) => {
    try {
      const response = await api.get(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting medicine:', error);
      throw error;
    }
  },

  // Tìm kiếm thuốc theo tên
  searchMedicines: async (name) => {
    try {
      const response = await api.get(`/medicines/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching medicines:', error);
      throw error;
    }
  },

  // Tạo thuốc mới
  createMedicine: async (medicineData) => {
    try {
      const response = await api.post('/medicines', medicineData);
      return response.data;
    } catch (error) {
      console.error('Error creating medicine:', error);
      throw error;
    }
  },

  // Cập nhật thuốc
  updateMedicine: async (id, medicineData) => {
    try {
      const response = await api.put(`/medicines/${id}`, medicineData);
      return response.data;
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  },

  // Xóa thuốc
  deleteMedicine: async (id) => {
    try {
      const response = await api.delete(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  },

  // Cập nhật số lượng trong kho
  updateStock: async (id, quantity) => {
    try {
      const response = await api.patch(`/medicines/${id}/stock`, { quantity });
      return response.data;
    } catch (error) {
      console.error('Error updating medicine stock:', error);
      throw error;
    }
  }
};

export default medicineService; 