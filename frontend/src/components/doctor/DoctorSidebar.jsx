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
  Description as PatientRecordIcon
} from '@mui/icons-material';

const DoctorSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor' },
    { text: 'Appointments', icon: <AppointmentIcon />, path: '/doctor/appointments' },
    { text: 'Patient Records', icon: <PatientRecordIcon />, path: '/doctor/patient-records' }
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

export default DoctorSidebar; 