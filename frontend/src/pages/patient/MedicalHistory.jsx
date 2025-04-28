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
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import medicalRecordService from '../../services/medicalRecordService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!hasRole('patient')) {
      navigate('/login');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicalRecordService.getPatientMedicalRecords();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching medical history:', error);
      setError('Không thể tải lịch sử khám bệnh. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
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

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
        }}
      >
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                mb: 3,
                color: '#1a237e',
                fontWeight: 600
              }}
            >
              Lịch sử khám bệnh
            </Typography>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {/* Medical Records Table */}
          <Grid item xs={12}>
            {records.length === 0 ? (
              <Alert severity="info">Chưa có lịch sử khám bệnh nào.</Alert>
            ) : (
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Ngày khám</TableCell>
                      <TableCell>Bác sĩ</TableCell>
                      <TableCell>Chẩn đoán</TableCell>
                      <TableCell>Ghi chú</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{formatDate(record.appointment_date)}</TableCell>
                        <TableCell>{record.doctor_name}</TableCell>
                        <TableCell>{record.diagnosis || 'Chưa có'}</TableCell>
                        <TableCell>{record.notes || 'Không có'}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleOpen(record)}
                            sx={{ 
                              textTransform: 'none',
                              borderRadius: 2
                            }}
                          >
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Medical Record Detail Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="div" sx={{ color: '#1a237e', fontWeight: 600 }}>
            Chi tiết lịch sử khám bệnh
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500
                    }
                  }}
                >
                  <Tab label="Thông tin chung" />
                  <Tab label="Đơn thuốc" disabled={!selectedRecord.prescription} />
                  <Tab label="Xét nghiệm" disabled={!selectedRecord.tests} />
                </Tabs>
              </Box>

              {/* General Information */}
              <TabPanel value={tabValue} index={0}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" color="primary" fontWeight={500}>
                          Ngày khám
                        </Typography>
                      }
                      secondary={formatDate(selectedRecord.appointment_date)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" color="primary" fontWeight={500}>
                          Bác sĩ
                        </Typography>
                      }
                      secondary={selectedRecord.doctor_name}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" color="primary" fontWeight={500}>
                          Chẩn đoán
                        </Typography>
                      }
                      secondary={selectedRecord.diagnosis || 'Chưa có'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" color="primary" fontWeight={500}>
                          Ghi chú
                        </Typography>
                      }
                      secondary={selectedRecord.notes || 'Không có'}
                    />
                  </ListItem>
                </List>
              </TabPanel>

              {/* Prescription */}
              <TabPanel value={tabValue} index={1}>
                {selectedRecord.prescription ? (
                  <List>
                    {selectedRecord.prescription.medicines.map((medicine, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" color="primary" fontWeight={500}>
                                {medicine.name}
                              </Typography>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" display="block">
                                  Liều dùng: {medicine.dosage}
                                </Typography>
                                <Typography component="span" variant="body2" display="block">
                                  Tần suất: {medicine.frequency}
                                </Typography>
                                <Typography component="span" variant="body2" display="block">
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
                ) : (
                  <Alert severity="info">Không có đơn thuốc</Alert>
                )}
              </TabPanel>

              {/* Tests */}
              <TabPanel value={tabValue} index={2}>
                {selectedRecord.tests ? (
                  <List>
                    {selectedRecord.tests.map((test, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" color="primary" fontWeight={500}>
                                {test.name}
                              </Typography>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" display="block">
                                  Kết quả: {test.result}
                                </Typography>
                                <Typography component="span" variant="body2" display="block">
                                  Ngày thực hiện: {formatDate(test.date)}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        {index < selectedRecord.tests.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">Không có kết quả xét nghiệm</Alert>
                )}
              </TabPanel>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={handleClose}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalHistory; 