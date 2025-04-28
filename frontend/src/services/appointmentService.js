import api from './api';

const appointmentService = {
  // Get all appointments (admin only)
  getAllAppointments: async () => {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      throw error;
    }
  },

  // Get appointments for current patient
  getPatientAppointments: async () => {
    try {
      const response = await api.get('/appointments/patient/me');
      return response.data;
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      throw error;
    }
  },

  // Get appointments for current doctor
  getDoctorAppointments: async () => {
    try {
      const response = await api.get('/appointments/doctor/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw error;
    }
  },

  // Create a new regular appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Create a guest appointment
  createGuestAppointment: async (guestData) => {
    try {
      const response = await api.post('/appointments/guest', guestData);
      return response.data;
    } catch (error) {
      console.error('Error creating guest appointment:', error);
      throw error;
    }
  },

  // Get appointment by tracking code
  getAppointmentByTracking: async (trackingCode) => {
    try {
      const response = await api.get(`/appointments/guest/${trackingCode}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment by tracking code:', error);
      throw error;
    }
  },

  // Update an appointment
  updateAppointment: async (id, data) => {
    try {
      const response = await api.put(`/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status, adminNote) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status, adminNote });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Update diagnosis for an appointment
  updateDiagnosis: async (id, diagnosis) => {
    try {
      const response = await api.patch(`/appointments/${id}/diagnosis`, { diagnosis });
      return response.data;
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      throw error;
    }
  },

  // Convert guest appointment to regular appointment (admin only)
  convertGuestToRegular: async (appointmentId, patientId) => {
    try {
      const response = await api.post('/appointments/guest/convert', {
        appointmentId,
        patientId
      });
      return response.data;
    } catch (error) {
      console.error('Error converting guest appointment:', error);
      throw error;
    }
  },

  // Assign doctor to guest appointment (admin only)
  assignDoctorToGuest: async (appointmentId, doctorId) => {
    try {
      const response = await api.post(`/appointments/guest/${appointmentId}/assign-doctor`, {
        doctorId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning doctor to guest appointment:', error);
      throw error;
    }
  },

  // Delete an appointment (admin only)
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },

  // Get all specializations
  getSpecializations: async () => {
    try {
      const response = await api.get('/appointments/specializations');
      return response.data;
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw error;
    }
  },

  // Get doctors by specialization
  getDoctorsBySpecialization: async (specialization) => {
    try {
      const response = await api.get(`/appointments/doctors-by-specialization/${encodeURIComponent(specialization)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors by specialization:', error);
      throw error;
    }
  }
};

export default appointmentService; 