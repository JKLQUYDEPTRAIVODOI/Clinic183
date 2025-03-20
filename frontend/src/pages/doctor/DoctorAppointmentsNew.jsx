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
import patientService from '../../services/patientService';

const DoctorAppointmentsNew = () => {
  // State for appointments list and loading
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for patients data
  const [patients, setPatients] = useState([]);
  
  // State for detail dialog
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    appointment: null
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all',
    date: '' // Không set ngày mặc định
  });

  // Fetch appointments and patients data
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
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

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
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

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by status
    if (filters.status !== 'all' && appointment.status !== filters.status) {
      return false;
    }
    
    // Filter by date only if date is selected
    if (filters.date && filters.date.trim() !== '') {
      return appointment.appointment_date === filters.date;
    }
    
    // If no date filter, show all appointments
    return true;
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
              <TextField
                type="date"
                size="small"
                label="Ngày"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
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
                        {patients.find(p => p.id === appointment.patient_id)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
                      <TableCell>{appointment.appointment_time}</TableCell>
                      <TableCell>{appointment.reason}</TableCell>
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
                      {patients.find(p => p.id === detailDialog.appointment.patient_id)?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Ngày</Typography>
                    <Typography>
                      {formatDate(detailDialog.appointment.appointment_date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Giờ</Typography>
                    <Typography>{detailDialog.appointment.appointment_time}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Lý do khám</Typography>
                    <Typography>{detailDialog.appointment.reason}</Typography>
                  </Grid>
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