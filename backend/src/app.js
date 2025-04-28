const guestAppointmentRoutes = require('./routes/guestAppointmentRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments/guest', guestAppointmentRoutes);
// ... other routes ... 