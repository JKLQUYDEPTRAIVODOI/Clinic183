import React from 'react';
import { Box, CircularProgress, Alert, Snackbar, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import theme from '../../theme';

const Layout = ({ children }) => {
  const { loading, error, clearError } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Box
          component="span"
          sx={{
            color: 'text.secondary',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          Đang tải...
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box
          sx={{
            maxWidth: '1400px',
            mx: 'auto',
            p: 2,
          }}
        >
          {children || <Outlet />}
        </Box>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiAlert-root': {
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          },
        }}
      >
        <Alert 
          onClose={clearError} 
          severity="error" 
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Layout;