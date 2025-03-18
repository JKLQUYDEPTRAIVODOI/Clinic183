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
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StaffManagement = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'active',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch staff data from API
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = [
        {
          id: 1,
          fullName: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          phone: '0123456789',
          role: 'nurse',
          department: 'Nội khoa',
          status: 'active',
        },
        {
          id: 2,
          fullName: 'Trần Thị B',
          email: 'tranthib@example.com',
          phone: '0987654321',
          role: 'receptionist',
          department: 'Lễ tân',
          status: 'active',
        },
      ];
      setStaff(mockData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      showSnackbar('Lỗi khi tải danh sách nhân viên', 'error');
    }
  };

  const handleOpen = (staffMember = null) => {
    if (staffMember) {
      setSelectedStaff(staffMember);
      setFormData(staffMember);
    } else {
      setSelectedStaff(null);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        status: 'active',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStaff(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      status: 'active',
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectedStaff) {
        // TODO: Implement API call to update staff
        setStaff(staff.map(item =>
          item.id === selectedStaff.id ? { ...item, ...formData } : item
        ));
        showSnackbar('Cập nhật thông tin nhân viên thành công');
      } else {
        // TODO: Implement API call to create staff
        const newStaff = {
          id: staff.length + 1,
          ...formData,
        };
        setStaff([...staff, newStaff]);
        showSnackbar('Thêm nhân viên mới thành công');
      }
      handleClose();
    } catch (error) {
      console.error('Error saving staff:', error);
      showSnackbar('Lỗi khi lưu thông tin nhân viên', 'error');
    }
  };

  const handleDelete = async (staffId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        // TODO: Implement API call to delete staff
        setStaff(staff.filter(item => item.id !== staffId));
        showSnackbar('Xóa nhân viên thành công');
      } catch (error) {
        console.error('Error deleting staff:', error);
        showSnackbar('Lỗi khi xóa nhân viên', 'error');
      }
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'nurse':
        return 'Y tá';
      case 'receptionist':
        return 'Lễ tân';
      default:
        return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang làm việc';
      case 'inactive':
        return 'Đã nghỉ việc';
      default:
        return status;
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prevState => ({
      ...prevState,
      open: false,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Quản lý nhân viên
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Thêm nhân viên
          </Button>
        </Grid>

        {/* Staff Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell>{staffMember.fullName}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.phone}</TableCell>
                    <TableCell>{getRoleText(staffMember.role)}</TableCell>
                    <TableCell>{staffMember.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(staffMember.status)}
                        color={getStatusColor(staffMember.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(staffMember)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(staffMember.id)}
                      >
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

      {/* Add/Edit Staff Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStaff ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    label="Vai trò"
                  >
                    <MenuItem value="nurse">Y tá</MenuItem>
                    <MenuItem value="receptionist">Lễ tân</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phòng ban"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Trạng thái"
                  >
                    <MenuItem value="active">Đang làm việc</MenuItem>
                    <MenuItem value="inactive">Đã nghỉ việc</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedStaff ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StaffManagement; 