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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Lock as LockIcon } from '@mui/icons-material';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [profile, setProfile] = useState({
    id: 1,
    avatar: 'https://example.com/avatar.jpg',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    bloodType: 'A+',
    height: '170',
    weight: '65',
    allergies: 'Không',
    chronicDiseases: 'Không',
    emergencyContact: 'Nguyễn Văn B - 0987654321',
    address: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
  });
  const [editedProfile, setEditedProfile] = useState(profile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // TODO: Fetch patient profile from API
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      // TODO: Implement API call to update profile
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (field) => (event) => {
    setEditedProfile({
      ...editedProfile,
      [field]: event.target.value,
    });
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordForm({
      ...passwordForm,
      [field]: event.target.value,
    });
  };

  const handleChangePassword = async () => {
    try {
      // TODO: Implement API call to change password
      setOpenPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Header */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" component="h1">
                Thông tin cá nhân
              </Typography>
              {!isEditing ? (
                <Box>
                  <IconButton color="primary" onClick={handleEdit} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => setOpenPasswordDialog(true)}>
                    <LockIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <IconButton color="primary" onClick={handleSave} sx={{ mr: 1 }}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton color="error" onClick={handleCancel}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Avatar section */}
          <Grid item xs={12} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={profile.avatar}
                alt={profile.fullName}
                sx={{ width: 200, height: 200, mb: 2 }}
              />
              {isEditing && (
                <Button variant="outlined" component="label">
                  Thay đổi ảnh
                  <input type="file" hidden accept="image/*" />
                </Button>
              )}
            </Box>
          </Grid>

          {/* Profile information */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={isEditing ? editedProfile.fullName : profile.fullName}
                  onChange={handleChange('fullName')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={isEditing ? editedProfile.email : profile.email}
                  onChange={handleChange('email')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={handleChange('phone')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  type="date"
                  value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
                  onChange={handleChange('dateOfBirth')}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!isEditing}>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    value={isEditing ? editedProfile.gender : profile.gender}
                    label="Giới tính"
                    onChange={handleChange('gender')}
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
                  value={isEditing ? editedProfile.bloodType : profile.bloodType}
                  onChange={handleChange('bloodType')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chiều cao (cm)"
                  value={isEditing ? editedProfile.height : profile.height}
                  onChange={handleChange('height')}
                  disabled={!isEditing}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cân nặng (kg)"
                  value={isEditing ? editedProfile.weight : profile.weight}
                  onChange={handleChange('weight')}
                  disabled={!isEditing}
                  type="number"
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bệnh mãn tính"
                  value={isEditing ? editedProfile.chronicDiseases : profile.chronicDiseases}
                  onChange={handleChange('chronicDiseases')}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Liên hệ khẩn cấp"
                  value={isEditing ? editedProfile.emergencyContact : profile.emergencyContact}
                  onChange={handleChange('emergencyContact')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  value={isEditing ? editedProfile.address : profile.address}
                  onChange={handleChange('address')}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange('newPassword')}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Hủy</Button>
          <Button onClick={handleChangePassword} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 