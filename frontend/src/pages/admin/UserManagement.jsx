import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LockReset as LockResetIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';

const UserManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'patient',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      setFilteredUsers(users);
    } else {
      const roles = ['all', 'admin', 'doctor', 'patient'];
      setFilteredUsers(users.filter(user => user.role === roles[tabValue]));
    }
  }, [tabValue, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setError('Không thể tải danh sách người dùng');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpen = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        confirmPassword: '',
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'patient',
        password: '',
        confirmPassword: '',
      });
    }
    setOpen(true);
  };

  const handleResetPasswordOpen = (user) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      password: '',
      confirmPassword: '',
    });
    setResetPasswordOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setResetPasswordOpen(false);
    setSelectedUser(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (selectedUser) {
        await userService.updateUser(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu không khớp');
          return;
        }
        await userService.createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        });
      }
      
      await fetchUsers();
      handleClose();
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu không khớp');
        return;
      }

      await userService.resetPassword(selectedUser.id, formData.password);
      handleClose();
    } catch (error) {
      setError(error.message || 'Không thể đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        setLoading(true);
        setError(null);
        await userService.deleteUser(id);
        await fetchUsers();
      } catch (error) {
        setError('Không thể xóa người dùng');
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'doctor':
        return 'Bác sĩ';
      case 'patient':
        return 'Bệnh nhân';
      default:
        return role;
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Quản lý người dùng
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 100,
                  fontSize: '1rem',
                  fontWeight: 'normal',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 'bold',
                  },
                },
              }}
            >
              <Tab label="TẤT CẢ" />
              <Tab label="QUẢN TRỊ VIÊN" />
              <Tab label="BÁC SĨ" />
              <Tab label="BỆNH NHÂN" />
            </Tabs>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 1,
              }}
            >
              THÊM NGƯỜI DÙNG
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: { xs: '20%', sm: '25%' } }}>
                    Tên
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: { xs: '30%', sm: '35%' } }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: { xs: '20%', sm: '20%' } }}>
                    Vai trò
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 'bold', fontSize: '1rem', width: { xs: '30%', sm: '20%' } }}
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ width: { xs: '20%', sm: '25%' } }}>{user.name}</TableCell>
                    <TableCell sx={{ width: { xs: '30%', sm: '35%' } }}>{user.email}</TableCell>
                    <TableCell sx={{ width: { xs: '20%', sm: '20%' } }}>{getRoleText(user.role)}</TableCell>
                    <TableCell align="right" sx={{ width: { xs: '30%', sm: '20%' } }}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton onClick={() => handleOpen(user)} color="primary" size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Đặt lại mật khẩu">
                        <IconButton onClick={() => handleResetPasswordOpen(user)} color="warning" size="small">
                          <LockResetIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton onClick={() => handleDelete(user.id)} color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog for Add/Edit User */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pb: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="dense"
              label="Tên"
              type="text"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Vai trò"
                required
              >
                <MenuItem value="admin">Quản trị viên</MenuItem>
                <MenuItem value="doctor">Bác sĩ</MenuItem>
                <MenuItem value="patient">Bệnh nhân</MenuItem>
              </Select>
            </FormControl>
            {!selectedUser && (
              <>
                <TextField
                  margin="dense"
                  label="Mật khẩu"
                  type="password"
                  fullWidth
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Xác nhận mật khẩu"
                  type="password"
                  fullWidth
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleClose}
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for Reset Password */}
      <Dialog open={resetPasswordOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>Đặt lại mật khẩu</DialogTitle>
        <form onSubmit={handleResetPassword}>
          <DialogContent sx={{ pb: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="dense"
              label="Mật khẩu mới"
              type="password"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Xác nhận mật khẩu mới"
              type="password"
              fullWidth
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleClose}
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ 
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default UserManagement;