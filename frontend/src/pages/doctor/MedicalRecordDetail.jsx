import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import medicalRecordService from '../../services/medicalRecordService';

const MedicalRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);

  useEffect(() => {
    fetchMedicalRecord();
  }, [id]);

  const fetchMedicalRecord = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordService.getMedicalRecordById(id);
      setMedicalRecord(data);
    } catch (error) {
      console.error('Error fetching medical record:', error);
      setError('Không thể tải thông tin bệnh án');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Chi tiết bệnh án
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Thông tin khám bệnh
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Bệnh nhân:</strong> {medicalRecord?.patient_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Bác sĩ:</strong> {medicalRecord?.doctor_name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Ngày khám:</strong>{' '}
              {medicalRecord?.appointment_date ? 
                format(new Date(medicalRecord.appointment_date), 'dd/MM/yyyy', { locale: vi }) :
                'Không có thông tin'
              }
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Chẩn đoán:</strong></Typography>
            <Typography sx={{ mt: 1 }}>{medicalRecord?.diagnosis || 'Không có chẩn đoán'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Ghi chú:</strong></Typography>
            <Typography sx={{ mt: 1 }}>{medicalRecord?.notes || 'Không có ghi chú'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {medicalRecord?.prescription && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Đơn thuốc
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên thuốc</TableCell>
                  <TableCell>Liều dùng</TableCell>
                  <TableCell>Tần suất</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Hướng dẫn</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalRecord.prescription.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.medicine_name}</TableCell>
                    <TableCell>{item.dosage}</TableCell>
                    <TableCell>{item.frequency}</TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>{item.instructions || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default MedicalRecordDetail; 