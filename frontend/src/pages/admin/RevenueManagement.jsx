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
  Stack,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import revenueService from '../../services/revenueService';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, format } from 'date-fns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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
    totalItems: 0,
    avgPerInvoice: 0,
    paymentRate: 0,
    growthRate: 0,
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    updateDateRange(timeRange);
  }, [timeRange]);

  useEffect(() => {
    if (startDate && endDate) {
    fetchRevenueData();
    }
  }, [startDate, endDate]);

  const updateDateRange = (range) => {
    const now = new Date();
    let start, end;

    switch (range) {
      case 'day':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week': {
        // Lấy ngày đầu tuần (thứ 2)
        const dayOfWeek = now.getDay() || 7;
        start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek + 1);
        start.setHours(0, 0, 0, 0);
        
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      }
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      case 'custom':
        return;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    }

    setStartDate(start);
    setEndDate(end);
  };

  const fetchRevenueData = async () => {
    try {
      // Chuyển đổi ngày thành chuỗi ISO và thêm timezone offset
      const startDateStr = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString();
      const endDateStr = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString();

      // Lấy tổng quan doanh thu
      const summaryData = await revenueService.getRevenueSummary(startDateStr, endDateStr);
      setSummary(summaryData);

      // Lấy doanh thu theo thời gian
      const timeData = await revenueService.getRevenueByTime(startDateStr, endDateStr, timeRange);
      setRevenueData(timeData.map(item => ({
        name: format(new Date(item.time), timeRange === 'day' ? 'dd/MM' : 'MM/yyyy'),
        value: item.value
      })));

      // Lấy doanh thu theo dịch vụ
      const serviceData = await revenueService.getRevenueByService(startDateStr, endDateStr);
      setRevenueByService(serviceData);

      // Lấy doanh thu theo bác sĩ
      const doctorData = await revenueService.getRevenueByDoctor(startDateStr, endDateStr);
      setRevenueByDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
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
        {/* Header */}
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
              Thống kê Doanh thu
            </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
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
                  <MenuItem value="year">Năm nay</MenuItem>
                  <MenuItem value="custom">Tùy chỉnh</MenuItem>
                </Select>
              </FormControl>
              
              {timeRange === 'custom' && (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    label="Từ ngày"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                  />
                  <DatePicker
                    label="Đến ngày"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                  />
                </Stack>
                </LocalizationProvider>
              )}
              
              <Button
                variant="contained"
                color="primary"
              startIcon={<FileDownloadIcon />}
                onClick={handleExportReport}
              >
                Xuất báo cáo
              </Button>
          </Stack>
        </Stack>
          </Box>

        {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="text.secondary">
              Tổng doanh thu
            </Typography>
                <TrendingUpIcon color={summary.growthRate >= 0 ? "success" : "error"} />
              </Stack>
              <Typography variant="h4" component="div" gutterBottom>
              {formatCurrency(summary.totalRevenue)}
            </Typography>
            <Typography variant="body2" sx={{ color: summary.growthRate >= 0 ? 'success.main' : 'error.main' }}>
              {summary.growthRate >= 0 ? '+' : ''}{summary.growthRate}% so với kỳ trước
            </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="text.secondary">
                  Số hóa đơn
            </Typography>
                <ReceiptIcon color="primary" />
              </Stack>
              <Typography variant="h4" component="div" gutterBottom>
              {summary.totalInvoices}
            </Typography>
              <Typography variant="body2" color="text.secondary">
                Tỷ lệ thanh toán: {summary.paymentRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="text.secondary">
                  Số mục
                </Typography>
                <LocalHospitalIcon color="primary" />
              </Stack>
              <Typography variant="h4" component="div" gutterBottom>
                {summary.totalItems}
            </Typography>
              <Typography variant="body2" color="text.secondary">
                Trung bình {(summary.totalItems / summary.totalInvoices || 0).toFixed(1)} mục/hóa đơn
            </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="text.secondary">
                  Trung bình/Hóa đơn
                </Typography>
                <PeopleIcon color="primary" />
              </Stack>
              <Typography variant="h4" component="div" gutterBottom>
                {formatCurrency(summary.avgPerInvoice)}
            </Typography>
              <Typography variant="body2" color="text.secondary">
                Cho hóa đơn đã thanh toán
            </Typography>
            </CardContent>
          </Card>
        </Grid>
        </Grid>

        {/* Revenue Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo thời gian
            </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
            />
            <YAxis 
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <ChartTooltip
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `Thời gian: ${label}`}
            />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Doanh thu"
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ fill: '#1976d2' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

      {/* Revenue by Service and Doctor */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo dịch vụ
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell align="right">Số hóa đơn</TableCell>
                    <TableCell align="right">Doanh thu</TableCell>
                    <TableCell align="right">Tỷ lệ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueByService.map((service, index) => (
                    <TableRow 
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {service.name}
                      </TableCell>
                      <TableCell align="right">{service.invoiceCount}</TableCell>
                      <TableCell align="right">{formatCurrency(service.value)}</TableCell>
                      <TableCell align="right">
                        {((service.value / summary.totalRevenue) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo bác sĩ
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bác sĩ</TableCell>
                    <TableCell align="right">Số hóa đơn</TableCell>
                    <TableCell align="right">Doanh thu</TableCell>
                    <TableCell align="right">Tỷ lệ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueByDoctor.map((doctor, index) => (
                    <TableRow 
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {doctor.name}
                      </TableCell>
                      <TableCell align="right">{doctor.invoiceCount}</TableCell>
                      <TableCell align="right">{formatCurrency(doctor.value)}</TableCell>
                      <TableCell align="right">
                        {((doctor.value / summary.totalRevenue) * 100).toFixed(1)}%
                      </TableCell>
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