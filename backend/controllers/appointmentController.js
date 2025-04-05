const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const { sendAppointmentConfirmation, sendStatusUpdateEmail } = require('../utils/emailService');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

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
      (appointment.patient_id !== req.patient?.id) && 
      (appointment.doctor_id !== req.doctor?.id) &&
      !appointment.tracking_code // Allow access if it's a guest appointment with tracking code
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

// Create a new regular appointment
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

// Create a guest appointment
exports.createGuestAppointment = async (req, res) => {
  try {
    const {
      guest_name,
      guest_phone,
      guest_email,
      symptoms,
      preferred_date,
      preferred_time,
      department,
      doctor_id
    } = req.body;

    // Validate required fields
    if (!guest_name || !guest_phone || !symptoms || !preferred_date || !preferred_time || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Generate tracking code
    const tracking_code = uuidv4().substring(0, 8).toUpperCase();

    const appointmentData = {
      tracking_code,
      guest_name,
      guest_phone,
      guest_email: guest_email || null,
      symptoms,
      preferred_date,
      preferred_time,
      department,
      status: 'pending',
      patient_id: null,
      doctor_id: doctor_id || null,
      appointment_date: null,
      appointment_time: null,
      reason: symptoms
    };

    const appointmentId = await Appointment.create(appointmentData);
    const newAppointment = await Appointment.getById(appointmentId);

    // Send confirmation email if email provided
    if (guest_email) {
      try {
        await sendAppointmentConfirmation({
          to: guest_email,
          name: guest_name,
          trackingCode: tracking_code,
          date: preferred_date,
          time: preferred_time,
          department
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Guest appointment created successfully',
      data: {
        tracking_code,
        appointment_id: appointmentId
      }
    });
  } catch (error) {
    console.error('Error creating guest appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// Get appointment by tracking code
exports.getAppointmentByTrackingCode = async (req, res) => {
  try {
    const { tracking_code } = req.params;
    const appointment = await Appointment.getByTrackingCode(tracking_code);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const appointment = await Appointment.getById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Authorization check
    if (
      req.user.role !== 'admin' && 
      (appointment.patient_id !== req.patient?.id) && 
      (appointment.doctor_id !== req.doctor?.id) &&
      !appointment.tracking_code
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let updateData = {};
    
    if (appointment.tracking_code) {
      // Guest appointment update
      updateData = {
        ...appointment,
        guest_name: req.body.guest_name || appointment.guest_name,
        guest_phone: req.body.guest_phone || appointment.guest_phone,
        guest_email: req.body.guest_email || appointment.guest_email,
        symptoms: req.body.symptoms || appointment.symptoms,
        preferred_date: req.body.preferred_date || appointment.preferred_date,
        preferred_time: req.body.preferred_time || appointment.preferred_time,
        department: req.body.department || appointment.department
      };
    } else {
      // Regular appointment update
      const { doctor_id, appointment_date, appointment_time } = req.body;
      
      if (!doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: 'Doctor, date and time are required' });
      }

      // Check for conflicts
      const conflict = await Appointment.checkConflict(doctor_id, appointment_date, appointment_time, id);
      if (conflict) {
        return res.status(400).json({ message: 'Doctor already has an appointment at this time' });
      }

      updateData = {
        ...appointment,
        doctor_id,
        appointment_date,
        appointment_time,
        reason: req.body.reason || appointment.reason
      };
    }
    
    const updated = await Appointment.update(id, updateData);
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
    const { id } = req.params;
    const { status, adminNote } = req.body;
    
    // Get the appointment
    const appointment = await Appointment.getById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update status
    await Appointment.updateStatus(id, status);
    
    // Send email notification if it's a guest appointment
    if (appointment.guest_email) {
      try {
        await sendStatusUpdateEmail({
          to: appointment.guest_email,
          name: appointment.guest_name,
          trackingCode: appointment.tracking_code,
          status,
          note: adminNote
        });
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
      }
    }

    // Get updated appointment
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

// Convert guest appointment to regular appointment
exports.convertGuestToRegular = async (req, res) => {
  try {
    const { appointmentId, patientId } = req.body;

    // Validate input
    if (!appointmentId || !patientId) {
      return res.status(400).json({ message: 'Appointment ID and Patient ID are required' });
    }

    // Check if appointment exists and is a guest appointment
    const appointment = await Appointment.getById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!appointment.tracking_code) {
      return res.status(400).json({ message: 'This is not a guest appointment' });
    }

    // Check if patient exists
    const patient = await Patient.getById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Convert appointment
    const converted = await Appointment.convertToRegular(appointmentId, patientId);
    if (!converted) {
      return res.status(400).json({ message: 'Failed to convert appointment' });
    }

    res.json({ message: 'Guest appointment converted to regular appointment successfully' });
  } catch (error) {
    console.error('Error converting guest appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign doctor to guest appointment
exports.assignDoctorToGuest = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { doctorId } = req.body;

    // Validate input
    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    // Check if appointment exists and is a guest appointment
    const appointment = await Appointment.getById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!appointment.tracking_code) {
      return res.status(400).json({ message: 'This is not a guest appointment' });
    }

    // Check if doctor exists
    const doctor = await Doctor.getById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for conflicts
    const conflict = await Appointment.checkConflict(
      doctorId,
      appointment.preferred_date,
      appointment.preferred_time
    );
    if (conflict) {
      return res.status(400).json({ message: 'Doctor already has an appointment at this time' });
    }

    // Assign doctor
    const assigned = await Appointment.assignDoctor(appointmentId, doctorId);
    if (!assigned) {
      return res.status(400).json({ message: 'Failed to assign doctor' });
    }

    // Send email notification if email exists
    if (appointment.guest_email) {
      try {
        await sendStatusUpdateEmail({
          email: appointment.guest_email,
          name: appointment.guest_name,
          trackingCode: appointment.tracking_code,
          status: 'accepted',
          doctorName: doctor.name,
          appointmentDate: appointment.preferred_date,
          appointmentTime: appointment.preferred_time
        });
      } catch (emailError) {
        console.error('Error sending doctor assignment email:', emailError);
      }
    }

    res.json({ message: 'Doctor assigned to guest appointment successfully' });
  } catch (error) {
    console.error('Error assigning doctor to guest appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    
    const appointment = await Appointment.getById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Authorization check - Only admin, the patient who created it, or guest with tracking code can delete
    if (
      req.user.role !== 'admin' && 
      appointment.patient_id !== req.patient?.id &&
      !appointment.tracking_code
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
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

// Get all specializations
exports.getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.getSpecializations();
    res.status(200).json({
      success: true,
      data: specializations
    });
  } catch (error) {
    console.error('Error getting specializations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get doctors by specialization
exports.getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const doctors = await Doctor.getBySpecialization(specialization);
    res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Error getting doctors by specialization:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 