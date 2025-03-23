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

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Hồ sơ', icon: <PersonIcon />, path: '/admin/profile' },
    { text: 'Quản lý bác sĩ', icon: <LocalHospitalIcon />, path: '/admin/doctors' },
    { text: 'Quản lý bệnh nhân', icon: <PeopleIcon />, path: '/admin/patients' },
    { text: 'Quản lý lịch hẹn', icon: <EventNoteIcon />, path: '/admin/appointments' },
    { text: 'Quản lý dịch vụ', icon: <MedicalServicesIcon />, path: '/admin/services' },
    { text: 'Quản lý thuốc', icon: <MedicationIcon />, path: '/admin/medicines' },
    { text: 'Báo cáo & Thống kê', icon: <AssessmentIcon />, path: '/admin/reports' },
    { text: 'Quản lý nhân viên', icon: <PeopleIcon />, path: '/admin/staff' },
    { text: 'Cài đặt', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const doctorMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor' },
    { text: 'Hồ sơ', icon: <PersonIcon />, path: '/doctor/profile' },
    { text: 'Lịch hẹn', icon: <EventNoteIcon />, path: '/doctor/appointments' },
    { text: 'Hồ sơ bệnh nhân', icon: <AssignmentIcon />, path: '/doctor/patients' },
    { text: 'Kê đơn thuốc', icon: <ReceiptIcon />, path: '/doctor/prescriptions' },
    { text: 'Lịch làm việc', icon: <ScheduleIcon />, path: '/doctor/schedule' },
  ];

  const patientMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/patient' },
    { text: 'Hồ sơ', icon: <PersonIcon />, path: '/patient/profile' },
    { text: 'Lịch hẹn', icon: <EventNoteIcon />, path: '/patient/appointments' },
    { text: 'Lịch sử khám bệnh', icon: <AssignmentIcon />, path: '/patient/medical-history' },
    { text: 'Đơn thuốc', icon: <ReceiptIcon />, path: '/patient/prescriptions' },
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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8, // Height of navbar
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {getMenuItems().map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
              {item.text === 'Dashboard' && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 