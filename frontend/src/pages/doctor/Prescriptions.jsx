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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    notes: '',
  });

  useEffect(() => {
    // TODO: Fetch prescriptions data from API
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          patientId: 1,
          patientName: 'John Doe',
          date: '2024-03-20',
          diagnosis: 'Cảm cúm',
          medicines: [
            { name: 'Paracetamol', dosage: '500mg', frequency: '3 lần/ngày', duration: '5 ngày' },
            { name: 'Vitamin C', dosage: '1000mg', frequency: '2 lần/ngày', duration: '7 ngày' },
          ],
          notes: 'Uống thuốc sau khi ăn',
        },
        // Add more mock data as needed
      ];
      setPrescriptions(mockData);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleOpen = (prescription = null) => {
    if (prescription) {
      setSelectedPrescription(prescription);
      setFormData(prescription);
    } else {
      setSelectedPrescription(null);
      setFormData({
        patientId: '',
        patientName: '',
        date: '',
        diagnosis: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPrescription(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save/update prescription
      if (selectedPrescription) {
        // Update existing prescription
        setPrescriptions(prescriptions.map(prescription =>
          prescription.id === selectedPrescription.id ? { ...prescription, ...formData } : prescription
        ));
      } else {
        // Add new prescription
        const newPrescription = {
          id: prescriptions.length + 1,
          ...formData,
        };
        setPrescriptions([...prescriptions, newPrescription]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '' }],
    });
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      medicines: newMedicines,
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...formData.medicines];
    newMedicines[index] = {
      ...newMedicines[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      medicines: newMedicines,
    });
  };

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
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bệnh nhân</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Chẩn đoán</TableCell>
                  <TableCell>Số loại thuốc</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{prescription.patientName}</TableCell>
                    <TableCell>{prescription.date}</TableCell>
                    <TableCell>{prescription.diagnosis}</TableCell>
                    <TableCell>{prescription.medicines.length}</TableCell>
                    <TableCell>{prescription.notes}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpen(prescription)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPrescription ? 'Chi tiết Đơn thuốc' : 'Thêm Đơn thuốc mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Bệnh nhân"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Ngày"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Chẩn đoán"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              margin="normal"
              required
            />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Danh sách thuốc
            </Typography>
            {formData.medicines.map((medicine, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1">Thuốc {index + 1}</Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveMedicine(index)}
                    disabled={formData.medicines.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tên thuốc"
                      value={medicine.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Liều lượng"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tần suất"
                      value={medicine.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Thời gian"
                      value={medicine.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddMedicine}
              sx={{ mb: 2 }}
            >
              Thêm Thuốc
            </Button>

            <TextField
              fullWidth
              label="Ghi chú"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedPrescription ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Prescriptions; 