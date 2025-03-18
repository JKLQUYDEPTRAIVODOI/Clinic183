import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const AdminDashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalMedicines: 0,
    totalRevenue: 0
  });

  // Kiểm tra quyền
  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  // Giả lập dữ liệu thống kê
  useEffect(() => {
    // Trong dự án thực tế, bạn sẽ gọi API để lấy dữ liệu thống kê
    setStats({
      totalUsers: 124,
      totalDoctors: 15,
      totalPatients: 98,
      totalAppointments: 256,
      totalMedicines: 342,
      totalRevenue: 25600
    });
  }, []);

  // Các mục quản lý
  const managementItems = [
    { 
      title: 'Quản lý người dùng', 
      description: 'Thêm, sửa, xóa và phân quyền tài khoản',
      icon: '👥',
      path: '/admin/users'
    },
    { 
      title: 'Quản lý thuốc', 
      description: 'Thêm, sửa, xóa thuốc và xem đơn thuốc',
      icon: '💊',
      path: '/admin/medicines'
    },
    { 
      title: 'Quản lý lịch hẹn', 
      description: 'Xem và quản lý trạng thái lịch hẹn',
      icon: '📅',
      path: '/admin/appointments'
    },
    { 
      title: 'Quản lý lịch sử khám bệnh', 
      description: 'Xem toàn bộ lịch sử khám bệnh của bệnh nhân',
      icon: '📝',
      path: '/admin/medical-records'
    },
    { 
      title: 'Quản lý chẩn đoán', 
      description: 'Xem và cập nhật chẩn đoán',
      icon: '🔬',
      path: '/admin/diagnoses'
    },
    { 
      title: 'Quản lý dịch vụ', 
      description: 'Quản lý danh sách dịch vụ',
      icon: '🏥',
      path: '/admin/services'
    },
    { 
      title: 'Quản lý hóa đơn', 
      description: 'Quản lý hóa đơn thanh toán của bệnh nhân',
      icon: '💰',
      path: '/admin/invoices'
    },
    { 
      title: 'Thống kê doanh thu', 
      description: 'Thống kê tổng doanh thu từ các dịch vụ và hóa đơn',
      icon: '📊',
      path: '/admin/revenue'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Card title="Người dùng" className="bg-blue-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Tổng số người dùng</p>
          </div>
        </Card>
        
        <Card title="Bác sĩ" className="bg-green-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.totalDoctors}</p>
            <p className="text-sm text-gray-500">Tổng số bác sĩ</p>
          </div>
        </Card>
        
        <Card title="Bệnh nhân" className="bg-purple-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.totalPatients}</p>
            <p className="text-sm text-gray-500">Tổng số bệnh nhân</p>
          </div>
        </Card>
        
        <Card title="Lịch hẹn" className="bg-yellow-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.totalAppointments}</p>
            <p className="text-sm text-gray-500">Tổng số lịch hẹn</p>
          </div>
        </Card>
        
        <Card title="Thuốc" className="bg-red-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{stats.totalMedicines}</p>
            <p className="text-sm text-gray-500">Tổng số thuốc</p>
          </div>
        </Card>
        
        <Card title="Doanh thu" className="bg-indigo-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">${stats.totalRevenue}</p>
            <p className="text-sm text-gray-500">Tổng doanh thu</p>
          </div>
        </Card>
      </div>
      
      {/* Quản lý */}
      <h2 className="text-xl font-semibold mb-4">Quản lý hệ thống</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {managementItems.map((item, index) => (
          <Card key={index} title={item.title} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">{item.icon}</div>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => navigate(item.path)}
            >
              Truy cập
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard; 