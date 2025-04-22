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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Add as AddIcon,
  RemoveCircle as RemoveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import invoiceService from '../../services/invoiceService';
import patientService from '../../services/patientService';
import serviceService from '../../services/serviceService';
import medicineService from '../../services/medicineService';
import appointmentService from '../../services/appointmentService';

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientLoading, setPatientLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointmentId: '',
    tax_percent: 10,
    discount_percent: 0,
    payment_method: '',
    paid_amount: 0,
    notes: '',
    items: [{ 
      type: '', 
      id: null, 
      quantity: 1,
      discount_amount: 0,
      unit_price: 0
    }]
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    fetchInvoices();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchPatients();
    fetchServices();
    fetchMedicines();
    fetchAppointments();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoiceService.getAllInvoices(pagination.page, pagination.limit);
      
      if (result.invoices) {
        setInvoices(result.invoices);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Không thể lấy danh sách hóa đơn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      setPatientLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Không thể lấy danh sách bệnh nhân. Vui lòng thử lại sau.');
    } finally {
      setPatientLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Không thể lấy danh sách dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      setMedicinesLoading(true);
      const data = await medicineService.getAllMedicines();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setError('Không thể lấy danh sách thuốc. Vui lòng thử lại sau.');
    } finally {
      setMedicinesLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAllAppointments();
      // Kiểm tra response có tồn tại và là mảng không
      if (response && Array.isArray(response)) {
        // Chỉ lấy các cuộc hẹn đã hoàn thành và chưa có hóa đơn
        const completedAppointments = response.filter(
          app => app.status === 'completed' && !app.has_invoice
        );
        setAppointments(completedAppointments);
      } else {
        console.error('Invalid response format from appointments API');
        setError('Không thể tải danh sách cuộc hẹn: Dữ liệu không hợp lệ');
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.response?.data?.message || 'Không thể tải danh sách cuộc hẹn');
      setAppointments([]);
    }
  };

  const handleEditOpen = (invoice = null) => {
    if (invoice) {
      setSelectedInvoice(invoice);
      
      // Format items for the form
      const formattedItems = invoice.items.map(item => {
        let itemData = {
          type: item.item_type,
          id: item.item_id,
          quantity: item.quantity,
          discount_amount: item.discount_amount,
          unit_price: item.unit_price_at_time,
          name: item.name
        };

        return itemData;
      });

      // Cập nhật form data với đầy đủ thông tin
      setFormData({
        appointmentId: invoice.appointment_id.toString(),
        tax_percent: invoice.tax_percent,
        discount_percent: invoice.discount_percent,
        payment_method: invoice.payment_method,
        paid_amount: invoice.paid_amount,
        notes: invoice.notes || '',
        items: formattedItems,
        total_amount: invoice.total_amount,
        subtotal: invoice.subtotal,
        tax_amount: invoice.tax_amount,
        discount_amount: invoice.discount_amount
      });

      // Cập nhật selected appointment nếu cần
      const appointment = appointments.find(app => app.id === invoice.appointment_id);
      if (appointment) {
        setSelectedAppointment(appointment);
      }
    } else {
      setSelectedInvoice(null);
      setSelectedAppointment(null);
      setFormData({
        appointmentId: '',
        tax_percent: 10,
        discount_percent: 0,
        payment_method: '',
        paid_amount: 0,
        notes: '',
        items: [{ type: '', id: null, quantity: 1, discount_amount: 0, unit_price: 0 }],
        total_amount: 0,
        subtotal: 0,
        tax_amount: 0,
        discount_amount: 0
      });
    }
    setOpen(true);
  };

  const handleDetailsOpen = (invoice) => {
    setSelectedInvoice(invoice);
    setDetailsOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDetailsOpen(false);
    setSelectedInvoice(null);
    setSelectedPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePatientChange = (event, newValue) => {
    setSelectedPatient(newValue);
    if (newValue) {
      setFormData({
        ...formData,
        appointmentId: newValue.appointment_id.toString(),
        patientId: newValue.id.toString(),
        patientName: newValue.patient_name,
        items: [{ type: '', id: null, quantity: 1, discount_amount: 0, unit_price: 0 }]
      });
    } else {
      setFormData({
        ...formData,
        appointmentId: '',
        patientId: '',
        patientName: '',
        items: [{ type: '', id: null, quantity: 1, discount_amount: 0, unit_price: 0 }]
      });
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleServiceChange = async (index, newValue) => {
    const updatedItems = [...formData.items];
    if (newValue) {
      updatedItems[index] = {
        type: 'service',
        id: newValue.id,
        quantity: 1,
        unit_price: newValue.price || 0,
        discount_amount: 0,
        name: newValue.name
      };
    } else {
      updatedItems[index] = {
        type: '',
        id: null,
        quantity: 1,
        unit_price: 0,
        discount_amount: 0,
        name: ''
      };
    }
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleMedicineChange = (index, newValue) => {
    const updatedItems = [...formData.items];
    if (newValue) {
      updatedItems[index] = {
        type: 'medicine',
        id: newValue.id,
        quantity: 1,
        unit_price: newValue.price || 0,
        discount_amount: 0,
        name: newValue.name
      };
    } else {
      updatedItems[index] = {
        type: '',
        id: null,
        quantity: 1,
        unit_price: 0,
        discount_amount: 0,
        name: ''
      };
    }
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { type: '', id: null, quantity: 1, discount_amount: 0, unit_price: 0 }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = [...formData.items];
      updatedItems.splice(index, 1);
      setFormData({
        ...formData,
        items: updatedItems,
      });
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => {
      const itemSubtotal = (item.quantity * item.unit_price) - item.discount_amount;
      return total + itemSubtotal;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = subtotal * (formData.tax_percent / 100);
    const discountAmount = subtotal * (formData.discount_percent / 100);
    return subtotal + taxAmount - discountAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.appointmentId) {
      setError('Vui lòng chọn cuộc hẹn');
      return;
    }

    // Validate items
    const invalidItems = formData.items.filter(item => {
      return !item.id;
    });

    if (invalidItems.length > 0) {
      setError('Vui lòng chọn dịch vụ hoặc thuốc cho tất cả các mục');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const invoiceData = {
        appointment_id: parseInt(formData.appointmentId),
        tax_percent: parseFloat(formData.tax_percent),
        discount_percent: parseFloat(formData.discount_percent),
        payment_method: formData.payment_method,
        paid_amount: parseFloat(formData.paid_amount),
        notes: formData.notes,
        items: formData.items.map(item => ({
          type: item.type,
          id: parseInt(item.id),
          quantity: parseInt(item.quantity),
          discount_amount: parseFloat(item.discount_amount)
        })),
        payment_status: 'pending'
      };

      console.log('Sending invoice data:', invoiceData); // Debug log

      if (selectedInvoice) {
        await invoiceService.updateInvoice(selectedInvoice.id, invoiceData);
      } else {
        await invoiceService.createInvoice(invoiceData);
      }

      fetchInvoices();
      handleClose();
    } catch (error) {
      console.error('Error saving invoice:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message ||
                          'Lỗi khi lưu hóa đơn. Vui lòng thử lại sau.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        setLoading(true);
        await invoiceService.deleteInvoice(id);
        fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        setError('Lỗi khi xóa hóa đơn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      await invoiceService.updateInvoiceStatus(id, newStatus);
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      setError('Lỗi khi cập nhật trạng thái hóa đơn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
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
        return 'Chờ thanh toán';
      case 'cancelled':
        return 'Đã hủy';
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

  // Tìm service object từ serviceId
  const findServiceById = (serviceId) => {
    return services.find(service => service.id === serviceId) || null;
  };

  // Tìm medicine object từ medicineId
  const findMedicineById = (medicineId) => {
    return medicines.find(medicine => medicine.id === medicineId) || null;
  };

  const handleAppointmentChange = (event) => {
    const appointmentId = event.target.value;
    const appointment = appointments.find(app => app.id === appointmentId);
    
    if (appointment) {
      setFormData(prev => ({
        ...prev,
        appointmentId: appointmentId.toString(),
        items: [{ type: '', id: null, quantity: 1, discount_amount: 0, unit_price: 0 }]
      }));
    }
  };

  // Thêm hàm để lấy giá dịch vụ hiện tại
  const fetchServicePrice = async (serviceId) => {
    try {
      const response = await serviceService.getServicePrice(serviceId);
      return response.price;
    } catch (error) {
      console.error('Error fetching service price:', error);
      return 0;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Hóa đơn
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEditOpen()}
            >
              Tạo Hóa đơn mới
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

        {/* Invoices Table */}
        <Grid item xs={12}>
          {loading && <Box display="flex" justifyContent="center" my={3}><CircularProgress /></Box>}
          
          {!loading && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã hóa đơn</TableCell>
                    <TableCell>Bệnh nhân</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Tổng tiền</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>INV-{invoice.id.toString().padStart(4, '0')}</TableCell>
                        <TableCell>{invoice.patient_name}</TableCell>
                        <TableCell>{new Date(invoice.created_at).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(invoice.payment_status)}
                            color={getStatusColor(invoice.payment_status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDetailsOpen(invoice)}
                            title="Xem chi tiết"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditOpen(invoice)}
                            title="Chỉnh sửa"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(invoice.id)}
                            title="Xóa"
                          >
                            <DeleteIcon />
                          </IconButton>
                          {invoice.payment_status === 'pending' && (
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleUpdateStatus(invoice.id, 'paid')}
                              title="Đánh dấu đã thanh toán"
                            >
                              <PrintIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Không có hóa đơn nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              {/* Pagination UI here */}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Edit Invoice Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedInvoice ? 'Chỉnh sửa hóa đơn' : 'Tạo hóa đơn mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {!selectedInvoice && (
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Chọn cuộc hẹn</InputLabel>
                    <Select
                      value={formData.appointmentId}
                      onChange={handleAppointmentChange}
                      required
                    >
                      {appointments.map((appointment) => (
                        <MenuItem key={appointment.id} value={appointment.id}>
                          {`${appointment.patient_name} - ${new Date(appointment.appointment_date).toLocaleDateString()}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phần trăm thuế (%)"
                  type="number"
                  name="tax_percent"
                  value={formData.tax_percent}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 0, max: 100 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phần trăm giảm giá (%)"
                  type="number"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 0, max: 100 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phương thức thanh toán"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  select
                >
                  <MenuItem value="cash">Tiền mặt</MenuItem>
                  <MenuItem value="transfer">Chuyển khoản</MenuItem>
                  <MenuItem value="card">Thẻ</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số tiền đã trả"
                  type="number"
                  name="paid_amount"
                  value={formData.paid_amount}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={1}>
                  <Typography variant="h6">Chi tiết các mục</Typography>
                  <Button 
                    startIcon={<AddIcon />} 
                    onClick={addItem}
                    variant="outlined"
                    size="small"
                  >
                    Thêm mục
                  </Button>
                </Box>
                
                {formData.items.map((item, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel>Loại</InputLabel>
                            <Select
                              value={item.type || ''}
                              onChange={(e) => {
                                const updatedItems = [...formData.items];
                                updatedItems[index] = {
                                  type: e.target.value,
                                  id: null,
                                  quantity: 1,
                                  unit_price: 0,
                                  discount_amount: 0,
                                  name: ''
                                };
                                setFormData({
                                  ...formData,
                                  items: updatedItems,
                                });
                              }}
                            >
                              <MenuItem value="">Chọn loại</MenuItem>
                              <MenuItem value="service">Dịch vụ</MenuItem>
                              <MenuItem value="medicine">Thuốc</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          {item.type === 'service' && (
                            <Autocomplete
                              options={services}
                              loading={servicesLoading}
                              getOptionLabel={(option) => `${option.name} - ${formatCurrency(option.price)}`}
                              value={services.find(s => s.id === item.id) || null}
                              onChange={(event, newValue) => handleServiceChange(index, newValue)}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  label="Chọn dịch vụ"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {servicesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                          )}
                          {item.type === 'medicine' && (
                            <Autocomplete
                              options={medicines}
                              loading={medicinesLoading}
                              getOptionLabel={(option) => `${option.name} - ${formatCurrency(option.price)}`}
                              value={medicines.find(m => m.id === item.id) || null}
                              onChange={(event, newValue) => handleMedicineChange(index, newValue)}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  label="Chọn thuốc"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {medicinesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                          )}
                          
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            label="Số lượng"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            InputProps={{
                              inputProps: { min: 1 }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            label="Giảm giá"
                            type="number"
                            value={item.discount_amount}
                            onChange={(e) => handleItemChange(index, 'discount_amount', parseFloat(e.target.value))}
                            InputProps={{
                              inputProps: { min: 0 }
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Typography>
                            Đơn giá: {formatCurrency(item.unit_price)}
                          </Typography>
                          <Typography>
                            Thành tiền: {formatCurrency((item.quantity * item.unit_price) - item.discount_amount)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={1}>
                          <IconButton 
                            color="error" 
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length === 1}
                            title="Xóa mục này"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Typography variant="h6">
                    Tổng cộng: {formatCurrency(calculateTotal())}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="subtitle1">
                    Tổng tiền hàng: {formatCurrency(calculateSubtotal())}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">
                    Thuế ({formData.tax_percent}%): {formatCurrency(calculateSubtotal() * formData.tax_percent / 100)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">
                    Giảm giá ({formData.discount_percent}%): {formatCurrency(calculateSubtotal() * formData.discount_percent / 100)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">
                    Tổng cộng: {formatCurrency(calculateTotal())}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" color={formData.paid_amount >= calculateTotal() ? 'success.main' : 'error.main'}>
                    {formData.paid_amount >= calculateTotal() ? 'Đã thanh toán đủ' : 'Chưa thanh toán đủ'}
                  </Typography>
                  <Typography variant="subtitle1">
                    Còn lại: {formatCurrency(calculateTotal() - formData.paid_amount)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : selectedInvoice ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết Hóa đơn</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    Mã hóa đơn: INV-{selectedInvoice.id.toString().padStart(4, '0')}
                  </Typography>
                  <Typography variant="subtitle1">
                    Ngày tạo: {new Date(selectedInvoice.created_at).toLocaleDateString('vi-VN')}
                  </Typography>
                  <Typography variant="subtitle1">
                    Phương thức thanh toán: {
                      selectedInvoice.payment_method === 'cash' ? 'Tiền mặt' :
                      selectedInvoice.payment_method === 'transfer' ? 'Chuyển khoản' :
                      selectedInvoice.payment_method === 'card' ? 'Thẻ' : 'Không xác định'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    Bệnh nhân: {selectedInvoice.patient_name}
                  </Typography>
                  <Typography variant="subtitle1">
                    Trạng thái: 
                    <Chip
                      label={getStatusText(selectedInvoice.payment_status)}
                      color={getStatusColor(selectedInvoice.payment_status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  {selectedInvoice.payment_status === 'paid' && (
                    <Typography variant="subtitle1">
                      Ngày thanh toán: {new Date(selectedInvoice.payment_date).toLocaleDateString('vi-VN')}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Chi tiết các mục
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="right">Giảm giá</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unit_price_at_time)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.discount_amount)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tổng tiền hàng:</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Thuế ({selectedInvoice.tax_percent}%):</span>
                  <span>{formatCurrency(selectedInvoice.tax_amount)}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Giảm giá ({selectedInvoice.discount_percent}%):</span>
                  <span>{formatCurrency(selectedInvoice.discount_amount)}</span>
                </Typography>
                <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(selectedInvoice.total_amount)}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Đã trả:</span>
                  <span>{formatCurrency(selectedInvoice.paid_amount)}</span>
                </Typography>
                <Typography variant="subtitle1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Còn lại:</span>
                  <span>{formatCurrency(selectedInvoice.total_amount - selectedInvoice.paid_amount)}</span>
                </Typography>
              </Box>

              {selectedInvoice.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">
                    Ghi chú: {selectedInvoice.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.print()}
          >
            In hóa đơn
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InvoiceManagement; 