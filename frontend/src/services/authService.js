import api from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data.message || 'Có lỗi xảy ra');
  } else if (error.request) {
    // Request was made but no response
    throw new Error('Không thể kết nối đến server');
  } else {
    // Other errors
    throw error;
  }
};

// Set token to Authorization header
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    const { token, user } = response.data;
    
    // Store token and user in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Set token in axios headers
    setAuthToken(token);
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data;
    
    // Store token and user in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Set token in axios headers
    setAuthToken(token);
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const logout = () => {
  // Remove token and user from localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // Remove token from axios headers
  setAuthToken(null);
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const verifyToken = async () => {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await api.post('/auth/verify-token');
    return response.data.isValid;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await api.put('/auth/profile', data);
    const { user } = response.data;
    
    // Update user in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const changePassword = async (data) => {
  try {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Initialize auth token from localStorage
const token = getToken();
if (token) {
  setAuthToken(token);
}

export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
}; 