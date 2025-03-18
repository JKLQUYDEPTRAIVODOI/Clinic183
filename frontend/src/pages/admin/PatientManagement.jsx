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

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
  });

  useEffect(() => {
    // TODO: Fetch patients data from API
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main St',
          dateOfBirth: '1990-01-01',
          gender: 'Nam',
          bloodGroup: 'A+',
        },
        // Add more mock data as needed
      ];
      setPatients(mockData);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleOpen = (patient = null) => {
    if (patient) {
      setSelectedPatient(patient);
      setFormData(patient);
    } else {
      setSelectedPatient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save/update patient
      if (selectedPatient) {
        // Update existing patient
        setPatients(patients.map(patient =>
          patient.id === selectedPatient.id ? { ...patient, ...formData } : patient
        ));
      } else {
        // Add new patient
        const newPatient = {
          id: patients.length + 1,
          ...formData,
        };
        setPatients([...patients, newPatient]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Implement API call to delete patient
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Bệnh nhân
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Thêm Bệnh nhân
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
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>Nhóm máu</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                    <TableCell>{patient.dateOfBirth}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.bloodGroup}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(patient)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(patient.id)}>
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
          {selectedPatient ? 'Chỉnh sửa Bệnh nhân' : 'Thêm Bệnh nhân mới'}
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
              label="Địa chỉ"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Ngày sinh"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Giới tính"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Nhóm máu"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedPatient ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientManagement; 