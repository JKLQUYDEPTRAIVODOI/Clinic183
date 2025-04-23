import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import patientService from '../../services/patientService';
import { format } from 'date-fns';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState([]);
  const [patients, setPatients] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentTab, setCurrentTab] = useState(0); // 0 for regular, 1 for guest
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [searchPatientName, setSearchPatientName] = useState('');
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    status: 'pending',
    // Guest fields
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    symptoms: '',
    preferred_date: '',
    preferred_time: '',
    department: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetchDoctorsBySpecialization(formData.department);
    } else {
      setDoctorsBySpecialization([]);
    }
  }, [formData.department]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      // Ensure we're working with the local date
      const [year, month, day] = dateString.split('-');
      if (year && month && day) {
        return `${year}-${month}-${day}`;
      }
      const date = new Date(dateString);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() + userTimezoneOffset);
      return format(localDate, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return '';
    try {
      // If it's already in HH:mm format, return as is
      if (timeString.length === 5) return timeString;
      // If it's in HH:mm:ss format, remove seconds
      if (timeString.length === 8) return timeString.substring(0, 5);
      // If it's an ISO string, extract time part
      const time = new Date(timeString).toTimeString().substring(0, 5);
      return time === 'Invalid' ? '' : time;
    } catch (error) {
      console.error('Error formatting time:', error);
      return ''; // Return empty string on error
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAllAppointments();
      if (Array.isArray(response)) {
        setAppointments(response);
      } else {
        console.error('Invalid response format:', response);
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await appointmentService.getSpecializations();
      setSpecializations(response.data);
    } catch (err) {
      console.error('Error fetching specializations:', err);
      setError('Failed to fetch specializations');
    }
  };

  const fetchDoctorsBySpecialization = async (specialization) => {
    try {
      const response = await appointmentService.getDoctorsBySpecialization(specialization);
      setDoctorsBySpecialization(response.data);
    } catch (err) {
      console.error('Error fetching doctors by specialization:', err);
      setError('Failed to fetch doctors');
    }
  };

  const handleOpenDialog = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setCurrentTab(appointment.tracking_code ? 1 : 0);
      
      // Format the dates correctly for the form
      let appointmentDate = '';
      let preferredDate = '';

      // Format appointment date
      if (appointment.appointment_date) {
        try {
          const date = new Date(appointment.appointment_date);
          if (!isNaN(date.getTime())) {
            appointmentDate = format(date, 'yyyy-MM-dd');
          } else {
            appointmentDate = appointment.appointment_date;
          }
        } catch (error) {
          console.error('Error formatting appointment date:', error);
          appointmentDate = appointment.appointment_date;
        }
      }

      // Format preferred date
      if (appointment.preferred_date) {
        try {
          const date = new Date(appointment.preferred_date);
          if (!isNaN(date.getTime())) {
            preferredDate = format(date, 'yyyy-MM-dd');
          } else {
            preferredDate = appointment.preferred_date;
          }
        } catch (error) {
          console.error('Error formatting preferred date:', error);
          preferredDate = appointment.preferred_date;
        }
      }

      setFormData({
        patient_id: appointment.patient_id || '',
        doctor_id: appointment.doctor_id || '',
        appointment_date: appointmentDate,
        appointment_time: formatTimeForInput(appointment.appointment_time) || '',
        reason: appointment.reason || '',
        status: appointment.status || 'pending',
        guest_name: appointment.guest_name || '',
        guest_phone: appointment.guest_phone || '',
        guest_email: appointment.guest_email || '',
        symptoms: appointment.symptoms || '',
        preferred_date: preferredDate,
        preferred_time: formatTimeForInput(appointment.preferred_time) || '',
        department: appointment.department || ''
      });
    } else {
      setSelectedAppointment(null);
      setCurrentTab(0);
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        reason: '',
        status: 'pending',
        guest_name: '',
        guest_phone: '',
        guest_email: '',
        symptoms: '',
        preferred_date: '',
        preferred_time: '',
        department: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setCurrentTab(0);
    setFormData({
      patient_id: '',
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      status: 'pending',
      guest_name: '',
      guest_phone: '',
      guest_email: '',
      symptoms: '',
      preferred_date: '',
      preferred_time: '',
      department: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        appointment_date: formData.appointment_date || null,
        appointment_time: formData.appointment_time || null,
        preferred_date: formData.preferred_date || null,
        preferred_time: formData.preferred_time || null,
        patient_id: formData.patient_id || null,
        doctor_id: formData.doctor_id || null,
        status: formData.status || 'pending',
        reason: formData.reason || '',
        guest_name: formData.guest_name || '',
        guest_phone: formData.guest_phone || '',
        guest_email: formData.guest_email || '',
        symptoms: formData.symptoms || '',
        department: formData.department || ''
      };

      if (selectedAppointment) {
        if (selectedAppointment.status !== formData.status) {
          await appointmentService.updateAppointmentStatus(selectedAppointment.id, formData.status);
        }
        await appointmentService.updateAppointment(selectedAppointment.id, dataToSubmit);
        
        setAppointments(prevAppointments =>
          prevAppointments.map(apt =>
            apt.id === selectedAppointment.id
              ? { ...apt, ...dataToSubmit }
              : apt
          )
        );
      } else {
        const newAppointment = await appointmentService.createAppointment(dataToSubmit);
        setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
      }

      handleCloseDialog();
      await fetchAppointments();
      setError(null);
    } catch (error) {
      console.error('Error saving appointment:', error);
      setError('Không thể lưu lịch hẹn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(id);
        // Update local state immediately
        setAppointments(prevAppointments => 
          prevAppointments.filter(appointment => appointment.id !== id)
        );
        setError(null); // Clear any existing errors
      } catch (err) {
        setError('Failed to delete appointment');
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      await appointmentService.updateAppointmentStatus(id, newStatus);
      
      // Cập nhật state ngay lập tức
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === id
            ? { ...apt, status: newStatus }
            : apt
        )
      );
      
      setError(null);
    } catch (err) {
      setError('Không thể cập nhật trạng thái lịch hẹn');
      console.error('Error updating appointment status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDoctor = async (appointmentId, doctorId) => {
    try {
      await appointmentService.assignDoctorToGuest(appointmentId, doctorId);
      fetchAppointments();
    } catch (err) {
      setError('Failed to assign doctor');
      console.error('Error assigning doctor:', err);
    }
  };

  const handleConvertToRegular = async (appointmentId, patientId) => {
    try {
      await appointmentService.convertGuestToRegular(appointmentId, patientId);
      fetchAppointments();
    } catch (err) {
      setError('Failed to convert appointment');
      console.error('Error converting appointment:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'default';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'accepted':
        return 'Đã chấp nhận';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  const getPatientName = (appointment) => {
    if (appointment.guest_name) {
      return `${appointment.guest_name} (Khách)`;
    }
    return patients.find(p => p.id === appointment.patient_id)?.name || 'Unknown';
  };

  const getDoctorName = (appointment) => {
    if (appointment.doctor_name) {
      return appointment.doctor_name;
    }
    if (appointment.department) {
      return `Chờ phân công - ${appointment.department}`;
    }
    return 'Chưa phân công';
  };

  const getAppointmentDate = (appointment) => {
    try {
      let dateStr;
      if (appointment.tracking_code) {
        dateStr = appointment.preferred_date;
      } else {
        dateStr = appointment.appointment_date;
      }

      if (!dateStr) return 'Chưa xác định';

      // Parse the date string
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        // Format date as dd/MM/yyyy
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      // If date string is in YYYY-MM-DD format
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }

      return 'Chưa xác định';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Chưa xác định';
    }
  };

  const getAppointmentTime = (appointment) => {
    try {
      let timeStr;
      if (appointment.tracking_code) {
        timeStr = appointment.preferred_time;
      } else {
        timeStr = appointment.appointment_time;
      }

      if (!timeStr) return 'Chưa xác định';

      // If time includes seconds (HH:mm:ss), remove seconds
      if (timeStr.length === 8) {
        return timeStr.substring(0, 5);
      }

      // If time is already in HH:mm format
      if (timeStr.length === 5) {
        return timeStr;
      }

      // If time is in a different format, try to parse it
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }

      return timeStr;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Chưa xác định';
    }
  };

  const renderForm = () => {
    if (currentTab === 0) {
      return (
        <>
          <TextField
            select
            fullWidth
            margin="normal"
            name="patient_id"
            label="Bệnh nhân"
            value={formData.patient_id}
            onChange={handleInputChange}
            required
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            margin="normal"
            name="doctor_id"
            label="Bác sĩ"
            value={formData.doctor_id}
            onChange={handleInputChange}
            required
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            name="appointment_date"
            label="Ngày khám"
            type="date"
            value={formData.appointment_date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="appointment_time"
            label="Giờ khám"
            type="time"
            value={formData.appointment_time}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="reason"
            label="Lý do khám"
            multiline
            rows={3}
            value={formData.reason}
            onChange={handleInputChange}
            required
          />
        </>
      );
    } else {
      return (
        <>
          <TextField
            fullWidth
            margin="normal"
            name="guest_name"
            label="Tên khách"
            value={formData.guest_name}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="guest_phone"
            label="Số điện thoại"
            value={formData.guest_phone}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="guest_email"
            label="Email"
            type="email"
            value={formData.guest_email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="symptoms"
            label="Triệu chứng"
            multiline
            rows={3}
            value={formData.symptoms}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="preferred_date"
            label="Ngày mong muốn"
            type="date"
            value={formData.preferred_date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            name="preferred_time"
            label="Giờ mong muốn"
            type="time"
            value={formData.preferred_time}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            name="department"
            label="Khoa"
            value={formData.department}
            onChange={handleInputChange}
            required
          >
            {specializations.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </TextField>
        </>
      );
    }
  };

  // Thêm hàm mới để xử lý thay đổi trạng thái trong form
  const handleFormStatusChange = (e) => {
    const newStatus = e.target.value;
    setFormData(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  const filteredAppointments = appointments.filter(appointment => {
    // Filter by month and year
    if (filterMonth && filterYear) {
      const appointmentDate = new Date(appointment.appointment_date);
      const appointmentMonth = appointmentDate.getMonth() + 1;
      const appointmentYear = appointmentDate.getFullYear();
      
      if (appointmentMonth !== parseInt(filterMonth) || appointmentYear !== parseInt(filterYear)) {
        return false;
      }
    }

    // Filter by patient name
    if (searchPatientName) {
      const patientName = getPatientName(appointment).toLowerCase();
      return patientName.includes(searchPatientName.toLowerCase());
    }

    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lí lịch hẹn
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            label="Tháng"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <MenuItem key={month} value={month}>
                Tháng {month}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Năm"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Tìm kiếm bệnh nhân"
            value={searchPatientName}
            onChange={(e) => setSearchPatientName(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Tạo lịch hẹn mới
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell width="25%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Bệnh nhân/Khách hàng</TableCell>
              <TableCell width="20%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Bác sĩ</TableCell>
              <TableCell width="15%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Ngày</TableCell>
              <TableCell width="10%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Thời gian</TableCell>
              <TableCell width="15%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Trạng thái</TableCell>
              <TableCell width="15%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell width="25%">
                  {getPatientName(appointment)}
                  {appointment.tracking_code && (
                    <Chip
                      size="small"
                      label={`Code: ${appointment.tracking_code}`}
                      sx={{ ml: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell width="20%">{getDoctorName(appointment)}</TableCell>
                <TableCell width="15%">{getAppointmentDate(appointment)}</TableCell>
                <TableCell width="10%">{getAppointmentTime(appointment)}</TableCell>
                <TableCell width="15%">
                  <Chip
                    label={getStatusText(appointment.status)}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell width="15%">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(appointment)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Chỉnh sửa lịch hẹn' : 'Tạo lịch hẹn mới'}
        </DialogTitle>
        <DialogContent>
          {!selectedAppointment && (
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="Lịch hẹn thông thường" />
              <Tab label="Lịch hẹn khách vãng lai" />
            </Tabs>
          )}
          <form onSubmit={handleSubmit}>
            {renderForm()}
            {selectedAppointment && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Ngày đặt lịch"
                  value={formatDateForInput(selectedAppointment.appointment_date)}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  select
                  fullWidth
                  margin="normal"
                  name="status"
                  label="Trạng thái"
                  value={formData.status}
                  onChange={handleFormStatusChange}
                  required
                >
                  <MenuItem value="pending">Chờ xác nhận</MenuItem>
                  <MenuItem value="accepted">Đã chấp nhận</MenuItem>
                  <MenuItem value="completed">Đã hoàn thành</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                  <MenuItem value="rejected">Từ chối</MenuItem>
                </TextField>
              </>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentManagement; 