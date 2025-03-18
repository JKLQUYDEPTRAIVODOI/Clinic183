import React, { useState } from 'react';
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
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // TODO: Implement API call to request password reset
      // For now, just simulate API call
      console.log('Requesting password reset for:', email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setError('Có lỗi xảy ra khi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.');
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
              Kiểm tra email của bạn
            </Typography>
            <Typography align="center" color="text.secondary" paragraph>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email {email}.
              Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Quay lại đăng nhập
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
            Quên mật khẩu?
          </Typography>
          <Typography align="center" color="text.secondary" paragraph>
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
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
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!email}
            >
              Gửi yêu cầu
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

export default ForgotPassword; 