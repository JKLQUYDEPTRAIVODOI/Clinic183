import { Cancel as CancelIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import patientService from '../../services/patientService';

// Hàm chuyển đổi chuỗi ISO sang ngày địa phương dạng yyyy-mm-dd
const getLocalDate = (dateStr) => {
  const date = new Date(dateStr);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split('T')[0];
}

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
      console.log('Profile data:', data);
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
      // Chuyển đổi ngày sinh về định dạng yyyy-mm-dd trước khi gửi đi
      const updatedProfile = {
        ...editedProfile,
        date_of_birth: getLocalDate(editedProfile.date_of_birth)
      };

      await patientService.updateMyProfile({
        date_of_birth: updatedProfile.date_of_birth,
        gender: updatedProfile.gender,
        blood_group: updatedProfile.blood_group,
        address: updatedProfile.address,
        phone: updatedProfile.phone,
        medical_history: updatedProfile.medical_history,
        allergies: updatedProfile.allergies,
        current_medications: updatedProfile.current_medications
      });
      setProfile(updatedProfile);
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
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    type="date"
                    value={editedProfile.date_of_birth ? getLocalDate(editedProfile.date_of_birth) : ''}
                    onChange={handleChange('date_of_birth')}
                    InputLabelProps={{ shrink: true }}
                    sx={{ bgcolor: 'background.paper' }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    value={profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('vi-VN') : ''}
                    disabled
                    sx={{ bgcolor: 'background.paper' }}
                  />
                )}
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