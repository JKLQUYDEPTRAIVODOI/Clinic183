import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import doctorService from '../../services/doctorService';

const DoctorAppointmentsNew = () => {
  // State for appointments list and loading
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for detail dialog
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    appointment: null
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all',
    month: '',
    year: '',
    patientName: ''
  });

  // Fetch appointments data
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorService.getMyAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Không thể tải danh sách lịch hẹn');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      await doctorService.updateAppointmentStatus(id, newStatus);
      await fetchAppointments(); // Refresh list after update
      setDetailDialog({ ...detailDialog, open: false }); // Close dialog after update
    } catch (err) {
      setError('Không thể cập nhật trạng thái lịch hẹn');
      console.error('Error updating appointment status:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (appointment) => {
    if (appointment.guest_name) {
      return `${appointment.guest_name} (Khách)`;
    }
    return appointment.patient_name || 'N/A';
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    let matchesFilters = true;

    // Filter by status
    if (filters.status !== 'all' && appointment.status !== filters.status) {
      matchesFilters = false;
    }
    
    // Filter by month and year
    if (matchesFilters && filters.month && filters.year) {
      const appointmentDate = new Date(appointment.appointment_date);
      const appointmentMonth = appointmentDate.getMonth() + 1;
      const appointmentYear = appointmentDate.getFullYear();
      
      if (appointmentMonth !== parseInt(filters.month) || appointmentYear !== parseInt(filters.year)) {
        matchesFilters = false;
      }
    }

    // Filter by patient name
    if (matchesFilters && filters.patientName) {
      const patientName = getPatientName(appointment).toLowerCase();
      if (!patientName.includes(filters.patientName.toLowerCase())) {
        matchesFilters = false;
      }
    }
    
    return matchesFilters;
  });

  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // Sort by date first
    const dateCompare = new Date(a.appointment_date) - new Date(b.appointment_date);
    if (dateCompare !== 0) return dateCompare;
    
    // If same date, sort by time
    return a.appointment_time.localeCompare(b.appointment_time);
  });

  // Status utilities
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'accepted':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
  };

  const getAppointmentDate = (appointment) => {
    if (appointment.tracking_code) {
      return appointment.preferred_date ? formatDate(appointment.preferred_date) : 'Chưa xác định';
    }
    return formatDate(appointment.appointment_date);
  };

  const getAppointmentTime = (appointment) => {
    if (appointment.tracking_code) {
      return appointment.preferred_time || 'Chưa xác định';
    }
    return appointment.appointment_time;
  };

  const getAppointmentReason = (appointment) => {
    if (appointment.tracking_code) {
      return appointment.symptoms || 'N/A';
    }
    return appointment.reason || 'N/A';
  };

  // Render loading state
  if (loading && appointments.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Quản lý Lịch hẹn
            </Typography>
            <Box>
              <Tooltip title="Làm mới">
                <IconButton onClick={fetchAppointments} sx={{ mr: 1 }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box display="flex" gap={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Tháng</InputLabel>
                <Select
                  value={filters.month}
                  label="Tháng"
                  onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <MenuItem key={month} value={month}>
                      Tháng {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Năm</InputLabel>
                <Select
                  value={filters.year}
                  label="Năm"
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Tìm kiếm bệnh nhân"
                value={filters.patientName}
                onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
                sx={{ minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  label="Trạng thái"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="pending">Chờ xác nhận</MenuItem>
                  <MenuItem value="accepted">Đã xác nhận</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>

        {/* Error message */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Appointments table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Giờ</TableCell>
                  <TableCell>Lý do khám</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có lịch hẹn nào
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {getPatientName(appointment)}
                        {appointment.tracking_code && (
                          <Chip
                            size="small"
                            label={`Mã: ${appointment.tracking_code}`}
                            sx={{ ml: 1 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{getAppointmentDate(appointment)}</TableCell>
                      <TableCell>{getAppointmentTime(appointment)}</TableCell>
                      <TableCell>{getAppointmentReason(appointment)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(appointment.status)}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setDetailDialog({
                            open: true,
                            appointment
                          })}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, appointment: null })}
        maxWidth="sm"
        fullWidth
      >
        {detailDialog.appointment && (
          <>
            <DialogTitle>
              Chi tiết Lịch hẹn
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Bệnh nhân</Typography>
                    <Typography>
                      {getPatientName(detailDialog.appointment)}
                      {detailDialog.appointment.tracking_code && (
                        <Chip
                          size="small"
                          label={`Mã: ${detailDialog.appointment.tracking_code}`}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                  </Grid>
                  {detailDialog.appointment.tracking_code && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">Số điện thoại</Typography>
                        <Typography>{detailDialog.appointment.guest_phone || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography>{detailDialog.appointment.guest_email || 'N/A'}</Typography>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Ngày</Typography>
                    <Typography>
                      {getAppointmentDate(detailDialog.appointment)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Giờ</Typography>
                    <Typography>{getAppointmentTime(detailDialog.appointment)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">
                      {detailDialog.appointment.tracking_code ? 'Triệu chứng' : 'Lý do khám'}
                    </Typography>
                    <Typography>{getAppointmentReason(detailDialog.appointment)}</Typography>
                  </Grid>
                  {detailDialog.appointment.tracking_code && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Khoa/Chuyên khoa</Typography>
                      <Typography>{detailDialog.appointment.department || 'N/A'}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Trạng thái</Typography>
                    <Chip
                      label={getStatusLabel(detailDialog.appointment.status)}
                      color={getStatusColor(detailDialog.appointment.status)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              {detailDialog.appointment.status === 'pending' && (
                <>
                  <Button
                    onClick={() => handleStatusChange(detailDialog.appointment.id, 'accepted')}
                    variant="contained"
                    color="primary"
                  >
                    Xác nhận
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(detailDialog.appointment.id, 'cancelled')}
                    variant="contained"
                    color="error"
                  >
                    Từ chối
                  </Button>
                </>
              )}
              {detailDialog.appointment.status === 'accepted' && (
                <Button
                  onClick={() => handleStatusChange(detailDialog.appointment.id, 'completed')}
                  variant="contained"
                  color="success"
                >
                  Hoàn thành
                </Button>
              )}
              <Button
                onClick={() => setDetailDialog({ open: false, appointment: null })}
              >
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DoctorAppointmentsNew;
