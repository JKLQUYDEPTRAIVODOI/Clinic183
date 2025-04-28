import api from './api';

const prescriptionService = {
  // Lấy tất cả đơn thuốc (admin)
  getAllPrescriptions: async () => {
    const response = await api.get('/prescriptions');
    return response.data;
  },

  // Lấy đơn thuốc theo ID
  getPrescriptionById: async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  // Lấy đơn thuốc của bệnh nhân hiện tại
  getPatientPrescriptions: async () => {
    const response = await api.get('/prescriptions/patient/me');
    return response.data;
  },

  // Lấy đơn thuốc của bác sĩ hiện tại
  getDoctorPrescriptions: async () => {
    const response = await api.get('/prescriptions/doctor/me');
    return response.data;
  },

  // Tạo đơn thuốc mới
  createPrescription: async (data) => {
    const response = await api.post('/prescriptions', data);
    return response.data;
  },

  // Cập nhật đơn thuốc
  updatePrescription: async (id, data) => {
    const response = await api.put(`/prescriptions/${id}`, data);
    return response.data;
  },

  // Xóa đơn thuốc
  deletePrescription: async (id) => {
    const response = await api.delete(`/prescriptions/${id}`);
    return response.data;
  },

  getMedicalRecordsByAppointmentId: async (appointmentId) => {
    const response = await api.get(`/medical-records/appointment/${appointmentId}`);
    return response.data;
  },

  createMedicalRecord: async (data) => {
    if (!data.appointment_id || !data.diagnosis) {
      throw new Error('Appointment ID and diagnosis are required');
    }
    const response = await api.post('/medical-records', data);
    return response.data;
  },

  updateMedicalRecord: async (id, data) => {
    if (!data.diagnosis) {
      throw new Error('Diagnosis is required');
    }
    const response = await api.put(`/medical-records/${id}`, data);
    return response.data;
  },

  getMedicalRecord: async (id) => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  }
};

export default prescriptionService; 