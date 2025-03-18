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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    time: '',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    // TODO: Fetch data from API
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          doctorId: 1,
          patientId: 1,
          date: '2024-03-20',
          time: '09:00',
          status: 'pending',
          notes: 'Khám tổng quát',
        },
        // Add more mock data as needed
      ];
      setAppointments(mockData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        { id: 1, name: 'Dr. John Doe' },
        { id: 2, name: 'Dr. Jane Smith' },
      ];
      setDoctors(mockData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      setPatients(mockData);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleOpen = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData(appointment);
    } else {
      setSelectedAppointment(null);
      setFormData({
        doctorId: '',
        patientId: '',
        date: '',
        time: '',
        status: 'pending',
        notes: '',
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
          ...formData,
        };
        setAppointments([...appointments, newAppointment]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Implement API call to delete appointment
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : '';
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : '';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Lịch hẹn
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Thêm Lịch hẹn
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Giờ</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{getDoctorName(appointment.doctorId)}</TableCell>
                    <TableCell>{getPatientName(appointment.patientId)}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>{appointment.notes}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(appointment)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(appointment.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedAppointment ? 'Chỉnh sửa Lịch hẹn' : 'Thêm Lịch hẹn mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Bác sĩ"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              margin="normal"
              required
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Bệnh nhân"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              margin="normal"
              required
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Ngày"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Giờ"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              select
              label="Trạng thái"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              margin="normal"
              required
            >
              <MenuItem value="pending">Chờ xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Ghi chú"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedAppointment ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentManagement; 