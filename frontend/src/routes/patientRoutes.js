import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/patient/Dashboard';
import PatientAppointments from '../pages/patient/PatientAppointments';
import MedicalHistory from '../pages/patient/MedicalHistory';
import Profile from '../pages/patient/Profile';

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/appointments" element={<PatientAppointments />} />
      <Route path="/medical-history" element={<MedicalHistory />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default PatientRoutes;