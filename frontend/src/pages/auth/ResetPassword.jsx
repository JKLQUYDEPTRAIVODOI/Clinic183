import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Lấy token từ URL query params
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    if (!resetToken) {
      setError('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      return;
    }
    setToken(resetToken);
  }, [location]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }

    try {
      // TODO: Implement API call to reset password
      // For now, just simulate API call
      console.log('Resetting password with token:', token);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại sau.');
    }
  };

  if (isSubmitted) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Đặt lại mật khẩu thành công!
            </Typography>
            <Typography align="center" color="text.secondary" paragraph>
              Mật khẩu của bạn đã được đặt lại thành công.
              Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Đăng nhập
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Đặt lại mật khẩu
          </Typography>
          <Typography align="center" color="text.secondary" paragraph>
            Nhập mật khẩu mới của bạn.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu mới"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formData.password || !formData.confirmPassword}
            >
              Đặt lại mật khẩu
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Quay lại đăng nhập
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword; 