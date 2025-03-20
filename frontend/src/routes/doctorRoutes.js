import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/doctor/Dashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';
import PatientRecords from '../pages/doctor/PatientRecords';

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/appointments" element={<DoctorAppointments />} />
      <Route path="/patient-records" element={<PatientRecords />} />
    </Routes>
  );
};

export default DoctorRoutes; 