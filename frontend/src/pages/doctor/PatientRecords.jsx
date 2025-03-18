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
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    bloodGroup: '',
    medicalHistory: '',
    allergies: '',
    medications: '',
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
          dateOfBirth: '1990-01-01',
          gender: 'Nam',
          phone: '1234567890',
          address: '123 Main St',
          bloodGroup: 'A+',
          medicalHistory: 'Tiền sử bệnh tim',
          allergies: 'Không',
          medications: 'Thuốc huyết áp',
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
        dateOfBirth: '',
        gender: '',
        phone: '',
        address: '',
        bloodGroup: '',
        medicalHistory: '',
        allergies: '',
        medications: '',
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Hồ sơ Bệnh nhân
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
                  <TableCell>Tên bệnh nhân</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Nhóm máu</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.dateOfBirth}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.bloodGroup}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpen(patient)}
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPatient ? 'Chi tiết Bệnh nhân' : 'Thêm Bệnh nhân mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Thông tin cơ bản" />
              <Tab label="Tiền sử bệnh" />
              <Tab label="Đơn thuốc" />
            </Tabs>

            {selectedTab === 0 && (
              <>
                <TextField
                  fullWidth
                  label="Tên bệnh nhân"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  label="Nhóm máu"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  margin="normal"
                  required
                />
              </>
            )}

            {selectedTab === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Tiền sử bệnh"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  margin="normal"
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Dị ứng"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </>
            )}

            {selectedTab === 2 && (
              <TextField
                fullWidth
                label="Thuốc đang sử dụng"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                margin="normal"
                multiline
                rows={4}
              />
            )}
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

export default PatientRecords; 