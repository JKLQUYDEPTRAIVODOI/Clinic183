import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  LocalHospital as HospitalIcon,
  Receipt as ReceiptIcon,
  MedicalServices as MedicalIcon,
  CalendarMonth as CalendarIcon,
  Assignment as MedicalRecordIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import statisticsService from '../../services/statisticsService';
import appointmentService from '../../services/appointmentService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      height: '100%',
      backgroundColor: `${color}.lighter`,
      '&:hover': {
        boxShadow: 3,
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 2,
          backgroundColor: `${color}.light`,
          flexShrink: 0,
          '& > svg': {
            width: 24,
            height: 24,
            color: `${color}.main`,
          },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const ActionCard = ({ title, description, icon, path, color, onNavigate }) => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: `${color}.lighter`,
      '&:hover': {
        boxShadow: 3,
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 2,
          backgroundColor: `${color}.light`,
          flexShrink: 0,
          '& > svg': {
            width: 24,
            height: 24,
            color: `${color}.main`,
          },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ mt: 'auto' }}>
      <Button
        variant="contained"
        color={color}
        fullWidth
        onClick={() => onNavigate(path)}
      >
        Truy cập
      </Button>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    activePrescriptions: 0,
    pendingInvoices: 0
  });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('patient')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getPatientDashboardStats();
        setStats(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Không thể tải thông tin thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const data = await appointmentService.getPatientAppointments();
        // Lọc và sắp xếp các cuộc hẹn sắp tới
        const upcomingAppointments = data
          .filter(appointment => {
            const appointmentDate = new Date(appointment.appointment_date);
            return appointmentDate >= new Date();
          })
          .sort((a, b) => {
            const dateA = new Date(a.appointment_date + ' ' + a.appointment_time);
            const dateB = new Date(b.appointment_date + ' ' + b.appointment_time);
            return dateA - dateB;
          })
          .slice(0, 5); // Chỉ lấy 5 cuộc hẹn gần nhất
        
        setAppointments(upcomingAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Không thể tải lịch hẹn');
      }
    };

    fetchUpcomingAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Thống kê */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Tổng số lịch hẹn"
            value={stats.totalAppointments}
            icon={<EventIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Lịch hẹn sắp tới"
            value={stats.upcomingAppointments}
            icon={<CalendarIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Đơn thuốc đang dùng"
            value={stats.activePrescriptions}
            icon={<MedicalIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Hóa đơn chưa thanh toán"
            value={stats.pendingInvoices}
            icon={<ReceiptIcon />}
            color="warning"
          />
        </Grid>

        {/* Lịch hẹn sắp tới */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Lịch hẹn sắp tới
            </Typography>
            <List>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <HospitalIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.doctor_name}
                        secondary={`${format(new Date(appointment.appointment_date), 'dd/MM/yyyy')} - ${appointment.appointment_time} - ${appointment.specialization}`}
                      />
                      <Chip
                        label={getStatusText(appointment.status)}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Không có lịch hẹn sắp tới" />
                </ListItem>
              )}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/patient/appointments')}
              >
                Xem tất cả
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Truy cập nhanh */}
        <Grid item xs={12} md={4}>
          <ActionCard
            title="Đặt lịch khám"
            description="Đặt lịch khám với bác sĩ chuyên khoa"
            icon={<EventIcon />}
            path="/patient/appointments/new"
            color="primary"
            onNavigate={navigate}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard
            title="Lịch sử khám bệnh"
            description="Xem lịch sử khám bệnh và đơn thuốc"
            icon={<MedicalRecordIcon />}
            path="/patient/medical-history"
            color="info"
            onNavigate={navigate}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard
            title="Hồ sơ cá nhân"
            description="Cập nhật thông tin cá nhân"
            icon={<PersonIcon />}
            path="/patient/profile"
            color="success"
            onNavigate={navigate}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 