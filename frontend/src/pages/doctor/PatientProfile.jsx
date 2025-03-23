import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import patientService from '../../services/patientService';

const DoctorPatientProfile = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState({
    id: '',
    name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    phone: '',
    medical_history: '',
    allergies: '',
    current_medications: '',
    created_at: null
  });
  const [editedPatient, setEditedPatient] = useState(patient);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPatientProfile();
  }, [id]);

  const fetchPatientProfile = async () => {
    try {
      const data = await patientService.getPatientById(id);
      setPatient(data);
      setEditedPatient(data);
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      setAlert({
        open: true,
        message: 'Không thể tải thông tin bệnh nhân',
        severity: 'error'
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPatient(patient);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPatient(patient);
  };

  const handleSave = async () => {
    try {
      await patientService.updatePatient(id, {
        date_of_birth: editedPatient.date_of_birth,
        gender: editedPatient.gender,
        blood_group: editedPatient.blood_group,
        address: editedPatient.address,
        phone: editedPatient.phone,
        medical_history: editedPatient.medical_history,
        allergies: editedPatient.allergies,
        current_medications: editedPatient.current_medications
      });
      setPatient(editedPatient);
      setIsEditing(false);
      setAlert({
        open: true,
        message: 'Cập nhật thông tin thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      setAlert({
        open: true,
        message: 'Không thể cập nhật thông tin',
        severity: 'error'
      });
    }
  };

  const handleChange = (field) => (event) => {
    setEditedPatient({
      ...editedPatient,
      [field]: event.target.value,
    });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Header */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1">
                Hồ sơ bệnh nhân
              </Typography>
              {!isEditing ? (
                <IconButton color="primary" onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
              ) : (
                <Box>
                  <IconButton color="primary" onClick={handleSave}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton color="error" onClick={handleCancel}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={patient.name}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={patient.email}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  type="date"
                  value={isEditing ? editedPatient.date_of_birth : patient.date_of_birth}
                  onChange={handleChange('date_of_birth')}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    value={isEditing ? editedPatient.gender : patient.gender}
                    onChange={handleChange('gender')}
                    disabled={!isEditing}
                    label="Giới tính"
                  >
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nhóm máu"
                  value={isEditing ? editedPatient.blood_group : patient.blood_group}
                  onChange={handleChange('blood_group')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={isEditing ? editedPatient.phone : patient.phone}
                  onChange={handleChange('phone')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={isEditing ? editedPatient.address : patient.address}
                  onChange={handleChange('address')}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Medical Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Thông tin y tế
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tiền sử bệnh"
                  value={isEditing ? editedPatient.medical_history : patient.medical_history}
                  onChange={handleChange('medical_history')}
                  disabled={!isEditing}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dị ứng"
                  value={isEditing ? editedPatient.allergies : patient.allergies}
                  onChange={handleChange('allergies')}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thuốc đang sử dụng"
                  value={isEditing ? editedPatient.current_medications : patient.current_medications}
                  onChange={handleChange('current_medications')}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DoctorPatientProfile; 