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
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    id: 1,
    avatar: 'https://example.com/avatar.jpg',
    fullName: 'Dr. John Doe',
    email: 'john.doe@example.com',
    phone: '0123456789',
    specialization: 'Nội khoa',
    degree: 'Tiến sĩ Y khoa',
    experience: '10 năm',
    certificates: 'Chứng chỉ hành nghề số 123456',
    biography: 'Tốt nghiệp Đại học Y Hà Nội, có nhiều năm kinh nghiệm trong lĩnh vực Nội khoa...',
    address: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    // TODO: Fetch doctor profile from API
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
                  label="Chuyên khoa"
                  value={isEditing ? editedProfile.specialization : profile.specialization}
                  onChange={handleChange('specialization')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Học vị"
                  value={isEditing ? editedProfile.degree : profile.degree}
                  onChange={handleChange('degree')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Kinh nghiệm"
                  value={isEditing ? editedProfile.experience : profile.experience}
                  onChange={handleChange('experience')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chứng chỉ"
                  value={isEditing ? editedProfile.certificates : profile.certificates}
                  onChange={handleChange('certificates')}
                  disabled={!isEditing}
                  multiline
                  rows={2}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tiểu sử"
                  value={isEditing ? editedProfile.biography : profile.biography}
                  onChange={handleChange('biography')}
                  disabled={!isEditing}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 