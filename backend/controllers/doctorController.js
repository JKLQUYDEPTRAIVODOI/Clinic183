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

// Get current doctor's profile
exports.getCurrentDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.getByUserId(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.json({
      id: doctor.id,
      user_id: doctor.user_id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      experience_years: doctor.experience_years,
      bio: doctor.bio,
      created_at: doctor.created_at
    });
  } catch (error) {
    console.error('Error getting current doctor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update current doctor's profile
exports.updateCurrentDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.getByUserId(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const { specialization, experience_years, bio } = req.body;
    
    // Validate required fields
    if (!specialization) {
      return res.status(400).json({ message: 'Specialization is required' });
    }

    // Validate experience_years if provided
    if (experience_years !== undefined && experience_years !== null) {
      const years = parseInt(experience_years);
      if (isNaN(years) || years < 0) {
        return res.status(400).json({ message: 'Experience years must be a positive number' });
      }
    }
    
    const updated = await Doctor.update(doctor.id, {
      specialization,
      experience_years: experience_years || doctor.experience_years,
      bio: bio || doctor.bio
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update doctor profile' });
    }
    
    const updatedDoctor = await Doctor.getById(doctor.id);
    
    res.json({
      message: 'Profile updated successfully',
      doctor: {
        id: updatedDoctor.id,
        user_id: updatedDoctor.user_id,
        name: updatedDoctor.name,
        email: updatedDoctor.email,
        specialization: updatedDoctor.specialization,
        experience_years: updatedDoctor.experience_years,
        bio: updatedDoctor.bio,
        created_at: updatedDoctor.created_at
      }
    });
  } catch (error) {
    console.error('Error updating current doctor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 