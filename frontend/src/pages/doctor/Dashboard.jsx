import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Button from '../../components/UI/Button';

const DoctorDashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0
  });
  
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  // Kiểm tra quyền
  useEffect(() => {
    if (!hasRole('doctor')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  // Giả lập dữ liệu thống kê
  useEffect(() => {
    // Trong dự án thực tế, bạn sẽ gọi API để lấy dữ liệu thống kê
    setStats({
      totalPatients: 45,
      totalAppointments: 128,
      todayAppointments: 8,
      pendingAppointments: 12
    });

    // Giả lập dữ liệu lịch hẹn sắp tới
    setUpcomingAppointments([
      {
        id: 1,
        patientName: 'Nguyễn Văn A',
        time: '09:00',
        date: '15/03/2023',
        reason: 'Khám tổng quát',
        status: 'confirmed'
      },
      {
        id: 2,
        patientName: 'Trần Thị B',
        time: '10:30',
        date: '15/03/2023',
        reason: 'Đau đầu, sốt',
        status: 'confirmed'
      },
      {
        id: 3,
        patientName: 'Lê Văn C',
        time: '14:00',
        date: '15/03/2023',
        reason: 'Tái khám',
        status: 'confirmed'
      },
      {
        id: 4,
        patientName: 'Phạm Thị D',
        time: '15:30',
        date: '15/03/2023',
        reason: 'Xét nghiệm máu',
        status: 'pending'
      },
      {
        id: 5,
        patientName: 'Hoàng Văn E',
        time: '16:30',
        date: '15/03/2023',
        reason: 'Đau bụng',
        status: 'pending'
      }
    ]);
  }, []);

  // Các mục quản lý
  const managementItems = [
    { 
      title: 'Quản lý lịch hẹn', 
      description: 'Xem, chấp nhận hoặc từ chối lịch hẹn',
      icon: '📅',
      path: '/doctor/appointments'
    },
    { 
      title: 'Bệnh nhân', 
      description: 'Xem thông tin và lịch sử khám bệnh của bệnh nhân',
      icon: '👨‍👩‍👧‍👦',
      path: '/doctor/patients'
    },
    { 
      title: 'Kê đơn thuốc', 
      description: 'Tạo đơn thuốc mới cho bệnh nhân',
      icon: '💊',
      path: '/doctor/prescriptions'
    },
    { 
      title: 'Chẩn đoán', 
      description: 'Tạo và quản lý chẩn đoán bệnh',
      icon: '🔬',
      path: '/doctor/diagnoses'
    }
  ];

  // Định dạng trạng thái lịch hẹn
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Đã xác nhận</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Chờ xác nhận</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Đã hủy</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Bác sĩ</h1>
      
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card title="Bệnh nhân" className="bg-blue-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
            <p className="text-sm text-gray-500">Tổng số bệnh nhân</p>
          </div>
        </Card>
        
        <Card title="Lịch hẹn" className="bg-green-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.totalAppointments}</p>
            <p className="text-sm text-gray-500">Tổng số lịch hẹn</p>
          </div>
        </Card>
        
        <Card title="Hôm nay" className="bg-purple-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.todayAppointments}</p>
            <p className="text-sm text-gray-500">Lịch hẹn hôm nay</p>
          </div>
        </Card>
        
        <Card title="Chờ xác nhận" className="bg-yellow-50">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
            <p className="text-sm text-gray-500">Lịch hẹn chờ xác nhận</p>
          </div>
        </Card>
      </div>
      
      {/* Lịch hẹn hôm nay */}
      <Card title="Lịch hẹn hôm nay" className="mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Bệnh nhân</th>
                <th className="py-3 px-6 text-left">Thời gian</th>
                <th className="py-3 px-6 text-left">Lý do khám</th>
                <th className="py-3 px-6 text-center">Trạng thái</th>
                <th className="py-3 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {upcomingAppointments.map(appointment => (
                <tr key={appointment.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{appointment.patientName}</td>
                  <td className="py-3 px-6 text-left">{appointment.time}</td>
                  <td className="py-3 px-6 text-left">{appointment.reason}</td>
                  <td className="py-3 px-6 text-center">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => navigate(`/doctor/appointments/${appointment.id}`)}
                      >
                        Chi tiết
                      </Button>
                      {appointment.status === 'pending' && (
                        <Button 
                          variant="success" 
                          size="sm"
                          className="mr-2"
                        >
                          Xác nhận
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Button 
            variant="primary"
            onClick={() => navigate('/doctor/appointments')}
          >
            Xem tất cả lịch hẹn
          </Button>
        </div>
      </Card>
      
      {/* Quản lý */}
      <h2 className="text-xl font-semibold mb-4">Chức năng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

export default DoctorDashboard; 