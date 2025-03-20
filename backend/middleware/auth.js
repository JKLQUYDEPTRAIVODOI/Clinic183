const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

// Authenticate token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;

    // If user is a doctor, attach doctor info
    if (decoded.role === 'doctor') {
      const doctor = await Doctor.getByUserId(decoded.id);
      if (doctor) {
        req.doctor = doctor;
      }
    }

    // If user is a patient, attach patient info
    if (decoded.role === 'patient') {
      const patient = await Patient.getByUserId(decoded.id);
      if (patient) {
        req.patient = patient;
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Authorize admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Authorize doctor
const authorizeDoctor = (req, res, next) => {
  if (!req.user || req.user.role !== 'doctor' || !req.doctor) {
    return res.status(403).json({ message: 'Access denied. Doctor only.' });
  }
  next();
};

// Authorize patient
const authorizePatient = (req, res, next) => {
  if (!req.user || req.user.role !== 'patient' || !req.patient) {
    return res.status(403).json({ message: 'Access denied. Patient only.' });
  }
  next();
};

module.exports = { 
  authenticateToken, 
  authorizeAdmin, 
  authorizeDoctor, 
  authorizePatient 
}; 