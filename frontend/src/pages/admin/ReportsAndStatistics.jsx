import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const ReportsAndStatistics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [reportType, setReportType] = useState('revenue');

  // Mock data for charts
  const revenueData = [
    { name: 'T2', value: 4000 },
    { name: 'T3', value: 3000 },
    { name: 'T4', value: 2000 },
    { name: 'T5', value: 2780 },
    { name: 'T6', value: 1890 },
    { name: 'T7', value: 2390 },
    { name: 'CN', value: 3490 },
  ];

  const appointmentData = [
    { name: 'Khám tổng quát', value: 400 },
    { name: 'Xét nghiệm', value: 300 },
    { name: 'Chụp X-quang', value: 200 },
    { name: 'Siêu âm', value: 278 },
    { name: 'Nội soi', value: 189 },
  ];

  const patientData = [
    { name: 'Nam', value: 400 },
    { name: 'Nữ', value: 300 },
    { name: 'Trẻ em', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleExportReport = () => {
    // TODO: Implement export functionality
    console.log('Exporting report...');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Báo cáo và Thống kê
            </Typography>
            <Box>
              <FormControl sx={{ minWidth: 120, mr: 2 }}>
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
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>Loại báo cáo</InputLabel>
                <Select
                  value={reportType}
                  label="Loại báo cáo"
                  onChange={handleReportTypeChange}
                >
                  <MenuItem value="revenue">Doanh thu</MenuItem>
                  <MenuItem value="appointments">Lịch hẹn</MenuItem>
                  <MenuItem value="patients">Bệnh nhân</MenuItem>
                </Select>
              </FormControl>
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

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo thời gian
            </Typography>
            <LineChart
              width={800}
              height={400}
              data={revenueData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                name="Doanh thu"
              />
            </LineChart>
          </Paper>
        </Grid>

        {/* Appointments Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Số lượng lịch hẹn theo dịch vụ
            </Typography>
            <BarChart
              width={400}
              height={300}
              data={appointmentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Số lượng" />
            </BarChart>
          </Paper>
        </Grid>

        {/* Patients Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân bố bệnh nhân theo giới tính
            </Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={patientData}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {patientData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportsAndStatistics; 