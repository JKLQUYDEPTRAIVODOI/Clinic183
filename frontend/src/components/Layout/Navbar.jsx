import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    const profilePath = `/${user.role}/profile`;
    navigate(profilePath);
  };

  const handleSettings = () => {
    handleCloseUserMenu();
    if (user.role === 'admin') {
      navigate('/admin/settings');
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
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Clinic HMS
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Thông báo">
              <IconButton color="inherit" sx={{ mr: 2 }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Tài khoản">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.name} src={user.avatar}>
                    {user.name ? user.name[0] : <PersonIcon />}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Typography textAlign="center">
                    {user.name}
                    <Typography variant="body2" color="text.secondary">
                      {getRoleText(user.role)}
                    </Typography>
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProfile}>
                  <PersonIcon sx={{ mr: 2 }} />
                  Hồ sơ
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={handleSettings}>
                    <SettingsIcon sx={{ mr: 2 }} />
                    Cài đặt
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 