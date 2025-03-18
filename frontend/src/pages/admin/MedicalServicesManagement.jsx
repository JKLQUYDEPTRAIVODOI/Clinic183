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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const MedicalServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  });

  useEffect(() => {
    // TODO: Fetch services data from API
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          name: 'Khám tổng quát',
          description: 'Khám sức khỏe tổng quát định kỳ',
          price: '200000',
          duration: '30 phút',
          category: 'Khám bệnh',
        },
        // Add more mock data as needed
      ];
      setServices(mockData);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleOpen = (service = null) => {
    if (service) {
      setSelectedService(service);
      setFormData(service);
    } else {
      setSelectedService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save/update service
      if (selectedService) {
        // Update existing service
        setServices(services.map(service =>
          service.id === selectedService.id ? { ...service, ...formData } : service
        ));
      } else {
        // Add new service
        const newService = {
          id: services.length + 1,
          ...formData,
        };
        setServices([...services, newService]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Implement API call to delete service
      setServices(services.filter(service => service.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Dịch vụ Y tế
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Thêm Dịch vụ
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên dịch vụ</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell>{service.duration}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(service)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(service.id)}>
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedService ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tên dịch vụ"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Giá"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: '₫',
              }}
            />
            <TextField
              fullWidth
              label="Thời gian"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Danh mục"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedService ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalServicesManagement; 