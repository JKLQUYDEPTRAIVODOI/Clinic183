const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const guestAppointmentSchema = new mongoose.Schema({
  trackingCode: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4().substring(0, 8).toUpperCase()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  symptoms: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  note: {
    type: String
  },
  adminNote: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
guestAppointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const GuestAppointment = mongoose.model('GuestAppointment', guestAppointmentSchema);

module.exports = GuestAppointment; 