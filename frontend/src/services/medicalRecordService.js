import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Request interceptor để thêm token vào header
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

const medicalRecordService = {
  // Get all medical records (admin only)
  getAllMedicalRecords: async () => {
    try {
      const response = await axios.get(`${API_URL}/medical-records`);
      return response.data;
    } catch (error) {
      console.error('Error getting medical records:', error);
      throw error;
    }
  },

  // Get medical record by ID
  getMedicalRecordById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/medical-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting medical record:', error);
      throw error;
    }
  },

  // Get medical records for current patient
  getPatientMedicalRecords: async () => {
    try {
      const response = await axios.get(`${API_URL}/medical-records/patient/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient medical records:', error);
      throw error;
    }
  },

  // Get medical records for current doctor
  getDoctorMedicalRecords: async () => {
    try {
      const response = await axios.get(`${API_URL}/medical-records/doctor/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor medical records:', error);
      throw error;
    }
  },

  // Create new medical record
  createMedicalRecord: async (medicalRecordData) => {
    try {
      const response = await axios.post(`${API_URL}/medical-records`, medicalRecordData);
      return response.data;
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  },

  // Update medical record
  updateMedicalRecord: async (id, medicalRecordData) => {
    try {
      const response = await axios.put(`${API_URL}/medical-records/${id}`, medicalRecordData);
      return response.data;
    } catch (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }
  },

  // Delete medical record (admin only)
  deleteMedicalRecord: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/medical-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting medical record:', error);
      throw error;
    }
  }
};

export default medicalRecordService; 