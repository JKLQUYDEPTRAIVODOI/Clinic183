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

const Bills = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [bills, setBills] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('patient')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch bills data from API
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = [
        {
          id: 1,
          date: '2024-03-20',
          appointmentId: 'APT001',
          doctorName: 'Dr. John Doe',
          specialization: 'Nội khoa',
          items: [
            { name: 'Khám bệnh', amount: 200000 },
            { name: 'Xét nghiệm máu', amount: 150000 },
            { name: 'Thuốc', amount: 350000 },
          ],
          totalAmount: 700000,
          status: 'pending',
          paymentMethod: '',
          paymentDate: '',
        },
        {
          id: 2,
          date: '2024-03-15',
          appointmentId: 'APT002',
          doctorName: 'Dr. Jane Smith',
          specialization: 'Tim mạch',
          items: [
            { name: 'Khám bệnh', amount: 300000 },
            { name: 'Điện tâm đồ', amount: 250000 },
            { name: 'Thuốc', amount: 450000 },
          ],
          totalAmount: 1000000,
          status: 'paid',
          paymentMethod: 'Thẻ tín dụng',
          paymentDate: '2024-03-15',
        },
      ];
      setBills(mockData);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const handleOpen = (bill) => {
    setSelectedBill(bill);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBill(null);
  };

  const handlePayment = async (billId) => {
    try {
      // TODO: Implement payment processing
      // For now, just update the status
      setBills(bills.map(bill =>
        bill.id === billId ? {
          ...bill,
          status: 'paid',
          paymentMethod: 'Online Banking',
          paymentDate: new Date().toISOString().split('T')[0],
        } : bill
      ));
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'overdue':
        return 'Quá hạn';
      default:
        return status;
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
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h1">
            Hóa đơn
          </Typography>
        </Grid>

        {/* Bills Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Mã cuộc hẹn</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Chuyên khoa</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell>{bill.appointmentId}</TableCell>
                    <TableCell>{bill.doctorName}</TableCell>
                    <TableCell>{bill.specialization}</TableCell>
                    <TableCell>{formatCurrency(bill.totalAmount)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(bill.status)}
                        color={getStatusColor(bill.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(bill)}
                        sx={{ mr: 1 }}
                      >
                        Chi tiết
                      </Button>
                      {bill.status === 'pending' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handlePayment(bill.id)}
                        >
                          Thanh toán
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Bill Detail Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết hóa đơn</DialogTitle>
        <DialogContent>
          {selectedBill && (
            <Box sx={{ width: '100%' }}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Ngày"
                    secondary={selectedBill.date}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Mã cuộc hẹn"
                    secondary={selectedBill.appointmentId}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Bác sĩ"
                    secondary={`${selectedBill.doctorName} - ${selectedBill.specialization}`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Chi tiết" />
                </ListItem>
                {selectedBill.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={formatCurrency(item.amount)}
                      />
                    </ListItem>
                    {index < selectedBill.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tổng tiền"
                    secondary={formatCurrency(selectedBill.totalAmount)}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Trạng thái"
                    secondary={getStatusText(selectedBill.status)}
                  />
                </ListItem>
                {selectedBill.status === 'paid' && (
                  <>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Phương thức thanh toán"
                        secondary={selectedBill.paymentMethod}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Ngày thanh toán"
                        secondary={selectedBill.paymentDate}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          {selectedBill && selectedBill.status === 'pending' && (
            <Button
              onClick={() => handlePayment(selectedBill.id)}
              variant="contained"
              color="primary"
            >
              Thanh toán
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bills; 