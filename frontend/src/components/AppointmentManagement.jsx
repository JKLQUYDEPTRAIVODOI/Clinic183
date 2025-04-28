import React, { useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';
import { useNavigate } from 'react-router-dom';
import './AppointmentManagement.css';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAllAppointments();
      // Thêm thông tin bác sĩ vào mỗi appointment
      const appointmentsWithDoctors = await Promise.all(
        data.map(async (appointment) => {
          if (appointment.doctor_id) {
            try {
              const doctorResponse = await fetch(`${process.env.REACT_APP_API_URL}/doctors/${appointment.doctor_id}`);
              const doctorData = await doctorResponse.json();
              return {
                ...appointment,
                doctor_name: doctorData.name ? `BS. ${doctorData.name}` : 'Chưa phân công'
              };
            } catch (error) {
              console.error('Error fetching doctor:', error);
              return appointment;
            }
          }
          return appointment;
        })
      );
      setAppointments(appointmentsWithDoctors);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch appointments. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // Extract HH:mm from time string
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appointment-management">
      <div className="appointment-header">
        <h2>Quản lý Lịch hẹn</h2>
        <button className="add-appointment-btn" onClick={() => navigate('/admin/appointments/add')}>
          + THÊM LỊCH HẸN
        </button>
      </div>
      <div className="appointment-table">
        <table>
          <thead>
            <tr>
              <th>Bác sĩ</th>
              <th>Bệnh nhân</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.doctor_name || 'Chưa phân công'}</td>
                <td>{appointment.patient_name || 'N/A'}</td>
                <td>{formatDate(appointment.appointment_date)}</td>
                <td>{formatTime(appointment.appointment_time)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>{appointment.reason || '-'}</td>
                <td className="action-buttons">
                  <button 
                    className="edit-btn"
                    onClick={() => navigate(`/admin/appointments/edit/${appointment.id}`)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => {/* Thêm xử lý xóa */}}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentManagement; 