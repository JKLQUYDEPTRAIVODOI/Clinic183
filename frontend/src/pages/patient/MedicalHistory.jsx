import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-history-tabpanel-${index}`}
      aria-labelledby={`medical-history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const MedicalHistory = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Kiểm tra quyền
    if (!hasRole('patient')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    // TODO: Fetch medical history data from API
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      // TODO: Implement API call
      // Using mock data for now
      const mockData = [
        {
          id: 1,
          date: '2024-03-20',
          doctorName: 'Dr. John Doe',
          specialization: 'Nội khoa',
          symptoms: 'Sốt, ho, đau họng',
          diagnosis: 'Viêm họng cấp',
          treatment: 'Uống thuốc theo đơn, nghỉ ngơi',
          prescription: {
            medicines: [
              { name: 'Paracetamol', dosage: '500mg', frequency: '3 lần/ngày', duration: '5 ngày' },
              { name: 'Vitamin C', dosage: '1000mg', frequency: '1 lần/ngày', duration: '7 ngày' },
            ],
          },
          tests: [
            { name: 'Xét nghiệm máu', result: 'Bình thường', date: '2024-03-20' },
            { name: 'X-quang phổi', result: 'Không có bất thường', date: '2024-03-20' },
          ],
          notes: 'Tái khám sau 1 tuần nếu không đỡ',
        },
        {
          id: 2,
          date: '2024-03-15',
          doctorName: 'Dr. Jane Smith',
          specialization: 'Tim mạch',
          symptoms: 'Đau ngực, khó thở',
          diagnosis: 'Tăng huyết áp',
          treatment: 'Uống thuốc điều trị, theo dõi huyết áp',
          prescription: {
            medicines: [
              { name: 'Amlodipine', dosage: '5mg', frequency: '1 lần/ngày', duration: '30 ngày' },
            ],
          },
          tests: [
            { name: 'Điện tâm đồ', result: 'Nhịp tim bình thường', date: '2024-03-15' },
            { name: 'Đo huyết áp', result: '150/90 mmHg', date: '2024-03-15' },
          ],
          notes: 'Tái khám định kỳ mỗi tháng',
        },
      ];
      setRecords(mockData);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  };

  const handleOpen = (record) => {
    setSelectedRecord(record);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h1">
            Lịch sử khám bệnh
          </Typography>
        </Grid>

        {/* Medical Records Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày khám</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Chuyên khoa</TableCell>
                  <TableCell>Chẩn đoán</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.doctorName}</TableCell>
                    <TableCell>{record.specialization}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(record)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Medical Record Detail Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết lịch sử khám bệnh</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Thông tin chung" />
                  <Tab label="Đơn thuốc" />
                  <Tab label="Xét nghiệm" />
                </Tabs>
              </Box>

              {/* General Information */}
              <TabPanel value={tabValue} index={0}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Ngày khám"
                      secondary={selectedRecord.date}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Bác sĩ"
                      secondary={`${selectedRecord.doctorName} - ${selectedRecord.specialization}`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Triệu chứng"
                      secondary={selectedRecord.symptoms}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Chẩn đoán"
                      secondary={selectedRecord.diagnosis}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Phương pháp điều trị"
                      secondary={selectedRecord.treatment}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Ghi chú"
                      secondary={selectedRecord.notes}
                    />
                  </ListItem>
                </List>
              </TabPanel>

              {/* Prescription */}
              <TabPanel value={tabValue} index={1}>
                <List>
                  {selectedRecord.prescription.medicines.map((medicine, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={medicine.name}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="text.primary">
                                Liều lượng: {medicine.dosage}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Tần suất: {medicine.frequency}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Thời gian: {medicine.duration}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {index < selectedRecord.prescription.medicines.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </TabPanel>

              {/* Tests */}
              <TabPanel value={tabValue} index={2}>
                <List>
                  {selectedRecord.tests.map((test, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={test.name}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="text.primary">
                                Kết quả: {test.result}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Ngày: {test.date}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {index < selectedRecord.tests.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </TabPanel>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalHistory; 