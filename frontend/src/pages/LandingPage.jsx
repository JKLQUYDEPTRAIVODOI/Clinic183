import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  LocalHospital,
  AccessTime,
  Phone,
  Email,
  LocationOn,
  CheckCircle,
  MedicalServices,
  Healing,
  Psychology,
  MonitorHeart,
} from '@mui/icons-material';

const services = [
  {
    icon: <MedicalServices />,
    title: 'Khám Tổng Quát',
    description: 'Dịch vụ khám sức khỏe tổng quát toàn diện với các bác sĩ chuyên môn cao.'
  },
  {
    icon: <Healing />,
    title: 'Điều Trị Chuyên Sâu',
    description: 'Điều trị các bệnh lý chuyên sâu với trang thiết bị hiện đại.'
  },
  {
    icon: <Psychology />,
    title: 'Tư Vấn Sức Khỏe',
    description: 'Dịch vụ tư vấn sức khỏe trực tiếp với đội ngũ bác sĩ giàu kinh nghiệm.'
  },
  {
    icon: <MonitorHeart />,
    title: 'Theo Dõi Sức Khỏe',
    description: 'Theo dõi và quản lý sức khỏe định kỳ với hệ thống quản lý hiện đại.'
  },
];

const features = [
  'Đội ngũ bác sĩ chuyên môn cao',
  'Trang thiết bị hiện đại',
  'Phòng khám tiện nghi',
  'Thời gian chờ đợi ngắn',
  'Giá cả hợp lý',
  'Chăm sóc tận tình',
];

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
          color: 'white',
          py: 15,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Chào mừng đến với Clinic HMS
              </Typography>
              <Typography variant="h5" paragraph>
                Hệ thống quản lý phòng khám hiện đại, mang đến trải nghiệm chăm sóc sức khỏe tốt nhất cho bạn
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/book-appointment')}
                  sx={{
                    mr: 2,
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Đặt Lịch Ngay
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/track-appointment')}
                  sx={{
                    mr: 2,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'grey.100',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Tra Cứu Lịch Hẹn
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    mr: 2,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'grey.100',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Đăng Ký
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'grey.100',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Đăng Nhập
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-image.jpg"
                alt="Medical Care"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  display: 'block',
                  margin: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Dịch Vụ Của Chúng Tôi
        </Typography>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                      color: 'primary.main',
                      '& > svg': {
                        fontSize: 40,
                      },
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {service.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                Tại sao chọn chúng tôi?
              </Typography>
              <Typography paragraph color="text.secondary" sx={{ mb: 4 }}>
                Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao với đội ngũ y bác sĩ giàu kinh nghiệm và cơ sở vật chất hiện đại.
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/clinic-feature.jpg"
                alt="Clinic Features"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Liên Hệ Với Chúng Tôi
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <LocationOn color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  Địa Chỉ
                </Typography>
                <Typography align="center" color="text.secondary">
                  123 Đường Y Tế, Quận Chăm Sóc
                  <br />
                  Thành phố Sức Khỏe
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <AccessTime color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  Giờ Làm Việc
                </Typography>
                <Typography align="center" color="text.secondary">
                  Thứ 2 - Thứ 6: 8:00 - 20:00
                  <br />
                  Thứ 7 - Chủ Nhật: 8:00 - 17:00
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Phone color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  Liên Hệ
                </Typography>
                <Typography align="center" color="text.secondary">
                  Hotline: 1900 1234
                  <br />
                  Email: info@clinichms.com
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Bắt đầu chăm sóc sức khỏe của bạn ngay hôm nay
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Đăng ký tài khoản để đặt lịch khám và theo dõi sức khỏe một cách dễ dàng
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Đăng Ký Ngay
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 