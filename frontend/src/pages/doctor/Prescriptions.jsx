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
  IconButton,
  CircularProgress,
  Alert,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import prescriptionService from '../../services/prescriptionService';
import medicineService from '../../services/medicineService';
import appointmentService from '../../services/appointmentService';
import { format } from 'date-fns';

const steps = ['Chọn bệnh nhân', 'Kê đơn thuốc', 'Xác nhận'];

const isValidDate = (date) => {
  return date && !isNaN(new Date(date).getTime());
};

const formatDate = (date) => {
  return isValidDate(date) ? format(new Date(date), 'dd/MM/yyyy') : 'N/A';
};

const formatTime = (time) => {
  if (!time) return 'N/A';
  try {
    // Nếu time là string ISO datetime
    if (typeof time === 'string' && time.includes('T')) {
      return format(new Date(time), 'HH:mm');
    }
    // Nếu time là string time
    if (typeof time === 'string' && time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return format(date, 'HH:mm');
    }
    return 'N/A';
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'N/A';
  }
};

const DoctorPrescriptions = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    medical_record_id: '',
    diagnosis: '',
    items: [{ medicine_id: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });
  const [formError, setFormError] = useState({
    step: null,
    message: '',
    details: []
  });

  useEffect(() => {
    if (!hasRole('doctor')) {
      navigate('/login');
      return;
    }
    fetchPrescriptions();
    fetchMedicines();
    fetchAppointments();
  }, [hasRole, navigate]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getDoctorPrescriptions();
      setPrescriptions(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setError('Không thể tải danh sách đơn thuốc');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const data = await medicineService.getAllMedicines();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getDoctorAppointments();
      // Chỉ lấy các cuộc hẹn đã hoàn thành
      const completedAppointments = data.filter(app => app.status === 'completed');
      
      // Lấy thông tin medical record cho mỗi appointment
      const appointmentsWithMedicalRecords = completedAppointments.map(appointment => {
        // Nếu chưa có medical_record_id, trả về appointment như cũ
        if (!appointment.medical_record_id) {
          return {
            ...appointment,
            diagnosis: appointment.diagnosis || ''
          };
        }
        // Nếu đã có medical_record_id, trả về appointment với thông tin hiện có
        return {
          ...appointment,
          diagnosis: appointment.diagnosis || ''
        };
      });
      
      setAppointments(appointmentsWithMedicalRecords);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Không thể tải danh sách cuộc hẹn');
    }
  };

  const handleOpen = async (prescription = null) => {
    try {
      if (prescription) {
        setLoading(true);
        const fullPrescription = await prescriptionService.getPrescriptionById(prescription.id);
        setSelectedPrescription(fullPrescription);
        // Tạo selectedAppointment từ thông tin đơn thuốc
        setSelectedAppointment({
          id: fullPrescription.appointment_id,
          patient_name: fullPrescription.patient_name,
          appointment_date: fullPrescription.appointment_date,
          appointment_time: fullPrescription.appointment_time,
          diagnosis: fullPrescription.diagnosis,
          medical_record_id: fullPrescription.medical_record_id
        });
        setFormData({
          medical_record_id: fullPrescription.medical_record_id,
          diagnosis: fullPrescription.diagnosis || '',
          items: fullPrescription.items.map(item => ({
            medicine_id: item.medicine_id,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions || ''
          }))
        });
      } else {
        setSelectedPrescription(null);
        setSelectedAppointment(null);
        setFormData({
          medical_record_id: '',
          diagnosis: '',
          items: [{ medicine_id: '', dosage: '', frequency: '', duration: '', instructions: '' }]
        });
        setActiveStep(0);
      }
      setOpen(true);
    } catch (error) {
      console.error('Error loading prescription details:', error);
      setError('Không thể tải thông tin đơn thuốc');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPrescription(null);
    setSelectedAppointment(null);
    setActiveStep(0);
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      ...formData,
      diagnosis: appointment.diagnosis || ''
    });
    // Reset form errors when selecting a new appointment
    setFormError({ step: null, message: '', details: [] });
  };

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { medicine_id: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const handleRemoveMedicine = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!selectedAppointment) {
          setFormError({
            step: 0,
            message: 'Vui lòng chọn bệnh nhân',
            details: []
          });
          return false;
        }
        break;
      case 1:
        const emptyFields = [];
        formData.items.forEach((item, index) => {
          if (!item.medicine_id) emptyFields.push(`Thuốc ${index + 1}: Chưa chọn thuốc`);
          if (!item.dosage) emptyFields.push(`Thuốc ${index + 1}: Chưa nhập liều lượng`);
          if (!item.frequency) emptyFields.push(`Thuốc ${index + 1}: Chưa nhập tần suất`);
          if (!item.duration) emptyFields.push(`Thuốc ${index + 1}: Chưa nhập thời gian`);
        });
        
        if (emptyFields.length > 0) {
          setFormError({
            step: 1,
            message: 'Vui lòng điền đầy đủ thông tin thuốc',
            details: emptyFields
          });
          return false;
        }
        break;
      case 2:
        // Validation for final step if needed
        break;
    }
    setFormError({ step: null, message: '', details: [] });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    try {
      setLoading(true);
      setError(null);

      if (!selectedAppointment) {
        throw new Error('Vui lòng chọn bệnh nhân');
      }

      if (!formData.diagnosis) {
        throw new Error('Vui lòng nhập chẩn đoán');
      }

      // Tạo hoặc cập nhật medical record
      let medicalRecordId;
      try {
        if (selectedPrescription) {
          // Nếu đang cập nhật đơn thuốc, sử dụng medical_record_id hiện có
          medicalRecordId = selectedPrescription.medical_record_id;
          // Cập nhật chẩn đoán trong medical record
          await prescriptionService.updateMedicalRecord(medicalRecordId, {
            diagnosis: formData.diagnosis
          });
        } else {
          // Nếu tạo mới đơn thuốc, tạo medical record mới
          const medicalRecord = await prescriptionService.createMedicalRecord({
            appointment_id: selectedAppointment.id,
            diagnosis: formData.diagnosis
          });
          medicalRecordId = medicalRecord.id;
        }
      } catch (error) {
        console.error('Error handling medical record:', error);
        throw new Error('Không thể cập nhật thông tin khám bệnh: ' + (error.response?.data?.message || error.message));
      }

      // Tạo hoặc cập nhật đơn thuốc
      const prescriptionData = {
        medical_record_id: medicalRecordId,
        items: formData.items.map(item => ({
          medicine_id: item.medicine_id,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.instructions || ''
        }))
      };

      if (selectedPrescription) {
        await prescriptionService.updatePrescription(selectedPrescription.id, prescriptionData);
      } else {
        await prescriptionService.createPrescription(prescriptionData);
      }

      handleClose();
      fetchPrescriptions();
      fetchAppointments();
    } catch (error) {
      console.error('Error saving prescription:', error);
      setError(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu đơn thuốc');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chọn bệnh nhân từ danh sách khám
            </Typography>
            {formError.step === 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError.message}
              </Alert>
            )}
            <Grid container spacing={2}>
              {appointments.map((appointment) => (
                <Grid item xs={12} key={appointment.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: selectedAppointment?.id === appointment.id ? 'primary.light' : 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => handleAppointmentSelect(appointment)}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {appointment.patient_name}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography color="text.secondary">
                            Ngày khám: {formatDate(appointment.appointment_date)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography color="text.secondary">
                            Giờ khám: {formatTime(appointment.appointment_time)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Chẩn đoán:</strong> {appointment.diagnosis || 'Chưa có'}
                      </Typography>
                      {appointment.notes && (
                        <Typography color="text.secondary">
                          <strong>Ghi chú:</strong> {appointment.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Kê đơn thuốc cho bệnh nhân: {selectedAppointment?.patient_name}
            </Typography>
            {formError.step === 1 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError.message}
                {formError.details.length > 0 && (
                  <ul style={{ marginTop: 8, marginBottom: 0 }}>
                    {formError.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
              </Alert>
            )}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Thông tin khám bệnh
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Bệnh nhân: {selectedAppointment?.patient_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Ngày khám:</strong> {formatDate(selectedAppointment?.appointment_date)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Giờ khám:</strong> {formatTime(selectedAppointment?.appointment_time)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Chẩn đoán"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      required
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {formData.items.map((item, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1">Thuốc {index + 1}</Typography>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveMedicine(index)}
                      disabled={formData.items.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={medicines}
                        getOptionLabel={(option) => `${option.name} (${option.unit}) - Còn ${option.unit_in_stock} ${option.unit}`}
                        value={medicines.find(m => m.id === item.medicine_id) || null}
                        onChange={(_, newValue) => handleMedicineChange(index, 'medicine_id', newValue?.id || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Chọn thuốc"
                            required
                            error={formError.step === 1 && !item.medicine_id}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box>
                              <Typography variant="body1">{option.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Đơn vị: {option.unit} | Còn lại: {option.unit_in_stock}
                              </Typography>
                            </Box>
                          </li>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Liều lượng"
                        value={item.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        required
                        error={formError.step === 1 && !item.dosage}
                        helperText="VD: 1 viên, 5ml,..."
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tần suất"
                        value={item.frequency}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        required
                        error={formError.step === 1 && !item.frequency}
                        helperText="VD: 2 lần/ngày, 8 tiếng/lần,..."
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Thời gian"
                        value={item.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        required
                        error={formError.step === 1 && !item.duration}
                        helperText="VD: 5 ngày, 1 tuần,..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Hướng dẫn"
                        value={item.instructions}
                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                        multiline
                        rows={2}
                        helperText="VD: Uống sau khi ăn, Không uống kèm rượu bia,..."
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddMedicine}
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Thêm Thuốc
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Xác nhận thông tin đơn thuốc
            </Typography>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Thông tin bệnh nhân
                </Typography>
                <Typography><strong>Tên:</strong> {selectedAppointment?.patient_name}</Typography>
                <Typography><strong>Ngày khám:</strong> {formatDate(selectedAppointment?.appointment_date)}</Typography>
                <Typography><strong>Giờ khám:</strong> {formatTime(selectedAppointment?.appointment_time)}</Typography>
                <Typography><strong>Chẩn đoán:</strong> {formData.diagnosis}</Typography>
              </CardContent>
            </Card>
            <Typography variant="subtitle1" gutterBottom>
              Danh sách thuốc
            </Typography>
            {formData.items.map((item, index) => {
              const medicine = medicines.find(m => m.id === item.medicine_id);
              return (
                <Card key={index} sx={{ mb: 1 }}>
                  <CardContent>
                    <Typography variant="subtitle2">
                      {medicine?.name} ({medicine?.unit})
                    </Typography>
                    <Typography variant="body2">
                      Liều lượng: {item.dosage} | Tần suất: {item.frequency} | Thời gian: {item.duration}
                    </Typography>
                    {item.instructions && (
                      <Typography variant="body2" color="text.secondary">
                        Hướng dẫn: {item.instructions}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading && !open) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Kê đơn thuốc
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Thêm Đơn thuốc
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Ngày kê đơn</TableCell>
                  <TableCell>Chẩn đoán</TableCell>
                  <TableCell>Thuốc đã kê</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{prescription.patient_name}</Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(prescription.created_at)}
                    </TableCell>
                    <TableCell>{prescription.diagnosis}</TableCell>
                    <TableCell>
                      {prescription.items?.map(item => (
                        <Chip 
                          key={item.id}
                          label={`${item.medicine_name} (${item.dosage})`}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(prescription)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {prescriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Chưa có đơn thuốc nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          {selectedPrescription ? 'Chi tiết Đơn thuốc' : 'Thêm Đơn thuốc mới'}
        </DialogTitle>
        <DialogContent>
          {!selectedPrescription && (
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          {selectedPrescription ? (
            <Box sx={{ mt: 2 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Thông tin khám bệnh
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Bệnh nhân: {selectedAppointment?.patient_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography><strong>Ngày khám:</strong> {formatDate(selectedAppointment?.appointment_date)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography><strong>Giờ khám:</strong> {formatTime(selectedAppointment?.appointment_time)}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Chẩn đoán"
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                        required
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              {renderStepContent(1)}
            </Box>
          ) : (
            renderStepContent(activeStep)
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {selectedPrescription ? 'Đóng' : 'Hủy'}
          </Button>
          {!selectedPrescription && (
            <>
              <Button 
                disabled={activeStep === 0} 
                onClick={handleBack}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={loading || (
                  (activeStep === 0 && !selectedAppointment) ||
                  (activeStep === 1 && formData.items.some(item => 
                    !item.medicine_id || !item.dosage || !item.frequency || !item.duration
                  ))
                )}
              >
                {loading ? <CircularProgress size={24} /> : (activeStep === steps.length - 1 ? 'Hoàn tất' : 'Tiếp theo')}
              </Button>
            </>
          )}
          {selectedPrescription && (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorPrescriptions; 