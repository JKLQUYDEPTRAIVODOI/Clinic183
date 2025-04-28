import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import DoctorManagement from '../pages/admin/DoctorManagement';
import PatientManagement from '../pages/admin/PatientManagement';
import AppointmentManagement from '../pages/admin/AppointmentManagement';
import InvoiceManagement from '../pages/admin/InvoiceManagement';
import DiagnosesManagement from '../pages/admin/DiagnosesManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/doctors" element={<DoctorManagement />} />
      <Route path="/patients" element={<PatientManagement />} />
      <Route path="/appointments" element={<AppointmentManagement />} />
      <Route path="/invoices" element={<InvoiceManagement />} />
      <Route path="/diagnoses" element={<DiagnosesManagement />} />
    </Routes>
  );
};

export default AdminRoutes; 