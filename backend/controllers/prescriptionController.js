const Prescription = require('../models/prescriptionModel');

const prescriptionController = {
  // Lấy tất cả đơn thuốc (admin only)
  getAllPrescriptions: async (req, res) => {
    try {
      const prescriptions = await Prescription.getAll();
      res.json(prescriptions);
    } catch (error) {
      console.error('Error in getAllPrescriptions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy đơn thuốc theo ID
  getPrescriptionById: async (req, res) => {
    try {
      const prescription = await Prescription.getById(req.params.id);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.json(prescription);
    } catch (error) {
      console.error('Error in getPrescriptionById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy đơn thuốc của bệnh nhân hiện tại
  getPatientPrescriptions: async (req, res) => {
    try {
      const prescriptions = await Prescription.getByPatientId(req.user.id);
      res.json(prescriptions);
    } catch (error) {
      console.error('Error in getPatientPrescriptions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy đơn thuốc của bác sĩ hiện tại
  getDoctorPrescriptions: async (req, res) => {
    try {
      const prescriptions = await Prescription.getByDoctorId(req.user.id);
      res.json(prescriptions);
    } catch (error) {
      console.error('Error in getDoctorPrescriptions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Tạo đơn thuốc mới
  createPrescription: async (req, res) => {
    try {
      const { medical_record_id, items } = req.body;

      // Validate required fields
      if (!medical_record_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
          message: 'Medical record ID and at least one medicine item are required' 
        });
      }

      // Validate each item
      for (const item of items) {
        if (!item.medicine_id || !item.dosage || !item.frequency || !item.duration) {
          return res.status(400).json({
            message: 'Each medicine item must include medicine_id, dosage, frequency, and duration'
          });
        }
      }

      const prescriptionId = await Prescription.create({
        medical_record_id,
        items
      });

      const newPrescription = await Prescription.getById(prescriptionId);
      res.status(201).json(newPrescription);
    } catch (error) {
      console.error('Error in createPrescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Cập nhật đơn thuốc
  updatePrescription: async (req, res) => {
    try {
      const { items } = req.body;
      const prescriptionId = req.params.id;

      // Validate items
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
          message: 'At least one medicine item is required' 
        });
      }

      // Validate each item
      for (const item of items) {
        if (!item.medicine_id || !item.dosage || !item.frequency || !item.duration) {
          return res.status(400).json({
            message: 'Each medicine item must include medicine_id, dosage, frequency, and duration'
          });
        }
      }

      const success = await Prescription.update(prescriptionId, { items });
      if (!success) {
        return res.status(404).json({ message: 'Prescription not found' });
      }

      const updatedPrescription = await Prescription.getById(prescriptionId);
      res.json(updatedPrescription);
    } catch (error) {
      console.error('Error in updatePrescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Xóa đơn thuốc (admin only)
  deletePrescription: async (req, res) => {
    try {
      const success = await Prescription.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.json({ message: 'Prescription deleted successfully' });
    } catch (error) {
      console.error('Error in deletePrescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = prescriptionController; 