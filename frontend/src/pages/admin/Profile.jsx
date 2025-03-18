import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch admin profile data from API
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = {
        fullName: 'Admin User',
        email: 'admin@example.com',
        phone: '0123456789',
        address: 'Hà Nội, Việt Nam',
      };
      setFormData(prevState => ({
        ...prevState,
        ...mockData,
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      showSnackbar('Lỗi khi tải thông tin hồ sơ', 'error');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      // TODO: Implement API call to update profile
      console.log('Updating profile:', formData);
      showSnackbar('Cập nhật thông tin thành công', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Lỗi khi cập nhật thông tin', 'error');
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showSnackbar('Mật khẩu mới không khớp', 'error');
      return;
    }
    try {
      // TODO: Implement API call to change password
      console.log('Changing password');
      showSnackbar('Đổi mật khẩu thành công', 'success');
      setFormData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      showSnackbar('Lỗi khi đổi mật khẩu', 'error');
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // TODO: Implement API call to upload avatar
        console.log('Uploading avatar:', file);
        showSnackbar('Cập nhật ảnh đại diện thành công', 'success');
      } catch (error) {
        console.error('Error uploading avatar:', error);
        showSnackbar('Lỗi khi cập nhật ảnh đại diện', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prevState => ({
      ...prevState,
      open: false,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h1">
            Hồ sơ cá nhân
          </Typography>
        </Grid>

        {/* Avatar Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{ width: 200, height: 200, mb: 2 }}
                alt={formData.fullName}
                src="/path-to-avatar.jpg"
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
                aria-label="upload picture"
                component="label"
              >
                <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                <PhotoCamera sx={{ color: 'white' }} />
              </IconButton>
            </Box>
            <Typography variant="h6" gutterBottom>
              {formData.fullName}
            </Typography>
            <Typography color="textSecondary">
              Administrator
            </Typography>
          </Paper>
        </Grid>

        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin cá nhân
            </Typography>
            <Box component="form" onSubmit={handleUpdateProfile} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Cập nhật thông tin
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Change Password */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Đổi mật khẩu
            </Typography>
            <Box component="form" onSubmit={handleChangePassword} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Đổi mật khẩu
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 