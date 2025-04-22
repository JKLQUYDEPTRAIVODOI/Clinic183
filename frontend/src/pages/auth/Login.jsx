import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

// Import hình ảnh
import loginImage from '../../assets/login-image.jpg'; // Thay đổi đường dẫn theo hình ảnh của bạn

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login(formData.email, formData.password);

      // After successful login, navigate to /home where role-based redirect will happen
      navigate('/home');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-stretch justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Container chính với Flexbox, lấp đầy toàn bộ màn hình */}
      <div className="flex flex-col lg:flex-row items-stretch w-full h-screen">
        {/* Phần bên trái: Form đăng nhập */}
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
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
              <p className="text-sm text-gray-600">
                Hoặc{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300">
                  tạo tài khoản mới
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

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300">
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-[1.03] shadow-lg hover:shadow-xl text-white font-bold text-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
            alt="Login illustration"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;