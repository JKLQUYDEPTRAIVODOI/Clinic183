import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  Today as TodayIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import statisticsService from '../../services/statisticsService';
import { format } from 'date-fns';

const formatDate = (date) => {
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch (error) {
    return 'N/A';
  }
};

const formatTime = (time) => {
  try {
    if (time.includes('T')) {
      return format(new Date(time), 'HH:mm');
    }
    return time;
  } catch (error) {
    return 'N/A';
  }
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    recentAppointments: []
  });

  useEffect(() => {
    if (!hasRole('doctor')) {
      navigate('/login');
      return;
    }
    fetchDashboardStats();
  }, [hasRole, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getDoctorDashboardStats();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Không thể tải thông tin thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Bác sĩ
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng số bệnh nhân
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalPatients}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EventIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng số lịch hẹn
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalAppointments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TodayIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Lịch hẹn hôm nay
                  </Typography>
                  <Typography variant="h5">
                    {stats.todayAppointments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Lịch hẹn chờ xác nhận
                  </Typography>
                  <Typography variant="h5">
                    {stats.pendingAppointments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Appointments Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              Lịch hẹn gần đây
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bệnh nhân</TableCell>
                    <TableCell>Ngày khám</TableCell>
                    <TableCell>Giờ khám</TableCell>
                    <TableCell>Lý do khám</TableCell>
                    <TableCell>Chẩn đoán</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
                      <TableCell>{formatTime(appointment.appointmentTime)}</TableCell>
                      <TableCell>{appointment.reason || 'N/A'}</TableCell>
                      <TableCell>{appointment.diagnosis || 'Chưa có'}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: appointment.status === 'completed' ? 'success.main' :
                                  appointment.status === 'pending' ? 'warning.main' :
                                  'error.main'
                          }}
                        >
                          {appointment.status === 'completed' ? 'Đã hoàn thành' :
                           appointment.status === 'pending' ? 'Chờ xác nhận' :
                           'Đã hủy'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/doctor/appointments/${appointment.id}`)}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {stats.recentAppointments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Không có lịch hẹn nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard; 