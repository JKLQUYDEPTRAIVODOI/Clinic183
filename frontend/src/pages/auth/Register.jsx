import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' // Mặc định là bệnh nhân
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Họ tên là bắt buộc';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Xóa lỗi cũ trước khi thử lại
    if (!validateForm()) {
      return; // Dừng lại nếu biểu mẫu không hợp lệ
    }
    setIsSubmitting(true);
    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: error.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>
        
        <Card className="mt-8">
          {errors.general && (
            <div className="mb-4 bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <Input
              id="name"
              name="name"
              type="text"
              label="Họ tên"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              label="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bạn là
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <input
                    id="role-patient"
                    name="role"
                    type="radio"
                    value="patient"
                    checked={formData.role === 'patient'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="role-patient" className="ml-2 block text-sm text-gray-900">
                    Bệnh nhân
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="role-doctor"
                    name="role"
                    type="radio"
                    value="doctor"
                    checked={formData.role === 'doctor'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="role-doctor" className="ml-2 block text-sm text-gray-900">
                    Bác sĩ
                  </label>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.role === 'doctor' 
                  ? 'Thông tin bác sĩ sẽ cần được xác minh bởi quản trị viên trước khi sử dụng.' 
                  : 'Bạn sẽ được đăng ký với vai trò bệnh nhân.'}
              </p>
            </div>
            
            <div className="flex items-center mt-4">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                Tôi đồng ý với <Link to="/terms" className="text-blue-600 hover:text-blue-500">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Chính sách bảo mật</Link>
              </label>
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register; 