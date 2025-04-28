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
    <div className="min-h-screen w-screen flex items-stretch justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col lg:flex-row items-stretch w-full h-screen">
        {/* Phần bên trái: Form đăng ký */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-xl z-0"></div>
          
          <div className="w-full max-w-md relative z-10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <Button
                  variant="outline"
                  className="px-6 py-2 rounded-full hover:bg-blue-50 transition-all duration-300"
                  onClick={() => navigate('/')}
                >
                  ← Về trang chủ
                </Button>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h2>
              <p className="text-sm text-gray-600">
                Hoặc{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300">
                  đăng nhập nếu đã có tài khoản
                </Link>
              </p>
            </div>
            
            <Card className="backdrop-blur-lg bg-white/80 shadow-xl rounded-2xl p-8">
              {errors.general && (
                <div className="mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Họ tên"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  className="rounded-xl"
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
                  className="rounded-xl"
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
                  className="rounded-xl"
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
                  className="rounded-xl"
                />
                
                <div className="flex items-center mt-4">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    Tôi đồng ý với <Link to="/terms" className="text-blue-600 hover:text-blue-500 transition-colors duration-300">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-blue-600 hover:text-blue-500 transition-colors duration-300">Chính sách bảo mật</Link>
                  </label>
                </div>
                
                <div className="mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02]"
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
        <div className="hidden lg:block w-full lg:w-1/2 h-screen relative overflow-hidden">
          <img
            src={loginImage}
            alt="Register illustration"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Register; 