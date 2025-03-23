const Patient = require('../models/patientModel');

// Get current patient's profile
exports.getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.getByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update current patient's profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { date_of_birth, gender, blood_group, address, phone, medical_history, allergies, current_medications } = req.body;
    
    // Check if patient exists
    const patient = await Patient.getByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const updated = await Patient.update(patient.id, {
      date_of_birth,
      gender,
      blood_group,
      address,
      phone,
      medical_history,
      allergies,
      current_medications
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update profile' });
    }
    
    const updatedPatient = await Patient.getByUserId(req.user.id);
    
    res.json({
      message: 'Profile updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.getAll();
    res.json(patients);
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.getById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const { date_of_birth, gender, blood_group, address, phone, medical_history, allergies, current_medications } = req.body;
    
    // Check if patient exists
    const patient = await Patient.getById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const updated = await Patient.update(id, {
      date_of_birth,
      gender,
      blood_group,
      address,
      phone,
      medical_history,
      allergies,
      current_medications
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update patient' });
    }
    
    const updatedPatient = await Patient.getById(id);
    
    res.json({
      message: 'Patient updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
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