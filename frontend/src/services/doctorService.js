import axios from 'axios';
import { API_URL } from '../config';

const doctorService = {
  // Get all doctors
  getAllDoctors: async () => {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    const response = await axios.get(`${API_URL}/doctors/${id}`);
    return response.data;
  },

  // Get current doctor's appointments
  getMyAppointments: async () => {
    const response = await axios.get(`${API_URL}/appointments/doctor/me`);
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/appointments/${id}/status`, { status });
    return response.data;
  }
};

export default doctorService;