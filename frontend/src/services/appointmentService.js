import axios from 'axios';
import { API_URL } from '../config';

// Add request interceptor
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

const appointmentService = {
  // Get all appointments (admin only)
  getAllAppointments: async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  // Get appointments for current patient
  getPatientAppointments: async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/patient/me`);
      return response.data;
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      throw error;
    }
  },

  // Get appointments for current doctor
  getDoctorAppointments: async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/doctor/me`);
      return response.data;
    } catch (error) {
      console.error('Error getting doctor appointments:', error);
      throw error;
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Update an appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await axios.put(`${API_URL}/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/appointments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Delete an appointment
  deleteAppointment: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};

export default appointmentService; 