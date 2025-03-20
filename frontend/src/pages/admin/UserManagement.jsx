import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
  IconButton,
  Chip,
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LockReset as LockResetIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'patient',
    password: '',
    confirmPassword: '',
    status: 'active',
  });

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch users data from API
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on selected tab
    if (tabValue === 0) {
      setFilteredUsers(users); // All users
    } else {
      const roles = ['all', 'admin', 'doctor', 'patient'];
      setFilteredUsers(users.filter(user => user.role === roles[tabValue]));
    }
  }, [tabValue, users]);

  const fetchUsers = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = [
        {
          id: 1,
          name: 'Admin System',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-03-19 14:30',
          createdAt: '2024-01-01',
        },
        {
          id: 2,
          name: 'Bác sĩ Nguyễn Văn A',
          email: 'doctor1@example.com',
          role: 'doctor',
          status: 'active',
          specialization: 'Nội khoa',
          lastLogin: '2024-03-20 08:15',
          createdAt: '2024-01-15',
        },
        {
          id: 3,
          name: 'Bác sĩ Trần Thị B',
          email: 'doctor2@example.com',
          role: 'doctor',
          status: 'active',
          specialization: 'Nhi khoa',
          lastLogin: '2024-03-19 10:45',
          createdAt: '2024-01-20',
        },
        {
          id: 4,
          name: 'Nguyễn Văn C',
          email: 'patient1@example.com',
          role: 'patient',
          status: 'active',
          lastLogin: '2024-03-18 16:20',
          createdAt: '2024-02-05',
        },
        {
          id: 5,
          name: 'Trần Thị D',
          email: 'patient2@example.com',
          role: 'patient',
          status: 'inactive',
          lastLogin: '2024-03-10 09:30',
          createdAt: '2024-02-10',
        },
      ];
      setUsers(mockData);
      setFilteredUsers(mockData);
    } catch (error) {
      console.error('Error fetching users:', error);
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
        status: user.status,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'patient',
        password: '',
        confirmPassword: '',
        status: 'active',
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to create or update user
    if (selectedUser) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, name: formData.name, email: formData.email, role: formData.role, status: formData.status }
          : user
      );
      setUsers(updatedUsers);
    } else {
      // Create new user
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        lastLogin: '-',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }
    handleClose();
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // TODO: Implement API call to reset password
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    alert(`Đã đặt lại mật khẩu cho người dùng: ${selectedUser.name}`);
    handleClose();
  };

  const handleDelete = (id) => {
    // TODO: Implement API call to delete user
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
    }
  };

  const handleToggleStatus = (id) => {
    // TODO: Implement API call to toggle user status
    const updatedUsers = users.map((user) =>
      user.id === id
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    );
    setUsers(updatedUsers);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Bị khóa';
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'doctor':
        return 'primary';
      case 'patient':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Quản lý Người dùng
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Thêm Người dùng
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Tất cả" />
              <Tab label="Quản trị viên" />
              <Tab label="Bác sĩ" />
              <Tab label="Bệnh nhân" />
            </Tabs>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Đăng nhập cuối</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleText(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(user.status)}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpen(user)}
                        title="Chỉnh sửa"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleResetPasswordOpen(user)}
                        title="Đặt lại mật khẩu"
                      >
                        <LockResetIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={user.status === 'active' ? 'error' : 'success'}
                        onClick={() => handleToggleStatus(user.id)}
                        title={user.status === 'active' ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                      >
                        {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(user.id)}
                        title="Xóa"
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

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ tên"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  margin="normal"
                  required
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
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="admin">Quản trị viên</MenuItem>
                    <MenuItem value="doctor">Bác sĩ</MenuItem>
                    <MenuItem value="patient">Bệnh nhân</MenuItem>
                  </Select>
                </FormControl>
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
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="inactive">Bị khóa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {!selectedUser && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mật khẩu"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      margin="normal"
                      required
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedUser ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Đặt lại mật khẩu</DialogTitle>
        <form onSubmit={handleResetPassword}>
          <DialogContent>
            {selectedUser && (
              <Typography variant="subtitle1" gutterBottom>
                Đặt lại mật khẩu cho: {selectedUser.name} ({selectedUser.email})
              </Typography>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              Đặt lại mật khẩu
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default UserManagement; 