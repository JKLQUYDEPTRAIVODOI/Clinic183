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
  Divider
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import doctorService from '../../services/doctorService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    specialization: '',
    experience_years: '',
    bio: '',
    created_at: null
  });
  const [editedProfile, setEditedProfile] = useState(profile);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await doctorService.getMyProfile();
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setAlert({
        open: true,
        message: 'Không thể tải thông tin cá nhân',
        severity: 'error'
      });
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
      await doctorService.updateMyProfile({
        specialization: editedProfile.specialization,
        experience_years: editedProfile.experience_years,
        bio: editedProfile.bio
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
                  value={isEditing ? editedProfile.name : profile.name}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={isEditing ? editedProfile.email : profile.email}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày tham gia"
                  value={profile.created_at ? format(new Date(profile.created_at), 'dd/MM/yyyy', { locale: vi }) : ''}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Thông tin chuyên môn
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chuyên khoa"
                  value={isEditing ? editedProfile.specialization : profile.specialization}
                  onChange={handleChange('specialization')}
                  disabled={!isEditing}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số năm kinh nghiệm"
                  type="number"
                  value={isEditing ? editedProfile.experience_years : profile.experience_years}
                  onChange={handleChange('experience_years')}
                  disabled={!isEditing}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tiểu sử"
                  value={isEditing ? editedProfile.bio : profile.bio}
                  onChange={handleChange('bio')}
                  disabled={!isEditing}
                  multiline
                  rows={4}
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

export default Profile; 