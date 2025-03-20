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
  Autocomplete,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DiagnosesManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [diagnoses, setDiagnoses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    symptoms: [],
    treatments: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch diagnoses data from API
    fetchDiagnoses();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter diagnoses based on search term
    if (searchTerm.trim() === '') {
      setFilteredDiagnoses(diagnoses);
    } else {
      const keyword = searchTerm.toLowerCase();
      setFilteredDiagnoses(
        diagnoses.filter(
          (diagnosis) =>
            diagnosis.name.toLowerCase().includes(keyword) ||
            diagnosis.code.toLowerCase().includes(keyword) ||
            diagnosis.category.toLowerCase().includes(keyword)
        )
      );
    }
  }, [searchTerm, diagnoses]);

  const fetchDiagnoses = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = [
        {
          id: 1,
          name: 'Viêm họng cấp',
          code: 'J02.9',
          description: 'Viêm niêm mạc họng cấp tính',
          category: 'Hô hấp',
          symptoms: ['Đau họng', 'Khó nuốt', 'Sốt', 'Ho'],
          treatments: 'Kháng sinh, nghỉ ngơi, uống nhiều nước',
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          name: 'Viêm phổi',
          code: 'J18',
          description: 'Viêm phổi do vi khuẩn',
          category: 'Hô hấp',
          symptoms: ['Ho có đờm', 'Sốt cao', 'Khó thở', 'Đau ngực'],
          treatments: 'Kháng sinh, nghỉ ngơi, điều trị triệu chứng',
          createdAt: '2024-01-20',
        },
        {
          id: 3,
          name: 'Viêm dạ dày',
          code: 'K29',
          description: 'Viêm niêm mạc dạ dày cấp tính',
          category: 'Tiêu hóa',
          symptoms: ['Đau bụng', 'Buồn nôn', 'Ợ chua', 'Chán ăn'],
          treatments: 'Thuốc kháng axit, chế độ ăn nhẹ, tránh thức ăn cay nóng',
          createdAt: '2024-02-01',
        },
        {
          id: 4,
          name: 'Tăng huyết áp',
          code: 'I10',
          description: 'Tăng huyết áp vô căn (nguyên phát)',
          category: 'Tim mạch',
          symptoms: ['Đau đầu', 'Hoa mắt', 'Chóng mặt', 'Mệt mỏi'],
          treatments: 'Thuốc hạ huyết áp, chế độ ăn giảm muối, tập thể dục đều đặn',
          createdAt: '2024-02-10',
        },
      ];
      setDiagnoses(mockData);
      setFilteredDiagnoses(mockData);
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockCategories = [
        'Hô hấp',
        'Tiêu hóa',
        'Tim mạch',
        'Thần kinh',
        'Da liễu',
        'Nội tiết',
        'Cơ xương khớp',
        'Tai mũi họng',
        'Mắt',
        'Răng hàm mặt',
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpen = (diagnosis = null) => {
    if (diagnosis) {
      setSelectedDiagnosis(diagnosis);
      setFormData({
        name: diagnosis.name,
        code: diagnosis.code,
        description: diagnosis.description,
        category: diagnosis.category,
        symptoms: diagnosis.symptoms,
        treatments: diagnosis.treatments,
      });
    } else {
      setSelectedDiagnosis(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        category: '',
        symptoms: [],
        treatments: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDiagnosis(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSymptomsChange = (event, newValue) => {
    setFormData({
      ...formData,
      symptoms: newValue,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to create or update diagnosis
    if (selectedDiagnosis) {
      // Update existing diagnosis
      const updatedDiagnoses = diagnoses.map((diagnosis) =>
        diagnosis.id === selectedDiagnosis.id
          ? { ...diagnosis, ...formData }
          : diagnosis
      );
      setDiagnoses(updatedDiagnoses);
    } else {
      // Create new diagnosis
      const newDiagnosis = {
        id: diagnoses.length + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setDiagnoses([...diagnoses, newDiagnosis]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    // TODO: Implement API call to delete diagnosis
    if (window.confirm('Bạn có chắc chắn muốn xóa chẩn đoán này?')) {
      const updatedDiagnoses = diagnoses.filter((diagnosis) => diagnosis.id !== id);
      setDiagnoses(updatedDiagnoses);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Chẩn đoán
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                placeholder="Tìm kiếm theo tên, mã chẩn đoán hoặc danh mục"
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
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
              >
                Thêm Chẩn đoán
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã ICD</TableCell>
                  <TableCell>Tên chẩn đoán</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Triệu chứng</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDiagnoses.map((diagnosis) => (
                  <TableRow key={diagnosis.id}>
                    <TableCell>{diagnosis.code}</TableCell>
                    <TableCell>{diagnosis.name}</TableCell>
                    <TableCell>{diagnosis.category}</TableCell>
                    <TableCell>
                      {diagnosis.symptoms.slice(0, 3).map((symptom, index) => (
                        <Chip
                          key={index}
                          label={symptom}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {diagnosis.symptoms.length > 3 && (
                        <Chip
                          label={`+${diagnosis.symptoms.length - 3}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>{diagnosis.createdAt}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpen(diagnosis)}
                        title="Chỉnh sửa"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(diagnosis.id)}
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

      {/* Add/Edit Diagnosis Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedDiagnosis ? 'Chỉnh sửa Chẩn đoán' : 'Thêm Chẩn đoán mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên chẩn đoán"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mã ICD"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={formData.symptoms}
                  onChange={handleSymptomsChange}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Triệu chứng"
                      placeholder="Nhập và nhấn Enter"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phương pháp điều trị"
                  name="treatments"
                  value={formData.treatments}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedDiagnosis ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default DiagnosesManagement; 