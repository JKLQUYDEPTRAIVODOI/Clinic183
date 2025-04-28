import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    console.log('Request interceptor - Token from localStorage:', token ? 'Token exists' : 'No token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request interceptor - Added token to headers:', config.headers.Authorization);
    }
    
    console.log('Request interceptor - Final config:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response interceptor - Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response interceptor - Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({
        message: 'Không thể kết nối đến server',
      });
    } else {
      return Promise.reject({
        message: 'Có lỗi xảy ra',
      });
    }
  }
);

export default api; 