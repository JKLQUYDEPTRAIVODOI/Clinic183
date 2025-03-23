import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import appointmentService from '../../services/appointmentService';
import prescriptionService from '../../services/prescriptionService';
import { AccessTime, CalendarToday, Person, Notes } from '@mui/icons-material';

const formatDate = (date) => {
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch (error) {
    return 'N/A';
  }
};

const formatTime = (time) => {
  try {
    if (time.includes('T')) {
      return format(new Date(time), 'HH:mm');
    }
    return time;
  } catch (error) {
    return 'N/A';
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

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const appointmentData = await appointmentService.getAppointmentById(id);
      setAppointment(appointmentData);
      
      // Get diagnosis from medical record if it exists
      if (appointmentData.medical_record) {
        setDiagnosis(appointmentData.medical_record.diagnosis || '');
      }

      // Fetch prescription if appointment is completed
      if (appointmentData.status === 'completed') {
        try {
          const prescriptionData = await prescriptionService.getPrescriptionByAppointmentId(id);
          setPrescription(prescriptionData);
        } catch (error) {
          console.error('Error fetching prescription:', error);
        }
      }

      setError(null);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      setError('Không thể tải thông tin lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      await appointmentService.updateAppointmentStatus(id, newStatus);
      await fetchAppointmentDetails();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setError('Không thể cập nhật trạng thái lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiagnosis = async () => {
    try {
      setLoading(true);
      await appointmentService.updateAppointment(id, { diagnosis });
      await fetchAppointmentDetails();
      setUpdateDialog(false);
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      setError('Không thể cập nhật chẩn đoán');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Container>
    );
  }

  if (!appointment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>Không tìm thấy thông tin lịch hẹn</Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Chi tiết lịch hẹn
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          Quay lại
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(to right, #ffffff, #f8f9fa)'
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Thông tin bệnh nhân
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person color="primary" />
                    <Typography><strong>Tên:</strong> {appointment.patient_name}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday color="primary" />
                    <Typography><strong>Ngày khám:</strong> {formatDate(appointment.appointment_date)}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTime color="primary" />
                    <Typography><strong>Giờ khám:</strong> {formatTime(appointment.appointment_time)}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Notes color="primary" />
                    <Typography><strong>Lý do khám:</strong> {appointment.reason || 'Không có'}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Trạng thái lịch hẹn
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={getStatusLabel(appointment.status)}
                    color={getStatusColor(appointment.status)}
                    sx={{ 
                      fontSize: '1rem',
                      py: 2,
                      px: 1
                    }}
                  />
                </Box>
                <Box display="flex" gap={2}>
                  {appointment.status === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleStatusChange('accepted')}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 'medium'
                        }}
                      >
                        Xác nhận
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleStatusChange('cancelled')}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 'medium'
                        }}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  {appointment.status === 'accepted' && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleStatusChange('completed')}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium'
                      }}
                    >
                      Hoàn thành
                    </Button>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Chẩn đoán
                  </Typography>
                  {appointment.status === 'completed' && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setUpdateDialog(true)}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium'
                      }}
                    >
                      Cập nhật
                    </Button>
                  )}
                </Box>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <Typography>
                    {diagnosis || 'Chưa có chẩn đoán'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Update Diagnosis Dialog */}
      <Dialog 
        open={updateDialog} 
        onClose={() => setUpdateDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Cập nhật chẩn đoán
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chẩn đoán"
            fullWidth
            multiline
            rows={4}
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setUpdateDialog(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleUpdateDiagnosis} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium'
            }}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentDetails; 