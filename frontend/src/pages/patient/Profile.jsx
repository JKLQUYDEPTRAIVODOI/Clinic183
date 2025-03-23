import React, { useState, useEffect } from 'react';
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
  Button,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import patientService from '../../services/patientService';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
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
  const [editedProfile, setEditedProfile] = useState(profile);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await patientService.getMyProfile();
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setAlert({
        open: true,
        message: 'Không thể tải thông tin cá nhân',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await patientService.updateMyProfile({
        date_of_birth: editedProfile.date_of_birth,
        gender: editedProfile.gender,
        blood_group: editedProfile.blood_group,
        address: editedProfile.address,
        phone: editedProfile.phone,
        medical_history: editedProfile.medical_history,
        allergies: editedProfile.allergies,
        current_medications: editedProfile.current_medications
      });
      setProfile(editedProfile);
      setIsEditing(false);
      setAlert({
        open: true,
        message: 'Cập nhật thông tin thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert({
        open: true,
        message: 'Không thể cập nhật thông tin',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setEditedProfile({
      ...editedProfile,
      [field]: event.target.value,
    });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
    }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Hồ sơ cá nhân
              </Typography>
        <Box>
              {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'medium'
              }}
            >
              Chỉnh sửa
            </Button>
              ) : (
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Lưu
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Hủy
              </Button>
                </Box>
              )}
            </Box>
            </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          background: 'linear-gradient(to right, #ffffff, #f8f9fa)'
        }}
      >
        <Grid container spacing={4}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Thông tin cơ bản
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={profile.name}
                  disabled={true}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  disabled={true}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  type="date"
                  value={isEditing ? editedProfile.date_of_birth : profile.date_of_birth}
                  onChange={handleChange('date_of_birth')}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ bgcolor: 'background.paper' }}>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    value={isEditing ? editedProfile.gender : profile.gender}
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
                  value={isEditing ? editedProfile.blood_group : profile.blood_group}
                  onChange={handleChange('blood_group')}
                  disabled={!isEditing}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={handleChange('phone')}
                  disabled={!isEditing}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={isEditing ? editedProfile.address : profile.address}
                  onChange={handleChange('address')}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Medical Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Thông tin y tế
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tiền sử bệnh"
                  value={isEditing ? editedProfile.medical_history : profile.medical_history}
                  onChange={handleChange('medical_history')}
                  disabled={!isEditing}
                  multiline
                  rows={4}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dị ứng"
                  value={isEditing ? editedProfile.allergies : profile.allergies}
                  onChange={handleChange('allergies')}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thuốc đang sử dụng"
                  value={isEditing ? editedProfile.current_medications : profile.current_medications}
                  onChange={handleChange('current_medications')}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                  sx={{ bgcolor: 'background.paper' }}
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
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          sx={{ 
            borderRadius: 2,
            width: '100%'
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 