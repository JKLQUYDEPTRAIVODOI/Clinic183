import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Person as PatientIcon,
  Event as AppointmentIcon,
  Medication as MedicineIcon,
  Receipt as RevenueIcon,
} from '@mui/icons-material';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import statisticsService from '../../services/statisticsService';

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

const ManagementCard = ({ title, description, icon, path, color, onNavigate }) => (
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

const AdminDashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalMedicines: 0,
    totalRevenue: 0
  });

  // Kiểm tra quyền
  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  // Lấy dữ liệu thống kê từ backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await statisticsService.getAdminDashboardStats();
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

  // Các mục quản lý
  const managementItems = [
    { 
      title: 'Quản lý người dùng', 
      description: 'Thêm, sửa, xóa và phân quyền tài khoản',
      icon: <PeopleIcon />,
      path: '/admin/users',
      color: 'primary'
    },
    { 
      title: 'Quản lý thuốc', 
      description: 'Thêm, sửa, xóa thuốc và xem đơn thuốc',
      icon: <MedicineIcon />,
      path: '/admin/medicines',
      color: 'success'
    },
    { 
      title: 'Quản lý lịch hẹn', 
      description: 'Xem và quản lý trạng thái lịch hẹn',
      icon: <AppointmentIcon />,
      path: '/admin/appointments',
      color: 'info'
    },
    { 
      title: 'Quản lý lịch sử khám bệnh', 
      description: 'Xem toàn bộ lịch sử khám bệnh của bệnh nhân',
      icon: <PatientIcon />,
      path: '/admin/medical-records',
      color: 'warning'
    },
    { 
      title: 'Quản lý chẩn đoán', 
      description: 'Xem và cập nhật chẩn đoán',
      icon: <DoctorIcon />,
      path: '/admin/diagnoses',
      color: 'error'
    },
    { 
      title: 'Quản lý dịch vụ', 
      description: 'Quản lý danh sách dịch vụ',
      icon: <DoctorIcon />,
      path: '/admin/services',
      color: 'secondary'
    },
    { 
      title: 'Quản lý hóa đơn', 
      description: 'Quản lý hóa đơn thanh toán của bệnh nhân',
      icon: <RevenueIcon />,
      path: '/admin/invoices',
      color: 'primary'
    },
    { 
      title: 'Thống kê doanh thu', 
      description: 'Thống kê tổng doanh thu từ các dịch vụ và hóa đơn',
      icon: <RevenueIcon />,
      path: '/admin/revenue',
      color: 'success'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Thống kê */}
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Thống kê tổng quan
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng số người dùng"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng số bác sĩ"
            value={stats.totalDoctors}
            icon={<DoctorIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng số bệnh nhân"
            value={stats.totalPatients}
            icon={<PatientIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng số lịch hẹn"
            value={stats.totalAppointments}
            icon={<AppointmentIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng số thuốc"
            value={stats.totalMedicines}
            icon={<MedicineIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng doanh thu"
            value={`${stats.totalRevenue.toLocaleString()} VNĐ`}
            icon={<RevenueIcon />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Các mục quản lý */}
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600 }}>
        Quản lý hệ thống
      </Typography>
      <Grid container spacing={3}>
        {managementItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ManagementCard {...item} onNavigate={navigate} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 