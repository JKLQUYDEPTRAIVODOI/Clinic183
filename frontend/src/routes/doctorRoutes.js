import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/doctor/Dashboard';
import DoctorAppointmentsNew from '../pages/doctor/DoctorAppointmentsNew';
import PatientRecords from '../pages/doctor/PatientRecords';

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/appointments" element={<DoctorAppointmentsNew />} />
      <Route path="/patient-records" element={<PatientRecords />} />
    </Routes>
  );
};

export default DoctorRoutes; 