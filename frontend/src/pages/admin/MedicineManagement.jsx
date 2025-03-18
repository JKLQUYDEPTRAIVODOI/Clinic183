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

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: '',
    manufacturer: '',
    expiryDate: '',
  });

  useEffect(() => {
    // TODO: Fetch medicines data from API
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          name: 'Paracetamol',
          description: 'Thuốc giảm đau, hạ sốt',
          price: '50000',
          quantity: '100',
          unit: 'viên',
          manufacturer: 'Dược phẩm ABC',
          expiryDate: '2025-12-31',
        },
        // Add more mock data as needed
      ];
      setMedicines(mockData);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const handleOpen = (medicine = null) => {
    if (medicine) {
      setSelectedMedicine(medicine);
      setFormData(medicine);
    } else {
      setSelectedMedicine(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        unit: '',
        manufacturer: '',
        expiryDate: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedicine(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save/update medicine
      if (selectedMedicine) {
        // Update existing medicine
        setMedicines(medicines.map(medicine =>
          medicine.id === selectedMedicine.id ? { ...medicine, ...formData } : medicine
        ));
      } else {
        // Add new medicine
        const newMedicine = {
          id: medicines.length + 1,
          ...formData,
        };
        setMedicines([...medicines, newMedicine]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Implement API call to delete medicine
      setMedicines(medicines.filter(medicine => medicine.id !== id));
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
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
              onClick={() => handleOpen()}
            >
              Thêm Thuốc
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên thuốc</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Đơn vị</TableCell>
                  <TableCell>Nhà sản xuất</TableCell>
                  <TableCell>Hạn sử dụng</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.description}</TableCell>
                    <TableCell>{medicine.price}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>{medicine.unit}</TableCell>
                    <TableCell>{medicine.manufacturer}</TableCell>
                    <TableCell>{medicine.expiryDate}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(medicine)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(medicine.id)}>
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
          {selectedMedicine ? 'Chỉnh sửa Thuốc' : 'Thêm Thuốc mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tên thuốc"
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
              label="Số lượng"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Đơn vị"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Nhà sản xuất"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Hạn sử dụng"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedMedicine ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicineManagement; 