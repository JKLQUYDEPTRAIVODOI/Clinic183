import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

// Import hình ảnh
import loginImage from '../../assets/login-image.jpg';

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
      setErrors({ 
        general: error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-stretch justify-center bg-gray-50">
      <div className="flex flex-col lg:flex-row items-stretch w-full h-screen">
        {/* Phần bên trái: Form đăng ký */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
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

        {/* Phần bên phải: Hình ảnh */}
        <div className="hidden lg:block w-full lg:w-1/2 h-screen">
          <img
            src={loginImage}
            alt="Register illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register; 