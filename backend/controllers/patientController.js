const Patient = require('../models/patientModel');

// Lấy tất cả bệnh nhân
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.getAll();
    res.json(patients);
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy bệnh nhân theo ID
exports.getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Patient.getById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tìm kiếm bệnh nhân theo tên
exports.searchPatients = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      const patients = await Patient.getAll();
      return res.json(patients);
    }
    
    const patients = await Patient.searchByName(name);
    res.json(patients);
  } catch (error) {
    console.error('Error searching patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 