import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Typography,
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
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LockReset as LockResetIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import Button from '../../components/UI/Button';
import userService from '../../services/userService';

const UserManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'patient',
    password: '',
    confirmPassword: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Lấy tất cả users
      const response = await userService.getAllUsers();
      
      // Lọc theo role nếu không phải "all"
      let filteredUsers = response;
      if (selectedRole !== 'all') {
        filteredUsers = response.filter(user => user.role === selectedRole);
      }

      // Lọc theo search term nếu có
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower)
        );
      }

      // Phân trang
      const start = page * rowsPerPage;
      const paginatedUsers = filteredUsers.slice(start, start + rowsPerPage);

      setUsers(paginatedUsers);
      setTotalRows(filteredUsers.length);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(debounce);
  }, [page, rowsPerPage, selectedRole, searchTerm]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setPage(0);
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
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, formData);
      } else {
        await userService.createUser(formData);
      }
      
      // Đóng dialog và refresh data
      handleClose();
      await fetchUsers(); // Refresh danh sách người dùng
      setError(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Không thể lưu thông tin người dùng. Vui lòng thử lại.');
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

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        setLoading(true);
        await userService.deleteUser(userId);
        // Refresh danh sách người dùng sau khi xóa
        await fetchUsers();
        setError(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Không thể xóa người dùng. Vui lòng thử lại.');
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Quản lý người dùng
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm người dùng
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          sx={{ flex: 1 }}
          placeholder="Tìm kiếm theo tên hoặc email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            label="Vai trò"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="admin">Quản trị viên</MenuItem>
            <MenuItem value="doctor">Bác sĩ</MenuItem>
            <MenuItem value="patient">Bệnh nhân</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '170%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="30%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Tên</TableCell>
                  <TableCell width="45%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Email</TableCell>
                  <TableCell width="30%" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Vai trò</TableCell>
                  <TableCell width="30%" align="right" sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell width="30%">{user.name}</TableCell>
                    <TableCell width="35%">{user.email}</TableCell>
                    <TableCell width="20%">{getRoleText(user.role)}</TableCell>
                    <TableCell width="15%" align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpen(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleResetPasswordOpen(user)}
                        >
                          <LockResetIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count}`
            }
          />
        </Paper>
      )}

      {/* Dialog for Add/Edit User */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
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
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for Reset Password */}
      <Dialog open={resetPasswordOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Đặt lại mật khẩu</DialogTitle>
        <form onSubmit={handleResetPassword}>
          <DialogContent>
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
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;