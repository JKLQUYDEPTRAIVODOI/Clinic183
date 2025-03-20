import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as AppointmentIcon,
  History as MedicalHistoryIcon,
  Person as ProfileIcon
} from '@mui/icons-material';

const PatientSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/patient' },
    { text: 'Appointments', icon: <AppointmentIcon />, path: '/patient/appointments' },
    { text: 'Medical History', icon: <MedicalHistoryIcon />, path: '/patient/medical-history' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/patient/profile' }
  ];

  return (
    <Box sx={{ width: 240, bgcolor: 'background.paper' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PatientSidebar; 