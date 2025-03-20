const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

// Authenticate token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Extracted token:', token);
    
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    console.log('Attempting to verify token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
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
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
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