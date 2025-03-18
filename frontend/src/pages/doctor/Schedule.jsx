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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    room: '',
    maxPatients: '',
    notes: '',
  });

  useEffect(() => {
    // TODO: Fetch schedules data from API
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      // TODO: Implement API call
      const mockData = [
        {
          id: 1,
          dayOfWeek: 'Thứ 2',
          startTime: '08:00',
          endTime: '17:00',
          room: 'Phòng 101',
          maxPatients: '20',
          notes: 'Khám buổi sáng',
        },
        {
          id: 2,
          dayOfWeek: 'Thứ 3',
          startTime: '08:00',
          endTime: '17:00',
          room: 'Phòng 102',
          maxPatients: '20',
          notes: 'Khám buổi sáng',
        },
        // Add more mock data as needed
      ];
      setSchedules(mockData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleOpen = (schedule = null) => {
    if (schedule) {
      setSelectedSchedule(schedule);
      setFormData(schedule);
    } else {
      setSelectedSchedule(null);
      setFormData({
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        room: '',
        maxPatients: '',
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSchedule(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save/update schedule
      if (selectedSchedule) {
        // Update existing schedule
        setSchedules(schedules.map(schedule =>
          schedule.id === selectedSchedule.id ? { ...schedule, ...formData } : schedule
        ));
      } else {
        // Add new schedule
        const newSchedule = {
          id: schedules.length + 1,
          ...formData,
        };
        setSchedules([...schedules, newSchedule]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Lịch làm việc
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Thêm Lịch
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thứ</TableCell>
                  <TableCell>Giờ bắt đầu</TableCell>
                  <TableCell>Giờ kết thúc</TableCell>
                  <TableCell>Phòng</TableCell>
                  <TableCell>Số bệnh nhân tối đa</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.dayOfWeek}</TableCell>
                    <TableCell>{schedule.startTime}</TableCell>
                    <TableCell>{schedule.endTime}</TableCell>
                    <TableCell>{schedule.room}</TableCell>
                    <TableCell>{schedule.maxPatients}</TableCell>
                    <TableCell>{schedule.notes}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpen(schedule)}
                      >
                        Chỉnh sửa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedSchedule ? 'Chỉnh sửa Lịch làm việc' : 'Thêm Lịch làm việc mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Thứ</InputLabel>
              <Select
                value={formData.dayOfWeek}
                label="Thứ"
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                required
              >
                <MenuItem value="Thứ 2">Thứ 2</MenuItem>
                <MenuItem value="Thứ 3">Thứ 3</MenuItem>
                <MenuItem value="Thứ 4">Thứ 4</MenuItem>
                <MenuItem value="Thứ 5">Thứ 5</MenuItem>
                <MenuItem value="Thứ 6">Thứ 6</MenuItem>
                <MenuItem value="Thứ 7">Thứ 7</MenuItem>
                <MenuItem value="Chủ nhật">Chủ nhật</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Giờ bắt đầu"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Giờ kết thúc"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Phòng"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Số bệnh nhân tối đa"
              type="number"
              value={formData.maxPatients}
              onChange={(e) => setFormData({ ...formData, maxPatients: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Ghi chú"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedSchedule ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Schedule; 