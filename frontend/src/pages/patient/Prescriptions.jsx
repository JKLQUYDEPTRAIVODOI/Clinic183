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
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Prescriptions = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('patient')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch prescriptions data from API
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = [
        {
          id: 1,
          date: '2024-03-20',
          doctorName: 'Dr. John Doe',
          specialization: 'Nội khoa',
          diagnosis: 'Viêm họng cấp',
          medicines: [
            { name: 'Paracetamol', dosage: '500mg', frequency: '3 lần/ngày', duration: '5 ngày' },
            { name: 'Vitamin C', dosage: '1000mg', frequency: '1 lần/ngày', duration: '7 ngày' },
          ],
          notes: 'Uống thuốc sau khi ăn',
          status: 'active',
        },
        {
          id: 2,
          date: '2024-03-15',
          doctorName: 'Dr. Jane Smith',
          specialization: 'Tim mạch',
          diagnosis: 'Tăng huyết áp',
          medicines: [
            { name: 'Amlodipine', dosage: '5mg', frequency: '1 lần/ngày', duration: '30 ngày' },
          ],
          notes: 'Uống thuốc vào buổi sáng',
          status: 'completed',
        },
      ];
      setPrescriptions(mockData);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleOpen = (prescription) => {
    setSelectedPrescription(prescription);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPrescription(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang sử dụng';
      case 'completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h1">
            Đơn thuốc
          </Typography>
        </Grid>

        {/* Prescriptions Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày kê đơn</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Chuyên khoa</TableCell>
                  <TableCell>Chẩn đoán</TableCell>
                  <TableCell>Số loại thuốc</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{prescription.date}</TableCell>
                    <TableCell>{prescription.doctorName}</TableCell>
                    <TableCell>{prescription.specialization}</TableCell>
                    <TableCell>{prescription.diagnosis}</TableCell>
                    <TableCell>{prescription.medicines.length}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(prescription.status)}
                        color={getStatusColor(prescription.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
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
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Prescription Detail Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết đơn thuốc</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box sx={{ width: '100%' }}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Ngày kê đơn"
                    secondary={selectedPrescription.date}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Bác sĩ"
                    secondary={`${selectedPrescription.doctorName} - ${selectedPrescription.specialization}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Chẩn đoán"
                    secondary={selectedPrescription.diagnosis}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Ghi chú"
                    secondary={selectedPrescription.notes}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Danh sách thuốc" />
                </ListItem>
                {selectedPrescription.medicines.map((medicine, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemText
                        primary={medicine.name}
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                              Liều lượng: {medicine.dosage}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              Tần suất: {medicine.frequency}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              Thời gian: {medicine.duration}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < selectedPrescription.medicines.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Prescriptions; 