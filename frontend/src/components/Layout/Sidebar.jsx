import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  EventNote as EventNoteIcon,
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  MedicalServices as MedicalServicesIcon,
  Medication as MedicationIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import theme from '../../theme';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Quản lý người dùng', icon: <LocalHospitalIcon />, path: '/admin/users' },
    { text: 'Quản lý lịch hẹn', icon: <EventNoteIcon />, path: '/admin/appointments' },
    { text: 'Quản lý dịch vụ', icon: <MedicalServicesIcon />, path: '/admin/services' },
    { text: 'Quản lý thuốc', icon: <MedicationIcon />, path: '/admin/medicines' },
    { text: 'Quản lý hóa đơn', icon: <ReceiptIcon />, path: '/admin/invoices' },
    { text: 'Báo cáo & Thống kê', icon: <AssessmentIcon />, path: '/admin/revenue' },
  ];

  const doctorMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor' },
    { text: 'Hồ sơ', icon: <PersonIcon />, path: '/doctor/profile' },
    { text: 'Lịch hẹn', icon: <EventNoteIcon />, path: '/doctor/appointments' },
    { text: 'Hồ sơ bệnh nhân', icon: <AssignmentIcon />, path: '/doctor/patients' },
    { text: 'Kê đơn thuốc', icon: <ReceiptIcon />, path: '/doctor/prescriptions' },
  ];

  const patientMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/patient' },
    { text: 'Hồ sơ', icon: <PersonIcon />, path: '/patient/profile' },
    { text: 'Lịch hẹn', icon: <EventNoteIcon />, path: '/patient/appointments' },
    { text: 'Lịch sử khám bệnh', icon: <AssignmentIcon />, path: '/patient/medical-history' },
    { text: 'Hóa đơn', icon: <ReceiptIcon />, path: '/patient/invoices' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminMenuItems;
      case 'doctor':
        return doctorMenuItems;
      case 'patient':
        return patientMenuItems;
      default:
        return [];
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'doctor':
        return 'Bác sĩ';
      case 'patient':
        return 'Bệnh nhân';
      default:
        return role;
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8,
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', py: 2 }}>
        <Box sx={{ px: 2, mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            {getRoleText(user?.role)}
          </Typography>
        </Box>
        <List>
          {getMenuItems().map((item, index) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'inherit',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: 'text.secondary',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: location.pathname === item.path ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {index === 0 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 