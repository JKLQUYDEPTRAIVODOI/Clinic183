import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Appointments = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    specializationId: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('patient')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch appointments data from API
    fetchAppointments();
    fetchDoctors();
    fetchSpecializations();
  }, []);

  const fetchAppointments = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = [
        {
          id: 1,
          doctorName: 'Dr. John Doe',
          specialization: 'Nội khoa',
          date: '2024-03-25',
          time: '09:00',
          reason: 'Khám định kỳ',
          status: 'confirmed',
        },
        {
          id: 2,
          doctorName: 'Dr. Jane Smith',
          specialization: 'Tim mạch',
          date: '2024-03-28',
          time: '14:30',
          reason: 'Đau ngực',
          status: 'pending',
        },
      ];
      setAppointments(mockData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      // TODO: Implement API call
      const mockDoctors = [
        { id: 1, name: 'Dr. John Doe', specialization: 'Nội khoa' },
        { id: 2, name: 'Dr. Jane Smith', specialization: 'Tim mạch' },
      ];
      setDoctors(mockDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchSpecializations = async () => {
    try {
      // TODO: Implement API call
      const mockSpecializations = [
        { id: 1, name: 'Nội khoa' },
        { id: 2, name: 'Tim mạch' },
        { id: 3, name: 'Da liễu' },
      ];
      setSpecializations(mockSpecializations);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const handleOpen = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        doctorId: appointment.doctorId,
        specializationId: appointment.specializationId,
        date: appointment.date,
        time: appointment.time,
        reason: appointment.reason,
      });
    } else {
      setSelectedAppointment(null);
      setFormData({
        doctorId: '',
        specializationId: '',
        date: '',
        time: '',
        reason: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save/update appointment
      if (selectedAppointment) {
        // Update existing appointment
        setAppointments(appointments.map(appointment =>
          appointment.id === selectedAppointment.id ? { ...appointment, ...formData } : appointment
        ));
      } else {
        // Add new appointment
        const newAppointment = {
          id: appointments.length + 1,
          doctorName: doctors.find(d => d.id === formData.doctorId)?.name,
          specialization: specializations.find(s => s.id === formData.specializationId)?.name,
          ...formData,
          status: 'pending',
        };
        setAppointments([...appointments, newAppointment]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      // TODO: Implement API call to cancel appointment
      setAppointments(appointments.map(appointment =>
        appointment.id === appointmentId ? { ...appointment, status: 'cancelled' } : appointment
      ));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Lịch hẹn khám bệnh
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Đặt lịch hẹn
            </Button>
          </Box>
        </Grid>

        {/* Appointments Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Chuyên khoa</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Giờ</TableCell>
                  <TableCell>Lý do khám</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.specialization}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(appointment.status)}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(appointment)}
                        sx={{ mr: 1 }}
                      >
                        Chi tiết
                      </Button>
                      {appointment.status !== 'cancelled' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleCancel(appointment.id)}
                        >
                          Hủy
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Appointment Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Chi tiết lịch hẹn' : 'Đặt lịch hẹn mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Chuyên khoa</InputLabel>
              <Select
                value={formData.specializationId}
                label="Chuyên khoa"
                onChange={(e) => setFormData({ ...formData, specializationId: e.target.value })}
                required
              >
                {specializations.map((spec) => (
                  <MenuItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Bác sĩ</InputLabel>
              <Select
                value={formData.doctorId}
                label="Bác sĩ"
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                required
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Ngày khám"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Giờ khám"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Lý do khám"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              margin="normal"
              required
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedAppointment ? 'Cập nhật' : 'Đặt lịch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments; 