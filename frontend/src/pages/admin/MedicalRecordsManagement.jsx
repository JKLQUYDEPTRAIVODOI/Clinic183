import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon, Print as PrintIcon } from '@mui/icons-material';
import medicalRecordService from '../../services/medicalRecordService';
import appointmentService from '../../services/appointmentService';

const MedicalRecordsManagement = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    appointment_id: '',
    diagnosis: '',
    notes: ''
  });

  useEffect(() => {
    fetchMedicalRecords();
    fetchAppointments();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const data = await medicalRecordService.getAllMedicalRecords();
      setMedicalRecords(data);
    } catch (error) {
      console.error('Lỗi khi tải hồ sơ bệnh án:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách cuộc hẹn:', error);
    }
  };

  const handleOpen = (record = null) => {
    if (record) {
      const appointment = appointments.find(a => a.id === record.appointment_id);
      setSelectedAppointment(appointment);
      setFormData({
        appointment_id: record.appointment_id,
        diagnosis: record.diagnosis,
        notes: record.notes
      });
      setSelectedRecord(record);
    } else {
      setFormData({
        appointment_id: '',
        diagnosis: '',
        notes: ''
      });
      setSelectedRecord(null);
      setSelectedAppointment(null);
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setOpenViewDialog(false);
    setSelectedRecord(null);
    setSelectedAppointment(null);
    setFormData({
      appointment_id: '',
      diagnosis: '',
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRecord) {
        await medicalRecordService.updateMedicalRecord(selectedRecord.id, formData);
      } else {
        await medicalRecordService.createMedicalRecord(formData);
      }
      handleClose();
      fetchMedicalRecords();
    } catch (error) {
      console.error('Lỗi khi lưu hồ sơ bệnh án:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) {
      try {
        await medicalRecordService.deleteMedicalRecord(id);
        fetchMedicalRecords();
      } catch (error) {
        console.error('Lỗi khi xóa hồ sơ bệnh án:', error);
      }
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setOpenViewDialog(true);
  };

  const filteredRecords = medicalRecords.filter(record =>
    record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patient_id.toString().includes(searchTerm) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Quản lý Hồ sơ Bệnh án
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
              >
                Thêm Hồ sơ
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Tìm kiếm theo tên bệnh nhân, ID hoặc chẩn đoán"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Bệnh nhân</TableCell>
                    <TableCell>ID Bệnh nhân</TableCell>
                    <TableCell>Bác sĩ</TableCell>
                    <TableCell>Ngày khám</TableCell>
                    <TableCell>Chẩn đoán</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.patient_name}</TableCell>
                      <TableCell>{record.patient_id}</TableCell>
                      <TableCell>{record.doctor_name}</TableCell>
                      <TableCell>{new Date(record.appointment_date).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleView(record)} color="primary" title="Xem chi tiết">
                          <ViewIcon />
                        </IconButton>
                        <IconButton onClick={() => handleOpen(record)} color="primary" title="Chỉnh sửa">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(record.id)} color="error" title="Xóa">
                          <DeleteIcon />
                        </IconButton>
                        <IconButton color="primary" title="In">
                          <PrintIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog Thêm/Sửa */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRecord ? 'Chỉnh sửa Hồ sơ Bệnh án' : 'Thêm Hồ sơ Bệnh án mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Autocomplete
              fullWidth
              options={appointments}
              getOptionLabel={(option) => `${option.patient_name} - ${new Date(option.appointment_date).toLocaleDateString('vi-VN')} ${option.appointment_time}`}
              value={selectedAppointment}
              onChange={(event, newValue) => {
                setSelectedAppointment(newValue);
                setFormData({
                  ...formData,
                  appointment_id: newValue ? newValue.id : ''
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn cuộc hẹn"
                  margin="normal"
                  required
                />
              )}
              disabled={!!selectedRecord}
            />
            <TextField
              fullWidth
              label="Chẩn đoán"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              margin="normal"
              required
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Ghi chú"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedRecord ? 'Cập nhật' : 'Thêm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Xem chi tiết */}
      <Dialog open={openViewDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết Hồ sơ Bệnh án</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Tên bệnh nhân:</strong> {selectedRecord.patient_name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>ID bệnh nhân:</strong> {selectedRecord.patient_id}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Bác sĩ:</strong> {selectedRecord.doctor_name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Ngày khám:</strong> {new Date(selectedRecord.appointment_date).toLocaleDateString('vi-VN')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Giờ khám:</strong> {selectedRecord.appointment_time}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Chẩn đoán:</strong> {selectedRecord.diagnosis}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Ghi chú:</strong> {selectedRecord.notes}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalRecordsManagement; 