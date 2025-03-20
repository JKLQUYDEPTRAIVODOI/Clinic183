import api from './api';

const patientService = {
  // Get all patients
  getAllPatients: async () => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Error getting patients:', error);
      throw error;
    }
  },

  // Get patient by ID
  getPatientById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting patient:', error);
      throw error;
    }
  },

  // Get current patient's appointments
  getMyAppointments: async () => {
    try {
      const response = await api.get('/appointments/patient/me');
      return response.data;
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  },

  // Get patient's medical records
  getMedicalRecords: async () => {
    try {
      const response = await api.get('/medical-records/patient/me');
      return response.data;
    } catch (error) {
      console.error('Error getting medical records:', error);
      throw error;
    }
  }
};

export default patientService;