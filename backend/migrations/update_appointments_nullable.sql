-- Modify appointment_date and appointment_time columns to allow NULL
ALTER TABLE appointments
MODIFY COLUMN appointment_date DATE NULL,
MODIFY COLUMN appointment_time TIME NULL; 