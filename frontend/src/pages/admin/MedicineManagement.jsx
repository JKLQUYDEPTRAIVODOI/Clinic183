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
  CircularProgress,
  Alert,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MedicalServices,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import medicineService from '../../services/medicineService';

const UNITS = ['Viên', 'Ống', 'Chai', 'Gói', 'Hộp'];

const MedicineManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'Viên',
    price: '',
    unit_in_stock: ''
  });

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await medicineService.getAllMedicines();
      setMedicines(data);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError(err.message || 'Không thể lấy danh sách thuốc');
    }
  };

  const searchMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (searchTerm) {
        data = await medicineService.searchMedicines(searchTerm);
      } else {
        data = await medicineService.getAllMedicines();
      }
      setMedicines(data);
    } catch (error) {
      console.error('Error searching medicines:', error);
      setError('Không thể tìm kiếm thuốc. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (medicine = null) => {
    if (medicine) {
      setSelectedMedicine(medicine);
      setFormData({
        name: medicine.name,
        description: medicine.description || '',
        unit: medicine.unit || 'Viên',
        price: medicine.price.toString(),
        unit_in_stock: medicine.unit_in_stock.toString()
      });
    } else {
      setSelectedMedicine(null);
      setFormData({
        name: '',
        description: '',
        unit: 'Viên',
        price: '',
        unit_in_stock: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedicine(null);
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

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMedicines();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.price || !formData.unit_in_stock) {
      alert('Vui lòng điền đầy đủ thông tin cần thiết');
      return;
    }

    // Validate numeric fields
    if (isNaN(parseFloat(formData.price)) || 
        isNaN(parseInt(formData.unit_in_stock))) {
      alert('Giá và số lượng phải là số');
      return;
    }

    try {
      setLoading(true);

      const medicineData = {
        name: formData.name,
        description: formData.description,
        unit: formData.unit,
        price: parseFloat(formData.price),
        unit_in_stock: parseInt(formData.unit_in_stock)
      };

      if (selectedMedicine) {
        await medicineService.updateMedicine(selectedMedicine.id, medicineData);
      } else {
        await medicineService.createMedicine(medicineData);
      }

      fetchMedicines();
      handleClose();
    } catch (error) {
      console.error('Error saving medicine:', error);
      setError('Lỗi khi lưu thuốc. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      try {
        setLoading(true);
        await medicineService.deleteMedicine(id);
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
        setError('Lỗi khi xóa thuốc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStockUpdate = async (id, currentStock) => {
    const quantityValue = prompt('Nhập số lượng thuốc cần thêm vào kho (nhập số âm để giảm số lượng):', '0');
    if (quantityValue === null) return;

    const parsedQuantity = parseInt(quantityValue);
    if (isNaN(parsedQuantity)) {
      alert('Vui lòng nhập một số hợp lệ');
      return;
    }

    const newStock = currentStock + parsedQuantity;
    
    if (newStock < 0) {
      alert('Số lượng trong kho không thể âm');
      return;
    }

    try {
      setLoading(true);
      await medicineService.updateStock(id, parsedQuantity);
      fetchMedicines();
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Lỗi khi cập nhật kho. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Thuốc
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleEditOpen()}
            >
              Thêm Thuốc mới
            </Button>
          </Box>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Search */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Tìm kiếm thuốc"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={searchMedicines} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        </Grid>

        {/* Medicines Table */}
        <Grid item xs={12}>
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên thuốc</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Đơn vị</TableCell>
                    <TableCell align="right">Giá</TableCell>
                    <TableCell align="right">Số lượng trong kho</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines.length > 0 ? (
                    medicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell>{medicine.name}</TableCell>
                        <TableCell>{medicine.description}</TableCell>
                        <TableCell>{medicine.unit}</TableCell>
                        <TableCell align="right">{formatCurrency(medicine.price)}</TableCell>
                        <TableCell align="right">{medicine.unit_in_stock}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditOpen(medicine)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(medicine.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleStockUpdate(medicine.id, medicine.unit_in_stock)}
                          >
                            Cập nhật kho
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Không có thuốc nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

      {/* Edit/Add Medicine Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedMedicine ? 'Chỉnh sửa Thuốc' : 'Thêm Thuốc mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên thuốc"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              select
              fullWidth
              label="Đơn vị"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              {UNITS.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Giá"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
              }}
            />
            <TextField
              fullWidth
              label="Số lượng trong kho"
              name="unit_in_stock"
              type="number"
              value={formData.unit_in_stock}
              onChange={handleInputChange}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default MedicineManagement; 