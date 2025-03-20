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
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MedicalRecordsManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    diagnosis: '',
    date: '',
    notes: '',
  });

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch medical records data from API
    fetchMedicalRecords();
  }, []);

  useEffect(() => {
    // Filter records based on search term
    if (searchTerm.trim() === '') {
      setFilteredRecords(medicalRecords);
    } else {
      const keyword = searchTerm.toLowerCase();
      setFilteredRecords(
        medicalRecords.filter(
          (record) =>
            record.patientName.toLowerCase().includes(keyword) ||
            record.patientId.toLowerCase().includes(keyword) ||
            record.doctorName.toLowerCase().includes(keyword) ||
            record.diagnosis.toLowerCase().includes(keyword)
        )
      );
    }
  }, [searchTerm, medicalRecords]);

  const fetchMedicalRecords = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = [
        {
          id: 1,
          patientName: 'Nguyễn Văn A',
          patientId: 'PT001',
          doctorName: 'Bác sĩ Nguyễn Văn X',
          doctorId: 'DR001',
          date: '2024-03-20',
          diagnosis: 'Viêm họng',
          symptoms: ['Đau họng', 'Sốt nhẹ', 'Ho'],
          treatment: 'Kháng sinh, uống nhiều nước',
          medications: [
            { name: 'Amoxicillin', dosage: '500mg', frequency: '3 lần/ngày', duration: '5 ngày' },
            { name: 'Paracetamol', dosage: '500mg', frequency: 'Khi sốt', duration: 'Khi cần' },
          ],
          notes: 'Bệnh nhân cần nghỉ ngơi, kiêng đồ lạnh',
          followUpDate: '2024-03-27',
        },
        {
          id: 2,
          patientName: 'Trần Thị B',
          patientId: 'PT002',
          doctorName: 'Bác sĩ Lê Thị Y',
          doctorId: 'DR002',
          date: '2024-03-18',
          diagnosis: 'Đau lưng',
          symptoms: ['Đau lưng dưới', 'Khó cúi người'],
          treatment: 'Thuốc giảm đau, vật lý trị liệu',
          medications: [
            { name: 'Diclofenac', dosage: '50mg', frequency: '2 lần/ngày', duration: '7 ngày' },
            { name: 'Myonal', dosage: '50mg', frequency: '3 lần/ngày', duration: '7 ngày' },
          ],
          notes: 'Bệnh nhân cần tránh nâng vật nặng',
          followUpDate: '2024-04-01',
        },
        {
          id: 3,
          patientName: 'Lê Văn C',
          patientId: 'PT003',
          doctorName: 'Bác sĩ Phạm Văn Z',
          doctorId: 'DR003',
          date: '2024-03-15',
          diagnosis: 'Viêm xoang',
          symptoms: ['Đau đầu', 'Chảy mũi', 'Nghẹt mũi'],
          treatment: 'Thuốc kháng sinh, xông mũi',
          medications: [
            { name: 'Augmentin', dosage: '625mg', frequency: '2 lần/ngày', duration: '7 ngày' },
            { name: 'Loratadine', dosage: '10mg', frequency: '1 lần/ngày', duration: '10 ngày' },
          ],
          notes: 'Bệnh nhân nên tránh khói thuốc và môi trường ô nhiễm',
          followUpDate: '2024-03-25',
        },
      ];
      setMedicalRecords(mockData);
      setFilteredRecords(mockData);
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  const handleOpen = (record = null) => {
    if (record) {
      setSelectedRecord(record);
      setFormData({
        patientName: record.patientName,
        doctorName: record.doctorName,
        diagnosis: record.diagnosis,
        date: record.date,
        notes: record.notes,
      });
    } else {
      setSelectedRecord(null);
      setFormData({
        patientName: '',
        doctorName: '',
        diagnosis: '',
        date: '',
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleDetailsOpen = (record) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDetailsOpen(false);
    setSelectedRecord(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to create or update medical record
    if (selectedRecord) {
      // Update existing record
      const updatedRecords = medicalRecords.map((record) =>
        record.id === selectedRecord.id
          ? { ...record, ...formData }
          : record
      );
      setMedicalRecords(updatedRecords);
    } else {
      // Create new record
      const newRecord = {
        id: medicalRecords.length + 1,
        patientId: `PT00${medicalRecords.length + 1}`,
        doctorId: 'DR001',
        ...formData,
        symptoms: [],
        treatment: '',
        medications: [],
        followUpDate: '',
      };
      setMedicalRecords([...medicalRecords, newRecord]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    // TODO: Implement API call to delete medical record
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) {
      const updatedRecords = medicalRecords.filter((record) => record.id !== id);
      setMedicalRecords(updatedRecords);
    }
  };

  const handlePrint = (id) => {
    // TODO: Implement print functionality
    alert(`Đang in hồ sơ y tế: ${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Lịch sử Khám bệnh
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                placeholder="Tìm kiếm theo tên, mã bệnh nhân hoặc chẩn đoán"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: 350 }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
              >
                Thêm Hồ sơ
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã HS</TableCell>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Ngày khám</TableCell>
                  <TableCell>Chẩn đoán</TableCell>
                  <TableCell>Tái khám</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>MR-{record.id.toString().padStart(4, '0')}</TableCell>
                    <TableCell>{record.patientName} ({record.patientId})</TableCell>
                    <TableCell>{record.doctorName}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.followUpDate || 'Không có'}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleDetailsOpen(record)}
                        title="Xem chi tiết"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpen(record)}
                        title="Chỉnh sửa"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handlePrint(record.id)}
                        title="In hồ sơ"
                      >
                        <PrintIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(record.id)}
                        title="Xóa"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Edit Medical Record Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord ? 'Chỉnh sửa Hồ sơ Khám bệnh' : 'Thêm Hồ sơ Khám bệnh mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên bệnh nhân"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên bác sĩ"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày khám"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Chẩn đoán"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  margin="normal"
                  required
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
                  rows={4}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedRecord ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Medical Record Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết Hồ sơ Khám bệnh</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    <strong>Mã hồ sơ:</strong> MR-{selectedRecord.id.toString().padStart(4, '0')}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Bệnh nhân:</strong> {selectedRecord.patientName} ({selectedRecord.patientId})
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Ngày khám:</strong> {selectedRecord.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    <strong>Bác sĩ:</strong> {selectedRecord.doctorName} ({selectedRecord.doctorId})
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Chẩn đoán:</strong> {selectedRecord.diagnosis}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Ngày tái khám:</strong> {selectedRecord.followUpDate || 'Không có'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Triệu chứng
              </Typography>
              <Box sx={{ mb: 2 }}>
                {selectedRecord.symptoms.map((symptom, index) => (
                  <Chip
                    key={index}
                    label={symptom}
                    sx={{ mr: 1, mb: 1 }}
                    size="small"
                  />
                ))}
              </Box>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Phương pháp điều trị
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedRecord.treatment}
              </Typography>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Thuốc đã kê
              </Typography>
              <List sx={{ mb: 2 }}>
                {selectedRecord.medications.map((medication, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={medication.name}
                        secondary={`${medication.dosage}, ${medication.frequency}, ${medication.duration}`}
                      />
                    </ListItem>
                    {index < selectedRecord.medications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Ghi chú
              </Typography>
              <Typography variant="body1">
                {selectedRecord.notes}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => selectedRecord && handlePrint(selectedRecord.id)}
          >
            In hồ sơ
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalRecordsManagement; 