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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
  });

  useEffect(() => {
    // TODO: Fetch doctors data from API
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          name: 'Dr. John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          specialization: 'Cardiology',
          experience: '5 years',
        },
        // Add more mock data as needed
      ];
      setDoctors(mockData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleOpen = (doctor = null) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      setFormData(doctor);
    } else {
      setSelectedDoctor(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save/update doctor
      if (selectedDoctor) {
        // Update existing doctor
        setDoctors(doctors.map(doctor =>
          doctor.id === selectedDoctor.id ? { ...doctor, ...formData } : doctor
        ));
      } else {
        // Add new doctor
        const newDoctor = {
          id: doctors.length + 1,
          ...formData,
        };
        setDoctors([...doctors, newDoctor]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Implement API call to delete doctor
      setDoctors(doctors.filter(doctor => doctor.id !== id));
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Bác sĩ
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Thêm Bác sĩ
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Chuyên khoa</TableCell>
                  <TableCell>Kinh nghiệm</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>{doctor.phone}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.experience}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(doctor)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(doctor.id)}>
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
          {selectedDoctor ? 'Chỉnh sửa Bác sĩ' : 'Thêm Bác sĩ mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tên"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Chuyên khoa"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Kinh nghiệm"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedDoctor ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorManagement; 