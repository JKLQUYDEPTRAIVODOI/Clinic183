const GuestAppointment = require('../models/GuestAppointment');
const { sendAppointmentConfirmation } = require('../utils/emailService');

// Create a new guest appointment
exports.createGuestAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    
    // Create new appointment
    const appointment = new GuestAppointment(appointmentData);
    await appointment.save();

    // Send confirmation email if email is provided
    if (appointment.email) {
      await sendAppointmentConfirmation({
        to: appointment.email,
        name: appointment.name,
        trackingCode: appointment.trackingCode,
        date: appointment.preferredDate,
        time: appointment.preferredTime,
        department: appointment.department
      });
    }

    res.status(201).json({
      success: true,
      message: 'Đặt lịch thành công',
      trackingCode: appointment.trackingCode,
      appointment
    });
  } catch (error) {
    console.error('Error creating guest appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi đặt lịch',
      error: error.message
    });
  }
};

// Get appointment by tracking code
exports.getAppointmentByTrackingCode = async (req, res) => {
  try {
    const { trackingCode } = req.params;
    
    const appointment = await GuestAppointment.findOne({ trackingCode });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn với mã theo dõi này'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error fetching guest appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi tra cứu lịch hẹn',
      error: error.message
    });
  }
};

// Get all guest appointments (admin only)
exports.getAllGuestAppointments = async (req, res) => {
  try {
    const appointments = await GuestAppointment.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching all guest appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách lịch hẹn',
      error: error.message
    });
  }
};

// Update guest appointment status (admin only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const appointment = await GuestAppointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn'
      });
    }

    appointment.status = status;
    if (note) {
      appointment.adminNote = note;
    }

    await appointment.save();

    // Send email notification if email exists
    if (appointment.email) {
      // TODO: Send status update email
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      appointment
    });
  } catch (error) {
    console.error('Error updating guest appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật trạng thái',
      error: error.message
    });
  }
};

// Add admin note to appointment
exports.addAdminNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const appointment = await GuestAppointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn'
      });
    }

    appointment.adminNote = note;
    await appointment.save();

    res.json({
      success: true,
      message: 'Thêm ghi chú thành công',
      appointment
    });
  } catch (error) {
    console.error('Error adding admin note:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi thêm ghi chú',
      error: error.message
    });
  }
};