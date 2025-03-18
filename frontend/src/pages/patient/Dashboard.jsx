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
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  LocalHospital as HospitalIcon,
  Receipt as ReceiptIcon,
  MedicalServices as MedicalIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    totalPrescriptions: 0,
    pendingBills: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('patient')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Implement API calls
      // Using mock data for now
      setStats({
        totalAppointments: 15,
        upcomingAppointments: 2,
        totalPrescriptions: 8,
        pendingBills: 1,
      });

      setAppointments([
        {
          id: 1,
          doctorName: 'Dr. John Doe',
          specialization: 'Nội khoa',
          date: '2024-03-25',
          time: '09:00',
          status: 'confirmed',
        },
        {
          id: 2,
          doctorName: 'Dr. Jane Smith',
          specialization: 'Tim mạch',
          date: '2024-03-28',
          time: '14:30',
          status: 'pending',
        },
      ]);

      setPrescriptions([
        {
          id: 1,
          doctorName: 'Dr. John Doe',
          date: '2024-03-20',
          diagnosis: 'Viêm họng',
          status: 'active',
        },
        {
          id: 2,
          doctorName: 'Dr. Jane Smith',
          date: '2024-03-15',
          diagnosis: 'Đau đầu',
          status: 'completed',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'active':
        return 'info';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const quickActions = [
    {
      title: 'Đặt lịch khám',
      icon: <EventIcon fontSize="large" />,
      path: '/patient/appointments/new',
      color: 'primary.main',
    },
    {
      title: 'Xem lịch sử khám',
      icon: <HospitalIcon fontSize="large" />,
      path: '/patient/medical-history',
      color: 'success.main',
    },
    {
      title: 'Xem đơn thuốc',
      icon: <MedicalIcon fontSize="large" />,
      path: '/patient/prescriptions',
      color: 'info.main',
    },
    {
      title: 'Thanh toán',
      icon: <ReceiptIcon fontSize="large" />,
      path: '/patient/bills',
      color: 'warning.main',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome message */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                Xin chào, [Tên bệnh nhân]
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Chúc bạn một ngày tốt lành!
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng lịch hẹn
                  </Typography>
                  <Typography variant="h5">{stats.totalAppointments}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Lịch hẹn sắp tới
                  </Typography>
                  <Typography variant="h5">{stats.upcomingAppointments}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <MedicalIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Đơn thuốc
                  </Typography>
                  <Typography variant="h5">{stats.totalPrescriptions}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <ReceiptIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Hóa đơn chờ
                  </Typography>
                  <Typography variant="h5">{stats.pendingBills}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Thao tác nhanh
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 },
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      textAlign="center"
                    >
                      <Avatar sx={{ bgcolor: action.color, width: 56, height: 56, mb: 2 }}>
                        {action.icon}
                      </Avatar>
                      <Typography variant="h6">{action.title}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lịch hẹn sắp tới
            </Typography>
            <List>
              {appointments.map((appointment) => (
                <React.Fragment key={appointment.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={appointment.doctorName}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="textPrimary">
                            {`${appointment.date} ${appointment.time}`}
                          </Typography>
                          {` - ${appointment.specialization}`}
                        </React.Fragment>
                      }
                    />
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box mt={2} display="flex" justifyContent="flex-end">
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

        {/* Recent Prescriptions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Đơn thuốc gần đây
            </Typography>
            <List>
              {prescriptions.map((prescription) => (
                <React.Fragment key={prescription.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <MedicalIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={prescription.doctorName}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="textPrimary">
                            {prescription.date}
                          </Typography>
                          {` - ${prescription.diagnosis}`}
                        </React.Fragment>
                      }
                    />
                    <Chip
                      label={prescription.status}
                      color={getStatusColor(prescription.status)}
                      size="small"
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/patient/prescriptions')}
              >
                Xem tất cả
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 