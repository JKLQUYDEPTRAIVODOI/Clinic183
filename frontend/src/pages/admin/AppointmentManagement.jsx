import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import patientService from '../../services/patientService';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState([]);
  const [patients, setPatients] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentTab, setCurrentTab] = useState(0); // 0 for regular, 1 for guest
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    status: 'pending',
    // Guest fields
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    symptoms: '',
    preferred_date: '',
    preferred_time: '',
    department: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetchDoctorsBySpecialization(formData.department);
    } else {
      setDoctorsBySpecialization([]);
    }
  }, [formData.department]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Convert ISO date string to yyyy-MM-dd format
    return dateString.split('T')[0];
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return '';
    // If it's already in HH:mm format, return as is
    if (timeString.length === 5) return timeString;
    // If it's in HH:mm:ss format, remove seconds
    if (timeString.length === 8) return timeString.substring(0, 5);
    // If it's an ISO string, extract time part
    const time = new Date(timeString).toTimeString().substring(0, 5);
    return time === 'Invalid' ? '' : time;
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAllAppointments();
      // Format dates and times before setting to state
      const formattedData = data.map(appointment => ({
        ...appointment,
        appointment_date: formatDateForInput(appointment.appointment_date),
        appointment_time: formatTimeForInput(appointment.appointment_time),
        preferred_date: formatDateForInput(appointment.preferred_date),
        preferred_time: formatTimeForInput(appointment.preferred_time)
      }));
      setAppointments(formattedData);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await appointmentService.getSpecializations();
      setSpecializations(response.data);
    } catch (err) {
      console.error('Error fetching specializations:', err);
      setError('Failed to fetch specializations');
    }
  };

  const fetchDoctorsBySpecialization = async (specialization) => {
    try {
      const response = await appointmentService.getDoctorsBySpecialization(specialization);
      setDoctorsBySpecialization(response.data);
    } catch (err) {
      console.error('Error fetching doctors by specialization:', err);
      setError('Failed to fetch doctors');
    }
  };

  const handleOpenDialog = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setCurrentTab(appointment.tracking_code ? 1 : 0);
      setFormData({
        patient_id: appointment.patient_id || '',
        doctor_id: appointment.doctor_id || '',
        appointment_date: formatDateForInput(appointment.appointment_date) || '',
        appointment_time: formatTimeForInput(appointment.appointment_time) || '',
        reason: appointment.reason || '',
        status: appointment.status || 'pending',
        guest_name: appointment.guest_name || '',
        guest_phone: appointment.guest_phone || '',
        guest_email: appointment.guest_email || '',
        symptoms: appointment.symptoms || '',
        preferred_date: formatDateForInput(appointment.preferred_date) || '',
        preferred_time: formatTimeForInput(appointment.preferred_time) || '',
        department: appointment.department || ''
      });
    } else {
      setSelectedAppointment(null);
      setCurrentTab(0);
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        reason: '',
        status: 'pending',
        guest_name: '',
        guest_phone: '',
        guest_email: '',
        symptoms: '',
        preferred_date: '',
        preferred_time: '',
        department: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setCurrentTab(0);
    setFormData({
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      status: 'pending',
      guest_name: '',
      guest_phone: '',
      guest_email: '',
      symptoms: '',
      preferred_date: '',
      preferred_time: '',
      department: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        // Format dates before sending to API
        appointment_date: formData.appointment_date ? new Date(formData.appointment_date).toISOString().split('T')[0] : null,
        appointment_time: formData.appointment_time || null,
        preferred_date: formData.preferred_date ? new Date(formData.preferred_date).toISOString().split('T')[0] : null,
        preferred_time: formData.preferred_time || null,
        // Include other fields that might be needed
        patient_id: formData.patient_id || null,
        doctor_id: formData.doctor_id || null,
        status: formData.status || 'pending',
        reason: formData.reason || '',
        guest_name: formData.guest_name || '',
        guest_phone: formData.guest_phone || '',
        guest_email: formData.guest_email || '',
        symptoms: formData.symptoms || '',
        department: formData.department || ''
      };

      let updatedAppointment;
      if (selectedAppointment) {
        // If status is being changed, use updateAppointmentStatus
        if (selectedAppointment.status !== formData.status) {
          await appointmentService.updateAppointmentStatus(selectedAppointment.id, formData.status);
        }
        updatedAppointment = await appointmentService.updateAppointment(selectedAppointment.id, dataToSubmit);
        
        // Update the local state immediately
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt.id === selectedAppointment.id 
              ? {
                  ...apt,
                  ...updatedAppointment,
                  status: formData.status, // Ensure status is updated
                  appointment_date: formatDateForInput(updatedAppointment.appointment_date),
                  appointment_time: formatTimeForInput(updatedAppointment.appointment_time),
                  preferred_date: formatDateForInput(updatedAppointment.preferred_date),
                  preferred_time: formatTimeForInput(updatedAppointment.preferred_time)
                }
              : apt
          )
        );
      } else {
        if (currentTab === 0) {
          updatedAppointment = await appointmentService.createAppointment(dataToSubmit);
        } else {
          updatedAppointment = await appointmentService.createGuestAppointment(dataToSubmit);
        }
        // Add the new appointment to local state
        setAppointments(prevAppointments => [
          ...prevAppointments,
          {
            ...updatedAppointment,
            appointment_date: formatDateForInput(updatedAppointment.appointment_date),
            appointment_time: formatTimeForInput(updatedAppointment.appointment_time),
            preferred_date: formatDateForInput(updatedAppointment.preferred_date),
            preferred_time: formatTimeForInput(updatedAppointment.preferred_time)
          }
        ]);
      }

      handleCloseDialog();
      // Refresh the full list to ensure consistency
      await fetchAppointments();
    } catch (err) {
      setError('Failed to save appointment');
      console.error('Error saving appointment:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(id);
        // Update local state immediately
        setAppointments(prevAppointments => 
          prevAppointments.filter(appointment => appointment.id !== id)
        );
        setError(null); // Clear any existing errors
      } catch (err) {
        setError('Failed to delete appointment');
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
      // Update local state immediately
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === id
            ? { ...apt, status: newStatus }
            : apt
        )
      );
      // Refresh appointments to ensure consistency
      await fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment status');
      console.error('Error updating appointment status:', err);
    }
  };

  const handleAssignDoctor = async (appointmentId, doctorId) => {
    try {
      await appointmentService.assignDoctorToGuest(appointmentId, doctorId);
      fetchAppointments();
    } catch (err) {
      setError('Failed to assign doctor');
      console.error('Error assigning doctor:', err);
    }
  };

  const handleConvertToRegular = async (appointmentId, patientId) => {
    try {
      await appointmentService.convertGuestToRegular(appointmentId, patientId);
      fetchAppointments();
    } catch (err) {
      setError('Failed to convert appointment');
      console.error('Error converting appointment:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPatientName = (appointment) => {
    if (appointment.guest_name) {
      return `${appointment.guest_name} (Khách)`;
    }
    return patients.find(p => p.id === appointment.patient_id)?.name || 'Unknown';
  };

  const getDoctorName = (appointment) => {
    if (appointment.doctor_name) {
      return appointment.doctor_name;
    }
    if (appointment.department) {
      return `Chờ phân công - ${appointment.department}`;
    }
    return 'Chưa phân công';
  };

  const getAppointmentDate = (appointment) => {
    if (appointment.tracking_code) {
      return appointment.preferred_date ? formatDateForInput(appointment.preferred_date) : 'Chưa xác định';
    }
    return formatDateForInput(appointment.appointment_date);
  };

  const getAppointmentTime = (appointment) => {
    if (appointment.tracking_code) {
      return appointment.preferred_time ? formatTimeForInput(appointment.preferred_time) : 'Chưa xác định';
    }
    return formatTimeForInput(appointment.appointment_time);
  };

  const renderForm = () => {
    if (currentTab === 0) {
      return (
        <>
          <TextField
            select
            fullWidth
            margin="normal"
            name="patient_id"
            label="Patient"
            value={formData.patient_id}
            onChange={handleInputChange}
            required
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            margin="normal"
            name="doctor_id"
            label="Doctor"
            value={formData.doctor_id}
            onChange={handleInputChange}
            required
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            name="appointment_date"
            label="Appointment Date"
            type="date"
            value={formData.appointment_date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="appointment_time"
            label="Appointment Time"
            type="time"
            value={formData.appointment_time}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="reason"
            label="Reason"
            multiline
            rows={3}
            value={formData.reason}
            onChange={handleInputChange}
            required
          />
        </>
      );
    } else {
      return (
        <>
          <TextField
            fullWidth
            margin="normal"
            name="guest_name"
            label="Guest Name"
            value={formData.guest_name}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="guest_phone"
            label="Phone Number"
            value={formData.guest_phone}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="guest_email"
            label="Email"
            type="email"
            value={formData.guest_email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="symptoms"
            label="Symptoms"
            multiline
            rows={3}
            value={formData.symptoms}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="preferred_date"
            label="Preferred Date"
            type="date"
            value={formData.preferred_date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="preferred_time"
            label="Preferred Time"
            type="time"
            value={formData.preferred_time}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            select
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleInputChange}
            required
          >
            {specializations.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </TextField>
          {formData.department && (
            <TextField
              fullWidth
              margin="normal"
              select
              name="doctor_id"
              label="Doctor (Optional)"
              value={formData.doctor_id}
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <em>Select a doctor</em>
              </MenuItem>
              {doctorsBySpecialization.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </>
      );
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Appointment Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Appointment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient/Guest</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {getPatientName(appointment)}
                  {appointment.tracking_code && (
                    <Chip
                      size="small"
                      label={`Code: ${appointment.tracking_code}`}
                      sx={{ ml: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell>{getDoctorName(appointment)}</TableCell>
                <TableCell>{getAppointmentDate(appointment)}</TableCell>
                <TableCell>{getAppointmentTime(appointment)}</TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(appointment)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        </DialogTitle>
        <DialogContent>
          {!selectedAppointment && (
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="Regular Appointment" />
              <Tab label="Guest Appointment" />
            </Tabs>
          )}
          <form onSubmit={handleSubmit}>
            {renderForm()}
            {selectedAppointment && (
              <TextField
                select
                fullWidth
                margin="normal"
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentManagement; 