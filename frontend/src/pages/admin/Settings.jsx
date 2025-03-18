import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [settings, setSettings] = useState({
    clinicName: '',
    address: '',
    phone: '',
    email: '',
    workingHours: {
      start: '08:00',
      end: '17:00',
    },
    appointmentDuration: 30,
    maxAppointmentsPerDay: 50,
    notifyAppointments: true,
    notifyPrescriptions: true,
    notifyPayments: true,
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    maintenanceMode: false,
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
    // TODO: Fetch settings from API
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = {
        clinicName: 'Phòng khám ABC',
        address: 'Số 123 Đường XYZ, Quận 1, TP.HCM',
        phone: '028.1234.5678',
        email: 'contact@phongkhamabc.com',
        workingHours: {
          start: '08:00',
          end: '17:00',
        },
        appointmentDuration: 30,
        maxAppointmentsPerDay: 50,
        notifyAppointments: true,
        notifyPrescriptions: true,
        notifyPayments: true,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        maintenanceMode: false,
      };
      setSettings(mockData);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showSnackbar('Lỗi khi tải cài đặt', 'error');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSettings(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleWorkingHoursChange = (event) => {
    const { name, value } = event.target;
    setSettings(prevState => ({
      ...prevState,
      workingHours: {
        ...prevState.workingHours,
        [name]: value,
      },
    }));
  };

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setSettings(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save settings
      console.log('Saving settings:', settings);
      showSnackbar('Lưu cài đặt thành công');
    } catch (error) {
      console.error('Error saving settings:', error);
      showSnackbar('Lỗi khi lưu cài đặt', 'error');
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
            Cài đặt hệ thống
          </Typography>
        </Grid>

        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin chung
            </Typography>
            <Box component="form" noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên phòng khám"
                    name="clinicName"
                    value={settings.clinicName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Working Hours & Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Giờ làm việc & Lịch hẹn
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Giờ mở cửa"
                    name="start"
                    type="time"
                    value={settings.workingHours.start}
                    onChange={handleWorkingHoursChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Giờ đóng cửa"
                    name="end"
                    type="time"
                    value={settings.workingHours.end}
                    onChange={handleWorkingHoursChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Thời gian mỗi lịch hẹn (phút)"
                    name="appointmentDuration"
                    type="number"
                    value={settings.appointmentDuration}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số lịch hẹn tối đa/ngày"
                    name="maxAppointmentsPerDay"
                    type="number"
                    value={settings.maxAppointmentsPerDay}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông báo
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Thông báo lịch hẹn" />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    name="notifyAppointments"
                    checked={settings.notifyAppointments}
                    onChange={handleSwitchChange}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Thông báo đơn thuốc" />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    name="notifyPrescriptions"
                    checked={settings.notifyPrescriptions}
                    onChange={handleSwitchChange}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Thông báo thanh toán" />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    name="notifyPayments"
                    checked={settings.notifyPayments}
                    onChange={handleSwitchChange}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cài đặt hệ thống
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Ngôn ngữ</InputLabel>
                    <Select
                      name="language"
                      value={settings.language}
                      onChange={handleInputChange}
                      label="Ngôn ngữ"
                    >
                      <MenuItem value="vi">Tiếng Việt</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Múi giờ</InputLabel>
                    <Select
                      name="timezone"
                      value={settings.timezone}
                      onChange={handleInputChange}
                      label="Múi giờ"
                    >
                      <MenuItem value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</MenuItem>
                      <MenuItem value="Asia/Bangkok">Bangkok (GMT+7)</MenuItem>
                      <MenuItem value="Asia/Singapore">Singapore (GMT+8)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleSwitchChange}
                      />
                    }
                    label="Chế độ bảo trì"
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Lưu cài đặt
            </Button>
          </Box>
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

export default Settings; 