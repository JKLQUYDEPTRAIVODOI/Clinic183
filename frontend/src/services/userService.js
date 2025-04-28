import api from './api';

const userService = {
  // Lấy danh sách tất cả người dùng
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Xóa người dùng
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Đặt lại mật khẩu cho người dùng
  resetPassword: async (id, newPassword) => {
    try {
      const response = await api.post(`/users/${id}/reset-password`, { password: newPassword });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Lấy danh sách người dùng theo vai trò
  getUsersByRole: async (role) => {
    try {
      const response = await api.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  }
};

export default userService; 