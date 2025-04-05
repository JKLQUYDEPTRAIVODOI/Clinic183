import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';
import appointmentService from '../../services/appointmentService';

const GuestAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    symptoms: '',
    preferredDate: format(new Date(), 'yyyy-MM-dd'),
    preferredTime: '09:00',
    specialization: '',
    doctor_id: ''
  });

  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (formData.specialization) {
      fetchDoctorsBySpecialization(formData.specialization);
    } else {
      setDoctors([]);
    }
  }, [formData.specialization]);

  const fetchSpecializations = async () => {
    try {
      const response = await appointmentService.getSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải danh sách chuyên khoa',
        severity: 'error'
      });
    }
  };

  const fetchDoctorsBySpecialization = async (specialization) => {
    try {
      const response = await appointmentService.getDoctorsBySpecialization(specialization);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải danh sách bác sĩ',
        severity: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Vui lòng nhập triệu chứng';
    }
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Vui lòng chọn ngày khám';
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Vui lòng chọn giờ khám';
    }
    
    if (!formData.specialization) {
      newErrors.specialization = 'Vui lòng chọn chuyên khoa';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const appointmentData = {
        guest_name: formData.name,
        guest_phone: formData.phone,
        guest_email: formData.email,
        symptoms: formData.symptoms,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        department: formData.specialization,
        doctor_id: formData.doctor_id || null
      };

      const response = await appointmentService.createGuestAppointment(appointmentData);
      
      if (response.data) {
        setTrackingCode(response.data.tracking_code);
        setSubmitSuccess(true);
        setSnackbar({
          open: true,
          message: 'Đặt lịch thành công! Vui lòng lưu mã theo dõi của bạn.',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Đặt Lịch Khám
        </Typography>
        <Typography color="text.secondary">
          Điền thông tin của bạn để đặt lịch khám. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {submitSuccess ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" gutterBottom>
                Đặt lịch thành công!
              </Typography>
              <Typography variant="body1" paragraph>
                Mã theo dõi của bạn là: <strong>{trackingCode}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Vui lòng lưu lại mã này để tra cứu lịch hẹn của bạn.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/track-appointment')}
                  sx={{ mr: 2 }}
                >
                  Tra cứu lịch hẹn
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      symptoms: '',
                      preferredDate: format(new Date(), 'yyyy-MM-dd'),
                      preferredTime: '09:00',
                      specialization: '',
                      doctor_id: ''
                    });
                  }}
                >
                  Đặt lịch mới
                </Button>
              </Box>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Triệu chứng/Lý do khám"
                    name="symptoms"
                    multiline
                    rows={4}
                    value={formData.symptoms}
                    onChange={handleChange}
                    error={!!errors.symptoms}
                    helperText={errors.symptoms}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày khám mong muốn"
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Giờ khám mong muốn"
                    type="time"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300 // 5 minutes
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Chuyên khoa"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    error={!!errors.specialization}
                    helperText={errors.specialization}
                    required
                  >
                    {specializations.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Bác sĩ"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    disabled={!formData.specialization}
                  >
                    <MenuItem value="">
                      <em>Chọn bác sĩ (không bắt buộc)</em>
                    </MenuItem>
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/')}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? 'Đang xử lý...' : 'Đặt lịch'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
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

export default GuestAppointment; 