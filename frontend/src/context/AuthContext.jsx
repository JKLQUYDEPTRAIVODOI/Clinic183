import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        setLoading(true);
        // Check if user is already logged in
        const storedUser = authService.getCurrentUser();
        console.log('Stored user:', storedUser);
        
        if (storedUser) {
          // Verify token validity with backend
          console.log('Verifying token with backend...');
          const isValid = await authService.verifyToken();
          console.log('Token valid:', isValid);
          if (isValid) {
            setUser(storedUser);
          } else {
            // If token is invalid, logout
            console.log('Token invalid, logging out');
            authService.logout();
          }
        } else {
          console.log('No stored user found');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        authService.logout();
      } finally {
        setLoading(false);
        console.log('Auth initialization complete, loading:', loading);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Đăng nhập thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message || 'Đăng xuất thất bại');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.updateProfile(profileData);
      setUser(response.user);
      return response;
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Cập nhật thông tin thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      await authService.changePassword(passwordData);
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.message || 'Đổi mật khẩu thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await authService.forgotPassword(email);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Gửi yêu cầu khôi phục mật khẩu thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(token, newPassword);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Đặt lại mật khẩu thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      setError(null);
      await authService.verifyEmail(token);
    } catch (err) {
      console.error('Verify email error:', err);
      setError(err.message || 'Xác thực email thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    hasRole,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 