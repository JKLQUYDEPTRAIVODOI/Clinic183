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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import serviceService from '../../services/serviceService';

const ServiceManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await serviceService.getAllServices(); // Bây giờ sẽ hoạt động
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Không thể lấy danh sách dịch vụ');
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, []);

  const searchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (searchTerm) {
        data = await serviceService.searchServices(searchTerm);
      } else {
        data = await serviceService.getAllServices();
      }
      setServices(data);
    } catch (error) {
      console.error('Error searching services:', error);
      setError('Không thể tìm kiếm dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (service = null) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        name: service.name,
        description: service.description || '',
        price: service.price.toString(),
      });
    } else {
      setSelectedService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
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
      searchServices();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.price) {
      alert('Vui lòng điền đầy đủ tên và giá dịch vụ');
      return;
    }

    // Validate price is a number
    if (isNaN(parseFloat(formData.price))) {
      alert('Giá dịch vụ phải là số');
      return;
    }

    try {
      setLoading(true);

      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
      };

      if (selectedService) {
        // Update existing service
        await serviceService.updateService(selectedService.id, serviceData);
      } else {
        // Create new service
        await serviceService.createService(serviceData);
      }

      // Refresh services list
      fetchServices();
      handleClose();
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Lỗi khi lưu dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        setLoading(true);
        await serviceService.deleteService(id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        setError('Lỗi khi xóa dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
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
              Quản lý Dịch vụ
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleEditOpen()}
            >
              Thêm Dịch vụ mới
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
              label="Tìm kiếm dịch vụ"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={searchServices} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        </Grid>

        {/* Services Table */}
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
                    {/* <TableCell>ID</TableCell> */}
                    <TableCell>Tên dịch vụ</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <TableRow key={service.id}>
                        {/* <TableCell>{service.id}</TableCell> */}
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.description || 'Không có mô tả'}</TableCell>
                        <TableCell>{formatCurrency(service.price)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditOpen(service)}
                            title="Chỉnh sửa"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(service.id)}
                            title="Xóa"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Không có dịch vụ nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

      {/* Edit/Add Service Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedService ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên dịch vụ"
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
              fullWidth
              label="Giá (VNĐ)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                inputProps: { min: 0 },
              }}
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

export default ServiceManagement; 