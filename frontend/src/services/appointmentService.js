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
    const response = await axios.get(`${API_URL}/appointments`);
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await axios.get(`${API_URL}/appointments/${id}`);
    return response.data;
  },

  // Get appointments for current patient
  getPatientAppointments: async () => {
    const response = await axios.get(`${API_URL}/appointments/patient/me`);
    return response.data;
  },

  // Get appointments for current doctor
  getDoctorAppointments: async () => {
    const response = await axios.get(`${API_URL}/appointments/doctor/me`);
    return response.data;
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    const response = await axios.post(`${API_URL}/appointments`, appointmentData);
    return response.data;
  },

  // Update an appointment
  updateAppointment: async (id, appointmentData) => {
    const response = await axios.put(`${API_URL}/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/appointments/${id}/status`, { status });
    return response.data;
  },

  // Delete an appointment
  deleteAppointment: async (id) => {
    const response = await axios.delete(`${API_URL}/appointments/${id}`);
    return response.data;
  }
};

export default appointmentService; 