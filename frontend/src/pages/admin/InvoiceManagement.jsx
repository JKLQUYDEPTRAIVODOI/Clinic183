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
    patientName: '',
    patientId: '',
    invoiceDate: '',
    status: 'pending',
    items: [{ name: '', amount: '', serviceId: null, medicineId: null }],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

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

  const handleEditOpen = (invoice = null) => {
    if (invoice) {
      setSelectedInvoice(invoice);
      
      // Format items for the form
      const formattedItems = invoice.items.map(item => {
        // Tìm dịch vụ tương ứng nếu có
        const matchedService = services.find(service => 
          service.name.toLowerCase() === item.name.toLowerCase() &&
          service.price === item.price
        );
        
        // Tìm thuốc tương ứng nếu có
        const matchedMedicine = medicines.find(medicine => 
          medicine.name.toLowerCase() === item.name.toLowerCase() &&
          medicine.price === item.price
        );
        
        return {
          name: item.name,
          amount: item.price.toString(),
          serviceId: matchedService ? matchedService.id : null,
          medicineId: matchedMedicine ? matchedMedicine.id : null
        };
      });
      
      setFormData({
        patientName: invoice.patient_name,
        patientId: invoice.patient_id.toString(),
        invoiceDate: invoice.created_at.split('T')[0],
        status: invoice.payment_status,
        items: formattedItems.length > 0 ? formattedItems : [{ name: '', amount: '', serviceId: null, medicineId: null }],
      });

      // Find patient in list
      const patient = patients.find(p => p.id === invoice.patient_id);
      setSelectedPatient(patient || null);
    } else {
      setSelectedInvoice(null);
      setSelectedPatient(null);
      setFormData({
        patientName: '',
        patientId: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        items: [{ name: 'Khám bệnh', amount: '', serviceId: null, medicineId: null }],
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
        patientName: newValue.name,
        patientId: newValue.id.toString(),
      });
    } else {
      setFormData({
        ...formData,
        patientName: '',
        patientId: '',
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

  const handleServiceChange = (index, newValue) => {
    const updatedItems = [...formData.items];
    if (newValue) {
      updatedItems[index] = {
        name: newValue.name,
        amount: newValue.price.toString(),
        serviceId: newValue.id
      };
    } else {
      // Giữ nguyên tên nếu đã có, chỉ xóa giá và ID
      updatedItems[index] = {
        ...updatedItems[index],
        amount: '',
        serviceId: null
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
        name: newValue.name,
        amount: newValue.price.toString(),
        serviceId: null,
        medicineId: newValue.id
      };
    } else {
      // Giữ nguyên tên nếu đã có, chỉ xóa giá và ID
      updatedItems[index] = {
        ...updatedItems[index],
        amount: '',
        medicineId: null
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
      items: [...formData.items, { name: '', amount: '', serviceId: null, medicineId: null }],
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

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const amount = item.amount ? parseInt(item.amount) : 0;
      return total + amount;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.patientId || !formData.patientName || !formData.invoiceDate || 
        formData.items.some(item => !item.name || !item.amount)) {
      alert('Vui lòng điền đầy đủ thông tin cần thiết');
      return;
    }
    
    // Prepare data for API
    const invoiceData = {
      patientId: parseInt(formData.patientId),
      patientName: formData.patientName,
      totalAmount: calculateTotal(),
      paymentStatus: formData.status,
      items: formData.items.map(item => ({
        name: item.name,
        amount: parseInt(item.amount) || 0,
        serviceId: item.serviceId ? parseInt(item.serviceId) : null,
        medicineId: item.medicineId ? parseInt(item.medicineId) : null
      }))
    };
    
    try {
      setLoading(true);
      
      if (selectedInvoice) {
        // Update existing invoice
        await invoiceService.updateInvoice(selectedInvoice.id, invoiceData);
      } else {
        // Create new invoice
        await invoiceService.createInvoice(invoiceData);
      }
      
      // Refresh invoices list
      fetchInvoices();
      handleClose();
    } catch (error) {
      console.error('Error saving invoice:', error);
      setError('Lỗi khi lưu hóa đơn. Vui lòng thử lại sau.');
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
          {selectedInvoice ? 'Chỉnh sửa Hóa đơn' : 'Tạo Hóa đơn mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={patients}
                  loading={patientLoading}
                  getOptionLabel={(option) => `${option.name} - ${option.phone || 'Không có SĐT'}`}
                  value={selectedPatient}
                  onChange={handlePatientChange}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Chọn bệnh nhân"
                      margin="normal"
                      required
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {patientLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày tạo hóa đơn"
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="pending">Chờ thanh toán</MenuItem>
                    <MenuItem value="paid">Đã thanh toán</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
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
                          <Autocomplete
                            options={services}
                            loading={servicesLoading}
                            getOptionLabel={(option) => `${option.name} - ${formatCurrency(option.price)}`}
                            value={item.serviceId ? findServiceById(item.serviceId) : null}
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
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Autocomplete
                            options={medicines}
                            loading={medicinesLoading}
                            getOptionLabel={(option) => `${option.name} - ${formatCurrency(option.price)}`}
                            value={item.medicineId ? findMedicineById(item.medicineId) : null}
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
                        </Grid>
                        {!item.serviceId && !item.medicineId && (
                          <Grid item xs={12} md={8}>
                            <TextField
                              fullWidth
                              label="Tên dịch vụ/sản phẩm"
                              value={item.name}
                              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                              required
                              margin="normal"
                            />
                          </Grid>
                        )}
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Số tiền (VNĐ)"
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                            required
                            disabled={item.serviceId !== null || item.medicineId !== null}
                            InputProps={{
                              inputProps: { min: 0 }
                            }}
                          />
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
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Chi tiết các mục
              </Typography>

              <List>
                {selectedInvoice.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={formatCurrency(item.price)}
                      />
                    </ListItem>
                    {index < selectedInvoice.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Tổng cộng:</Typography>
                <Typography variant="h6">
                  {formatCurrency(selectedInvoice.total_amount)}
                </Typography>
              </Box>

              {selectedInvoice.payment_status === 'paid' && selectedInvoice.payment_date && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">
                    Ngày thanh toán: {new Date(selectedInvoice.payment_date).toLocaleDateString('vi-VN')}
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