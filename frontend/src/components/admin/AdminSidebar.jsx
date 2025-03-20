import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Person as PatientIcon,
  Event as AppointmentIcon,
  Receipt as InvoiceIcon,
  MedicalServices as DiagnosesIcon
} from '@mui/icons-material';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Doctors', icon: <DoctorIcon />, path: '/admin/doctors' },
    { text: 'Patients', icon: <PatientIcon />, path: '/admin/patients' },
    { text: 'Appointments', icon: <AppointmentIcon />, path: '/admin/appointments' },
    { text: 'Invoices', icon: <InvoiceIcon />, path: '/admin/invoices' },
    { text: 'Diagnoses', icon: <DiagnosesIcon />, path: '/admin/diagnoses' }
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

export default AdminSidebar;