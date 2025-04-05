import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CardContent,
  Alert,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import appointmentService from '../../services/appointmentService';

const TrackAppointment = () => {
  const navigate = useNavigate();
  const [trackingCode, setTrackingCode] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setError('Vui lòng nhập mã theo dõi');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await appointmentService.getAppointmentByTracking(trackingCode);
      if (response.success) {
        setAppointment(response.data);
      } else {
        setError('Không tìm thấy lịch hẹn với mã theo dõi này');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tra cứu lịch hẹn');
      setAppointment(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'accepted':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Đã hoàn thành';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center', // Căn giữa theo chiều ngang
        alignItems: 'center',     // Căn giữa theo chiều dọc
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Phần Form (bên trái) */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                width: '100%',
                maxWidth: '500px', // Giới hạn chiều rộng form
                mx: 'auto', // Căn giữa form trong Grid item
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: '#1976d2',
                    }}
                  >
                    Tra Cứu Lịch Hẹn
                  </Typography>
                  <Typography color="text.secondary">
                    Nhập mã theo dõi để xem thông tin và trạng thái lịch hẹn
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Mã theo dõi"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      error={!!error}
                      helperText={error}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      mb: appointment ? 3 : 0,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/')}
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      VỀ TRANG CHỦ
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'TRA CỨU'}
                    </Button>
                  </Box>
                </form>

                {appointment && (
                  <Box sx={{ mt: 3 }}>
                    <Alert
                      severity={getStatusColor(appointment.status)}
                      sx={{ mb: 2, borderRadius: 2 }}
                    >
                      Trạng thái: {getStatusText(appointment.status)}
                    </Alert>

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: '#1976d2',
                        mb: 2,
                      }}
                    >
                      Thông tin lịch hẹn:
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      <Typography>
                        <strong>Họ tên:</strong> {appointment.guest_name}
                      </Typography>
                      <Typography>
                        <strong>Số điện thoại:</strong> {appointment.guest_phone}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {appointment.guest_email || 'Không có'}
                      </Typography>
                      <Typography>
                        <strong>Chuyên khoa:</strong> {appointment.department}
                      </Typography>
                      <Typography>
                        <strong>Ngày khám mong muốn:</strong> {appointment.preferred_date}
                      </Typography>
                      <Typography>
                        <strong>Giờ khám mong muốn:</strong> {appointment.preferred_time}
                      </Typography>
                      <Typography>
                        <strong>Triệu chứng:</strong> {appointment.symptoms}
                      </Typography>
                      {appointment.doctor_name && (
                        <Typography>
                          <strong>Bác sĩ phụ trách:</strong> {appointment.doctor_name}
                        </Typography>
                      )}
                      {appointment.appointment_date && (
                        <>
                          <Typography>
                            <strong>Ngày hẹn:</strong> {appointment.appointment_date}
                          </Typography>
                          <Typography>
                            <strong>Giờ hẹn:</strong> {appointment.appointment_time}
                          </Typography>
                        </>
                      )}
                      {appointment.note && (
                        <Typography>
                          <strong>Ghi chú:</strong> {appointment.note}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Paper>
          </Grid>

          {/* Phần Hình ảnh (bên phải) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <img
                src="/images/hero-image.jpg" // Thay bằng URL hình ảnh của bạn
                alt="Hình ảnh minh họa"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TrackAppointment;