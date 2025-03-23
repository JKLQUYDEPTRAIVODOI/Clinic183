import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import invoiceService from '../../services/invoiceService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';

const Invoices = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (!hasRole('patient')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getMyInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Không thể tải danh sách hóa đơn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedInvoice(null);
    setOpenDialog(false);
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
  };

  const formatTime = (time) => {
    return format(new Date(`2000-01-01T${time}`), 'HH:mm', { locale: vi });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
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
        return 'Chưa thanh toán';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
        }}
      >
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ReceiptIcon sx={{ mr: 2, color: '#1a237e', fontSize: 32 }} />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: '#1a237e',
                  fontWeight: 600
                }}
              >
                Hóa đơn
              </Typography>
            </Box>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {/* Invoices Table */}
          <Grid item xs={12}>
            {invoices.length === 0 ? (
              <Alert severity="info">Chưa có hóa đơn nào.</Alert>
            ) : (
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Ngày khám</TableCell>
                      <TableCell>Bác sĩ</TableCell>
                      <TableCell align="right">Tổng tiền</TableCell>
                      <TableCell align="center">Trạng thái</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id} hover>
                        <TableCell>
                          {formatDate(invoice.appointment_date)}{' '}
                          {formatTime(invoice.appointment_time)}
                        </TableCell>
                        <TableCell>{invoice.doctor_name}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(invoice.total_amount)}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getStatusText(invoice.payment_status)}
                            color={getStatusColor(invoice.payment_status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleOpenDialog(invoice)}
                            sx={{ 
                              textTransform: 'none',
                              borderRadius: 2
                            }}
                          >
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Invoice Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="div" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Chi tiết hóa đơn
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ mt: 2 }}>
              {/* Basic Information */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                      Thông tin chung
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Ngày khám:
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(selectedInvoice.appointment_date)}{' '}
                          {formatTime(selectedInvoice.appointment_time)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Bác sĩ:
                        </Typography>
                        <Typography variant="body1">
                          {selectedInvoice.doctor_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Invoice Items */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                      Chi tiết
                    </Typography>
                    <List>
                      {selectedInvoice.items?.map((item, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {item.item_type === 'service' ? (
                                    <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                                  ) : (
                                    <MedicationIcon sx={{ mr: 1, color: 'primary.main' }} />
                                  )}
                                  <Box>
                                    <Typography variant="subtitle2">
                                      {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {item.item_type === 'service' ? 'Dịch vụ' : 'Thuốc'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="body2">
                                    {item.quantity} x {formatCurrency(item.unit_price_at_time)}
                                  </Typography>
                                  <Typography variant="subtitle2" color="primary">
                                    {formatCurrency(item.quantity * item.unit_price_at_time - (item.discount_amount || 0))}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </ListItem>
                          {index < selectedInvoice.items.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>

                {/* Payment Information */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                      Thanh toán
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">Tạm tính:</Typography>
                          <Typography variant="body1">{formatCurrency(selectedInvoice.subtotal)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">Thuế ({selectedInvoice.tax_percent}%):</Typography>
                          <Typography variant="body1">{formatCurrency(selectedInvoice.tax_amount)}</Typography>
                        </Box>
                        {selectedInvoice.discount_amount > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">Giảm giá ({selectedInvoice.discount_percent}%):</Typography>
                            <Typography variant="body1" color="error">
                              -{formatCurrency(selectedInvoice.discount_amount)}
                            </Typography>
                          </Box>
                        )}
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Tổng cộng:
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {formatCurrency(selectedInvoice.total_amount)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2" color="text.secondary">
                              Phương thức thanh toán: {selectedInvoice.payment_method || 'Chưa có'}
                            </Typography>
                          </Box>
                          <Chip
                            label={getStatusText(selectedInvoice.payment_status)}
                            color={getStatusColor(selectedInvoice.payment_status)}
                            size="small"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Invoices; 