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

  // Get current patient's profile
  getMyProfile: async () => {
    try {
      const response = await api.get('/patients/me');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  // Update current patient's profile
  updateMyProfile: async (profileData) => {
    try {
      const response = await api.put('/patients/me', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    try {
      const response = await api.put(`/patients/${id}`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  },

  // Get patient's medical history
  getPatientMedicalHistory: async (id) => {
    try {
      const response = await api.get(`/patients/${id}/medical-history`);
      return response.data;
    } catch (error) {
      console.error('Error getting patient medical history:', error);
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