const Doctor = require('../models/doctorModel');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.getAll();
    res.json(doctors);
  } catch (error) {
    console.error('Error getting doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.getById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error getting doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { user_id, specialization, experience } = req.body;
    
    // Validate required fields
    if (!user_id || !specialization) {
      return res.status(400).json({ message: 'User ID and specialization are required' });
    }
    
    const doctorId = await Doctor.create({
      user_id,
      specialization,
      experience: experience || ''
    });
    
    const newDoctor = await Doctor.getById(doctorId);
    
    res.status(201).json({
      message: 'Doctor created successfully',
      doctor: newDoctor
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const { specialization, experience } = req.body;
    
    // Check if doctor exists
    const doctor = await Doctor.getById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Authorization check
    if (req.user.role !== 'admin' && doctor.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updated = await Doctor.update(id, {
      specialization,
      experience: experience || doctor.experience
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update doctor' });
    }
    
    const updatedDoctor = await Doctor.getById(id);
    
    res.json({
      message: 'Doctor updated successfully',
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if doctor exists
    const doctor = await Doctor.getById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const deleted = await Doctor.delete(id);
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete doctor' });
    }
    
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 