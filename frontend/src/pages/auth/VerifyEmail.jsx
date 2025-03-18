import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [error, setError] = useState('');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      // Lấy token từ URL query params
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setError('Token xác thực không hợp lệ hoặc đã hết hạn.');
        setStatus('error');
        return;
      }

      // TODO: Implement API call to verify email
      // For now, just simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
    } catch (error) {
      console.error('Error verifying email:', error);
      setError('Có lỗi xảy ra khi xác thực email. Vui lòng thử lại sau.');
      setStatus('error');
    }
  };

  const handleResendVerification = async () => {
    try {
      // TODO: Implement API call to resend verification email
      console.log('Resending verification email');
      setStatus('verifying');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('Email xác thực mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error) {
      console.error('Error resending verification:', error);
      setError('Có lỗi xảy ra khi gửi lại email xác thực. Vui lòng thử lại sau.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h5" align="center" gutterBottom>
              Đang xác thực email...
            </Typography>
            <Typography align="center" color="text.secondary">
              Vui lòng đợi trong giây lát.
            </Typography>
          </>
        );

      case 'success':
        return (
          <>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" align="center" gutterBottom>
              Xác thực email thành công!
            </Typography>
            <Typography align="center" color="text.secondary" paragraph>
              Email của bạn đã được xác thực thành công.
              Bây giờ bạn có thể đăng nhập vào tài khoản của mình.
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
          </>
        );

      case 'error':
        return (
          <>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" align="center" gutterBottom>
              Xác thực email thất bại
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              onClick={handleResendVerification}
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Gửi lại email xác thực
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Quay lại đăng nhập
              </Link>
            </Box>
          </>
        );

      default:
        return null;
    }
  };

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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {renderContent()}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail; 