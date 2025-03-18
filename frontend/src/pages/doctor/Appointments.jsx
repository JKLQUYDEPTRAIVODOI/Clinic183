import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
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

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    // TODO: Fetch appointments data from API
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          patientId: 1,
          patientName: 'John Doe',
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

  const handleOpen = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData(appointment);
    } else {
      setSelectedAppointment(null);
      setFormData({
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#000000';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Lịch hẹn
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
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: getStatusColor(appointment.status),
                          fontWeight: 'bold',
                        }}
                      >
                        {appointment.status === 'pending' && 'Chờ xác nhận'}
                        {appointment.status === 'confirmed' && 'Đã xác nhận'}
                        {appointment.status === 'completed' && 'Hoàn thành'}
                        {appointment.status === 'cancelled' && 'Đã hủy'}
                      </Typography>
                    </TableCell>
                    <TableCell>{appointment.notes}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpen(appointment)}
                      >
                        Chi tiết
                      </Button>
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
          {selectedAppointment ? 'Chi tiết Lịch hẹn' : 'Thêm Lịch hẹn mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Bệnh nhân"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              margin="normal"
              required
            />
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                label="Trạng thái"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
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

export default Appointments; 