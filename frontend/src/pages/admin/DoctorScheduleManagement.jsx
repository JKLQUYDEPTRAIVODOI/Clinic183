import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import viLocale from 'date-fns/locale/vi';

const DoctorScheduleManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: null,
    startTime: null,
    endTime: null,
    isRecurring: false,
    daysOfWeek: [],
    maxAppointments: 8,
    notes: '',
  });
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = [
    { value: 1, label: 'Thứ Hai' },
    { value: 2, label: 'Thứ Ba' },
    { value: 3, label: 'Thứ Tư' },
    { value: 4, label: 'Thứ Năm' },
    { value: 5, label: 'Thứ Sáu' },
    { value: 6, label: 'Thứ Bảy' },
    { value: 0, label: 'Chủ Nhật' },
  ];

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch doctors and schedules data from API
    fetchDoctors();
    fetchSchedules();
  }, []);

  useEffect(() => {
    filterSchedulesByDate();
  }, [selectedDate, schedules]);

  const filterSchedulesByDate = () => {
    if (!selectedDate) {
      setFilteredSchedules(schedules);
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayOfWeek = selectedDate.getDay(); // 0 là Chủ Nhật, 1-6 là thứ Hai đến thứ Bảy
    
    const filtered = schedules.filter(schedule => {
      // Nếu là lịch cố định (recurring), kiểm tra xem có trùng với thứ trong tuần không
      if (schedule.isRecurring && schedule.daysOfWeek.includes(dayOfWeek)) {
        return true;
      }
      
      // Nếu là lịch không cố định, kiểm tra xem có trùng ngày không
      if (!schedule.isRecurring && schedule.date === dateStr) {
        return true;
      }
      
      return false;
    });
    
    setFilteredSchedules(filtered);
  };

  const fetchDoctors = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockDoctors = [
        { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Nội khoa' },
        { id: 2, name: 'BS. Trần Thị B', specialty: 'Nhi khoa' },
        { id: 3, name: 'BS. Lê Văn C', specialty: 'Da liễu' },
        { id: 4, name: 'BS. Phạm Thị D', specialty: 'Tai mũi họng' },
      ];
      setDoctors(mockDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockSchedules = [
        {
          id: 1,
          doctorId: 1,
          doctorName: 'BS. Nguyễn Văn A',
          specialty: 'Nội khoa',
          date: '2024-05-15',
          startTime: '08:00',
          endTime: '12:00',
          isRecurring: true,
          daysOfWeek: [1, 3, 5], // Thứ Hai, Thứ Tư, Thứ Sáu
          maxAppointments: 10,
          bookedAppointments: 4,
          notes: 'Khám định kỳ',
        },
        {
          id: 2,
          doctorId: 2,
          doctorName: 'BS. Trần Thị B',
          specialty: 'Nhi khoa',
          date: '2024-05-15',
          startTime: '13:00',
          endTime: '17:00',
          isRecurring: true,
          daysOfWeek: [2, 4], // Thứ Ba, Thứ Năm
          maxAppointments: 8,
          bookedAppointments: 2,
          notes: '',
        },
        {
          id: 3,
          doctorId: 3,
          doctorName: 'BS. Lê Văn C',
          specialty: 'Da liễu',
          date: '2024-05-16',
          startTime: '08:00',
          endTime: '12:00',
          isRecurring: false,
          daysOfWeek: [],
          maxAppointments: 6,
          bookedAppointments: 0,
          notes: 'Chỉ khám vào ngày Thứ Bảy',
        },
        {
          id: 4,
          doctorId: 4,
          doctorName: 'BS. Phạm Thị D',
          specialty: 'Tai mũi họng',
          date: '2024-05-17',
          startTime: '08:00',
          endTime: '17:00',
          isRecurring: true,
          daysOfWeek: [1, 2, 3, 4, 5], // Thứ Hai đến Thứ Sáu
          maxAppointments: 15,
          bookedAppointments: 8,
          notes: 'Nghỉ trưa từ 12:00 đến 13:00',
        },
      ];
      setSchedules(mockSchedules);
      setFilteredSchedules(mockSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleScheduleDialogOpen = (schedule = null) => {
    if (schedule) {
      setSelectedSchedule(schedule);
      const doctor = doctors.find(doc => doc.id === schedule.doctorId);
      setSelectedDoctor(doctor);
      
      // Parse date and times for form
      const date = schedule.isRecurring ? null : new Date(schedule.date);
      const startTime = parseTimeString(schedule.startTime);
      const endTime = parseTimeString(schedule.endTime);
      
      setFormData({
        doctorId: schedule.doctorId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        isRecurring: schedule.isRecurring,
        daysOfWeek: schedule.daysOfWeek,
        maxAppointments: schedule.maxAppointments,
        notes: schedule.notes,
      });
    } else {
      setSelectedSchedule(null);
      setSelectedDoctor(null);
      setFormData({
        doctorId: '',
        date: null,
        startTime: null,
        endTime: null,
        isRecurring: false,
        daysOfWeek: [],
        maxAppointments: 8,
        notes: '',
      });
    }
    setOpenScheduleDialog(true);
  };

  const handleViewDialogOpen = (schedule) => {
    setSelectedSchedule(schedule);
    const doctor = doctors.find(doc => doc.id === schedule.doctorId);
    setSelectedDoctor(doctor);
    setOpenViewDialog(true);
  };

  const handleScheduleDialogClose = () => {
    setOpenScheduleDialog(false);
    setSelectedSchedule(null);
    setSelectedDoctor(null);
  };

  const handleViewDialogClose = () => {
    setOpenViewDialog(false);
    setSelectedSchedule(null);
    setSelectedDoctor(null);
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setFormData({
      ...formData,
      doctorId,
    });
    const doctor = doctors.find(doc => doc.id === doctorId);
    setSelectedDoctor(doctor);
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate,
    });
  };

  const handleStartTimeChange = (newTime) => {
    setFormData({
      ...formData,
      startTime: newTime,
    });
  };

  const handleEndTimeChange = (newTime) => {
    setFormData({
      ...formData,
      endTime: newTime,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDayOfWeekToggle = (dayValue) => {
    const currentDays = [...formData.daysOfWeek];
    const dayIndex = currentDays.indexOf(dayValue);
    
    if (dayIndex === -1) {
      // Add day if not already selected
      currentDays.push(dayValue);
    } else {
      // Remove day if already selected
      currentDays.splice(dayIndex, 1);
    }
    
    setFormData({
      ...formData,
      daysOfWeek: currentDays,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to create or update schedule
    
    // Format date and times for submission
    const formattedDate = formData.date ? formData.date.toISOString().split('T')[0] : '';
    const formattedStartTime = formData.startTime ? formatTimeToString(formData.startTime) : '';
    const formattedEndTime = formData.endTime ? formatTimeToString(formData.endTime) : '';
    
    const submissionData = {
      ...formData,
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
    
    if (selectedSchedule) {
      // Update existing schedule
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === selectedSchedule.id
          ? {
              ...schedule,
              ...submissionData,
              doctorName: selectedDoctor ? selectedDoctor.name : '',
              specialty: selectedDoctor ? selectedDoctor.specialty : '',
            }
          : schedule
      );
      setSchedules(updatedSchedules);
    } else {
      // Create new schedule
      const doctor = doctors.find(doc => doc.id === formData.doctorId);
      const newSchedule = {
        id: schedules.length + 1,
        ...submissionData,
        doctorName: doctor ? doctor.name : '',
        specialty: doctor ? doctor.specialty : '',
        bookedAppointments: 0,
      };
      setSchedules([...schedules, newSchedule]);
    }
    
    handleScheduleDialogClose();
  };

  const handleDelete = (id) => {
    // TODO: Implement API call to delete schedule
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) {
      const updatedSchedules = schedules.filter((schedule) => schedule.id !== id);
      setSchedules(updatedSchedules);
    }
  };

  const handleFilterDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Helper functions for time formatting
  const parseTimeString = (timeString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  const formatTimeToString = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Format day of week for display
  const formatDaysOfWeek = (daysArray) => {
    if (!daysArray || daysArray.length === 0) return 'Không lặp lại';
    
    return daysArray.map(day => {
      const dayObj = daysOfWeek.find(d => d.value === day);
      return dayObj ? dayObj.label.substring(0, 5) : '';
    }).join(', ');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Lịch Bác sĩ
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
                <DatePicker
                  label="Lọc theo ngày"
                  value={selectedDate}
                  onChange={handleFilterDateChange}
                  renderInput={(params) => <TextField {...params} size="small" />}
                  inputFormat="dd/MM/yyyy"
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleScheduleDialogOpen()}
              >
                Thêm lịch mới
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Chuyên khoa</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Lịch làm việc</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.doctorName}</TableCell>
                      <TableCell>{schedule.specialty}</TableCell>
                      <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                      <TableCell>
                        {schedule.isRecurring ? (
                          <Chip 
                            label={formatDaysOfWeek(schedule.daysOfWeek)} 
                            color="primary" 
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          schedule.date
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${schedule.bookedAppointments}/${schedule.maxAppointments}`}
                          color={schedule.bookedAppointments >= schedule.maxAppointments ? "error" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewDialogOpen(schedule)}
                          title="Xem chi tiết"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleScheduleDialogOpen(schedule)}
                          title="Chỉnh sửa"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(schedule.id)}
                          title="Xóa"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có lịch làm việc nào cho ngày được chọn
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Add/Edit Schedule Dialog */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
        <Dialog open={openScheduleDialog} onClose={handleScheduleDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedSchedule ? 'Chỉnh sửa Lịch làm việc' : 'Thêm Lịch làm việc mới'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Bác sĩ</InputLabel>
                    <Select
                      name="doctorId"
                      value={formData.doctorId}
                      onChange={handleDoctorChange}
                      required
                    >
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isRecurring}
                        onChange={handleInputChange}
                        name="isRecurring"
                      />
                    }
                    label="Lịch làm việc định kỳ (hàng tuần)"
                  />
                </Grid>

                {formData.isRecurring ? (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Các ngày trong tuần:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {daysOfWeek.map((day) => (
                        <Chip
                          key={day.value}
                          label={day.label}
                          onClick={() => handleDayOfWeekToggle(day.value)}
                          color={formData.daysOfWeek.includes(day.value) ? "primary" : "default"}
                          variant={formData.daysOfWeek.includes(day.value) ? "filled" : "outlined"}
                        />
                      ))}
                    </Box>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Ngày làm việc"
                      value={formData.date}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth margin="normal" required />
                      )}
                      inputFormat="dd/MM/yyyy"
                      disablePast
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Giờ bắt đầu"
                    value={formData.startTime}
                    onChange={handleStartTimeChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" required />
                    )}
                    minutesStep={15}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Giờ kết thúc"
                    value={formData.endTime}
                    onChange={handleEndTimeChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" required />
                    )}
                    minutesStep={15}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số lượng bệnh nhân tối đa"
                    name="maxAppointments"
                    type="number"
                    value={formData.maxAppointments}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleScheduleDialogClose}>Hủy</Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedSchedule ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </LocalizationProvider>

      {/* View Schedule Details Dialog */}
      <Dialog open={openViewDialog} onClose={handleViewDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Chi tiết Lịch làm việc
          <IconButton
            aria-label="close"
            onClick={handleViewDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            &times;
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedSchedule && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={2}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {selectedSchedule.doctorName} - {selectedSchedule.specialty}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Thời gian làm việc
                </Typography>
                <Typography variant="body1">
                  {selectedSchedule.startTime} - {selectedSchedule.endTime}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Lịch làm việc
                </Typography>
                <Typography variant="body1">
                  {selectedSchedule.isRecurring 
                    ? `Hàng tuần: ${formatDaysOfWeek(selectedSchedule.daysOfWeek)}`
                    : `Ngày: ${selectedSchedule.date}`
                  }
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Số lượng bệnh nhân
                </Typography>
                <Typography variant="body1">
                  <Chip
                    label={`${selectedSchedule.bookedAppointments}/${selectedSchedule.maxAppointments}`}
                    color={selectedSchedule.bookedAppointments >= selectedSchedule.maxAppointments ? "error" : "success"}
                    size="small"
                  />
                </Typography>
              </Grid>
              
              {selectedSchedule.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ghi chú
                  </Typography>
                  <Typography variant="body1">
                    {selectedSchedule.notes}
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Box borderTop={1} borderColor="divider" pt={2} mt={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lịch hẹn đã đặt
                  </Typography>
                  {selectedSchedule.bookedAppointments > 0 ? (
                    <Box component="ul" pl={2}>
                      {/* Mock data - In real implementation, you would list actual appointments */}
                      <Typography component="li">
                        Nguyễn Văn X - 09:00 - Khám định kỳ
                      </Typography>
                      <Typography component="li">
                        Trần Thị Y - 10:30 - Đau bụng
                      </Typography>
                      {/* Add more mock appointments if needed */}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      Chưa có lịch hẹn nào
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorScheduleManagement; 