const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

// Get all appointments (admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getAll();
    res.json(appointments);
   
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.getById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check authorization - only admin, the patient, or the doctor can see the appointment
    if (
      req.user.role !== 'admin' && 
      appointment.patient_id !== req.patient?.id && 
      appointment.doctor_id !== req.doctor?.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error getting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get appointments for current patient
exports.getPatientAppointments = async (req, res) => {
  try {
    if (!req.patient) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const appointments = await Appointment.getByPatientId(req.patient.id);
    res.json(appointments);
  } catch (error) {
    console.error('Error getting patient appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get appointments for current doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    if (!req.doctor) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const appointments = await Appointment.getByDoctorId(req.doctor.id);
    res.json(appointments);
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;
    
    // Validate required fields
    if (!doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: 'Doctor, date and time are required' });
    }

    // Check if doctor exists
    const doctor = await Doctor.getById(doctor_id);
    if (!doctor) {
      return res.status(400).json({ message: 'Doctor not found' });
    }
    
    let patient_id;
    
    // If admin is creating appointment, patient_id is required in the request
    if (req.user.role === 'admin') {
      patient_id = req.body.patient_id;
      if (!patient_id) {
        return res.status(400).json({ message: 'Patient ID is required' });
      }
      
      const patient = await Patient.getById(patient_id);
      if (!patient) {
        return res.status(400).json({ message: 'Patient not found' });
      }
    } else {
      // For patients creating their own appointments
      if (!req.patient) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      patient_id = req.patient.id;
    }
    
    // Check for conflicts
    const conflict = await Appointment.checkConflict(doctor_id, appointment_date, appointment_time);
    if (conflict) {
      return res.status(400).json({ message: 'Doctor already has an appointment at this time' });
    }
    
    // Create appointment
    const appointmentData = {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason: reason || '',
      status: 'pending'
    };
    
    const appointmentId = await Appointment.create(appointmentData);
    const newAppointment = await Appointment.getById(appointmentId);
    
    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const { doctor_id, patient_id, appointment_date, appointment_time, reason, status } = req.body;
    
    // Validate required fields
    if (!doctor_id || !patient_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: 'Doctor, patient, date and time are required' });
    }
    
    // Check if appointment exists
    const appointment = await Appointment.getById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Authorization check
    if (
      req.user.role !== 'admin' && 
      appointment.patient_id !== req.patient?.id && 
      appointment.doctor_id !== req.doctor?.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Check for conflicts
    const conflict = await Appointment.checkConflict(doctor_id, appointment_date, appointment_time, id);
    if (conflict) {
      return res.status(400).json({ message: 'Doctor already has an appointment at this time' });
    }
    
    // Update appointment
    const appointmentData = {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason: reason || '',
      status: status || appointment.status
    };
    
    const updated = await Appointment.update(id, appointmentData);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update appointment' });
    }
    
    const updatedAppointment = await Appointment.getById(id);
    
    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    
    if (!status || !['pending', 'accepted', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }
    
    // Check if appointment exists
    const appointment = await Appointment.getById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Authorization check - Only admin or doctor can update status
    if (
      req.user.role !== 'admin' && 
      appointment.doctor_id !== req.doctor?.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update status
    const updated = await Appointment.updateStatus(id, status);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update appointment status' });
    }
    
    const updatedAppointment = await Appointment.getById(id);
    
    res.json({
      message: 'Appointment status updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if appointment exists
    const appointment = await Appointment.getById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Authorization check - Only admin or the patient who created it can delete
    if (
      req.user.role !== 'admin' && 
      appointment.patient_id !== req.patient?.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete appointment
    const deleted = await Appointment.delete(id);
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete appointment' });
    }
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 