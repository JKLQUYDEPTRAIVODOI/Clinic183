// App.jsx
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Button from './components/UI/Button';
import NotFound from './pages/NotFound';
// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import PatientManagement from './pages/admin/PatientManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import MedicalServicesManagement from './pages/admin/MedicalServicesManagement';
import MedicineManagement from './pages/admin/MedicineManagement';
import ReportsAndStatistics from './pages/admin/ReportsAndStatistics';
import AdminProfile from './pages/admin/Profile';
import StaffManagement from './pages/admin/StaffManagement';
import Settings from './pages/admin/Settings';
import DiagnosisManagement from './pages/admin/DiagnosesManagement';
import User from './pages/admin/UserManagement';
import MedicalRecords from './pages/admin/MedicalRecordsManagement';
import InvoiceManagement from './pages/admin/InvoiceManagement';
import RevenueManagement from './pages/admin/RevenueManagement';
import ServiceManagement from './pages/admin/ServiceManagement';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorProfile from './pages/doctor/Profile';
import DoctorAppointmentsNew from './pages/doctor/DoctorAppointmentsNew';
import PatientRecords from './pages/doctor/PatientRecords';
import DoctorPrescriptions from './pages/doctor/Prescriptions';
import Schedule from './pages/doctor/Schedule';
import DoctorPatientProfile from './pages/doctor/PatientProfile';
import AppointmentDetails from './pages/doctor/AppointmentDetails';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientProfile from './pages/patient/Profile';
import PatientAppointments from './pages/patient/Appointments';
import MedicalHistory from './pages/patient/MedicalHistory';
import PatientPrescriptions from './pages/patient/Prescriptions';
import Invoices from './pages/patient/Invoices';

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <div className="mt-2">Đang tải...</div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

// Simple home dashboard that redirects based on user role
const HomeDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'patient':
          navigate('/patient');
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Chào mừng đến với Clinic HMS</h1>
      <p className="text-lg text-gray-600 mb-8">
        Hệ thống quản lý phòng khám hiện đại
      </p>
      
      {!isAuthenticated && (
        <div className="space-x-4">
          <Button 
            variant="primary" 
            className="px-6 py-2"
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </Button>
          <Button 
            variant="outline" 
            className="px-6 py-2"
            onClick={() => navigate('/register')}
          >
            Đăng ký
          </Button>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><HomeDashboard /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Routes */}
      {/* Admin Routes */}
      <Route element={<Layout><ProtectedRoute allowedRoles={['admin']} /></Layout>}>
        <Route path="/admin">
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="patients" element={<PatientManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="medicines" element={<MedicineManagement />} />
          <Route path="reports" element={<ReportsAndStatistics />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="diagnoses" element={<DiagnosisManagement />} />
          <Route path="users" element={<User />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="invoices" element={<InvoiceManagement />} />
          <Route path="revenue" element={<RevenueManagement />} />
        </Route>
      </Route>

      {/* Doctor Routes */}
      <Route element={<Layout><ProtectedRoute allowedRoles={['doctor']} /></Layout>}>
        <Route path="/doctor">
          <Route index element={<DoctorDashboard />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="appointments" element={<DoctorAppointmentsNew />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />
          <Route path="patients" element={<PatientRecords />} />
          <Route path="prescriptions" element={<DoctorPrescriptions />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="patients/:id" element={<DoctorPatientProfile />} />
        </Route>
      </Route>

      {/* Patient Routes */}
      <Route element={<Layout><ProtectedRoute allowedRoles={['patient']} /></Layout>}>
        <Route path="/patient">
          <Route index element={<PatientDashboard />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="appointments/new" element={<PatientAppointments />} />
          <Route path="medical-history" element={<MedicalHistory />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
          <Route path="invoices" element={<Invoices />} />
        </Route>
      </Route>

      {/* Catch all route - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;