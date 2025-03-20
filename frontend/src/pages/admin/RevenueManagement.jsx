import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'; // Use v3 adapter
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RevenueManagement = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [revenueByService, setRevenueByService] = useState([]);
  const [revenueByDoctor, setRevenueByDoctor] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalInvoices: 0,
    avgPerInvoice: 0,
    growthRate: 0,
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // Fetch revenue data based on time range
    fetchRevenueData();
  }, [timeRange, startDate, endDate]);

  const fetchRevenueData = () => {
    // TODO: Implement API call to fetch revenue data
    // Using mock data for now
    
    // Mock data for revenue over time
    const mockRevenueData = [
      { name: 'T1', value: 4000000 },
      { name: 'T2', value: 3000000 },
      { name: 'T3', value: 5000000 },
      { name: 'T4', value: 2780000 },
      { name: 'T5', value: 1890000 },
      { name: 'T6', value: 2390000 },
      { name: 'T7', value: 3490000 },
      { name: 'T8', value: 4200000 },
      { name: 'T9', value: 3800000 },
      { name: 'T10', value: 2900000 },
      { name: 'T11', value: 4800000 },
      { name: 'T12', value: 5100000 },
    ];
    
    // Mock data for revenue by service
    const mockRevenueByService = [
      { name: 'Khám tổng quát', value: 12000000 },
      { name: 'Xét nghiệm', value: 8000000 },
      { name: 'Chụp X-quang', value: 6000000 },
      { name: 'Siêu âm', value: 5000000 },
      { name: 'Nội soi', value: 3000000 },
    ];
    
    // Mock data for revenue by doctor
    const mockRevenueByDoctor = [
      { name: 'BS. Nguyễn Văn A', value: 9000000 },
      { name: 'BS. Trần Thị B', value: 7500000 },
      { name: 'BS. Lê Văn C', value: 6800000 },
      { name: 'BS. Phạm Thị D', value: 5200000 },
      { name: 'BS. Hoàng Văn E', value: 3500000 },
    ];
    
    // Calculate total revenue
    const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.value, 0);
    
    // Set state
    setRevenueData(mockRevenueData);
    setRevenueByService(mockRevenueByService);
    setRevenueByDoctor(mockRevenueByDoctor);
    setSummary({
      totalRevenue: totalRevenue,
      totalInvoices: 256,
      avgPerInvoice: Math.round(totalRevenue / 256),
      growthRate: 15.8,
    });
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleExportReport = () => {
    // TODO: Implement export functionality
    console.log('Exporting revenue report...');
    alert('Báo cáo đã được xuất thành công!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Thống kê Doanh thu
            </Typography>
            <Box display="flex" gap={2}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Thời gian</InputLabel>
                <Select
                  value={timeRange}
                  label="Thời gian"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="day">Hôm nay</MenuItem>
                  <MenuItem value="week">Tuần này</MenuItem>
                  <MenuItem value="month">Tháng này</MenuItem>
                  <MenuItem value="quarter">Quý này</MenuItem>
                  <MenuItem value="year">Năm nay</MenuItem>
                  <MenuItem value="custom">Tùy chỉnh</MenuItem>
                </Select>
              </FormControl>
              
              {timeRange === 'custom' && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Từ ngày"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DatePicker
                    label="Đến ngày"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              )}
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportReport}
              >
                Xuất báo cáo
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Tổng doanh thu
            </Typography>
            <Typography variant="h4" component="div">
              {formatCurrency(summary.totalRevenue)}
            </Typography>
            <Typography variant="body2" sx={{ color: summary.growthRate >= 0 ? 'success.main' : 'error.main' }}>
              {summary.growthRate >= 0 ? '+' : ''}{summary.growthRate}% so với kỳ trước
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Số lượng hóa đơn
            </Typography>
            <Typography variant="h4" component="div">
              {summary.totalInvoices}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Trung bình/Hóa đơn
            </Typography>
            <Typography variant="h4" component="div">
              {formatCurrency(summary.avgPerInvoice)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Tỷ lệ hóa đơn thanh toán
            </Typography>
            <Typography variant="h4" component="div">
              92%
            </Typography>
          </Paper>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo thời gian
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={revenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Doanh thu"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue by Service */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo dịch vụ
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenueByService}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue by Doctor */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo bác sĩ
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByDoctor}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueByDoctor.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Services Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top dịch vụ mang lại doanh thu cao nhất
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên dịch vụ</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Doanh thu</TableCell>
                    <TableCell>Tỷ lệ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueByService.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{Math.floor(service.value / 200000)}</TableCell>
                      <TableCell>{formatCurrency(service.value)}</TableCell>
                      <TableCell>{((service.value / summary.totalRevenue) * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RevenueManagement; 