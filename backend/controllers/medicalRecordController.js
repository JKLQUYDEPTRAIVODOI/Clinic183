const MedicalRecord = require('../models/medicalRecordModel');
const { checkRole } = require('../middleware/auth');

const medicalRecordController = {
  // Get all medical records (admin only)
  getAllMedicalRecords: async (req, res) => {
    try {
      const records = await MedicalRecord.getAll();
      res.json(records);
    } catch (error) {
      console.error('Error in getAllMedicalRecords:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get medical record by ID
  getMedicalRecordById: async (req, res) => {
    try {
      const record = await MedicalRecord.getById(req.params.id);
      if (!record) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.json(record);
    } catch (error) {
      console.error('Error in getMedicalRecordById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get medical records for current patient
  getPatientMedicalRecords: async (req, res) => {
    try {
      const records = await MedicalRecord.getByPatientId(req.user.id);
      res.json(records);
    } catch (error) {
      console.error('Error in getPatientMedicalRecords:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get medical records for current doctor
  getDoctorMedicalRecords: async (req, res) => {
    try {
      const records = await MedicalRecord.getByDoctorId(req.user.id);
      res.json(records);
    } catch (error) {
      console.error('Error in getDoctorMedicalRecords:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Create new medical record
  createMedicalRecord: async (req, res) => {
    try {
      const { appointment_id, diagnosis, notes } = req.body;

      // Validate required fields
      if (!appointment_id || !diagnosis) {
        return res.status(400).json({ message: 'Appointment ID and diagnosis are required' });
      }

      const recordId = await MedicalRecord.create({
        appointment_id,
        diagnosis,
        notes
      });

      const newRecord = await MedicalRecord.getById(recordId);
      res.status(201).json(newRecord);
    } catch (error) {
      console.error('Error in createMedicalRecord:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update medical record
  updateMedicalRecord: async (req, res) => {
    try {
      const { diagnosis, notes } = req.body;
      const recordId = req.params.id;

      // Validate required fields
      if (!diagnosis) {
        return res.status(400).json({ message: 'Diagnosis is required' });
      }

      const success = await MedicalRecord.update(recordId, {
        diagnosis,
        notes
      });

      if (!success) {
        return res.status(404).json({ message: 'Medical record not found' });
      }

      const updatedRecord = await MedicalRecord.getById(recordId);
      res.json(updatedRecord);
    } catch (error) {
      console.error('Error in updateMedicalRecord:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete medical record (admin only)
  deleteMedicalRecord: async (req, res) => {
    try {
      const success = await MedicalRecord.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.json({ message: 'Medical record deleted successfully' });
    } catch (error) {
      console.error('Error in deleteMedicalRecord:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = medicalRecordController; 