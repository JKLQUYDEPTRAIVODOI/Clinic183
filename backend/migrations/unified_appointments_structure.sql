-- Unified migration for appointments table structure
-- Drop existing table if exists
DROP TABLE IF EXISTS appointments;

-- Create appointments table with updated structure
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NULL,
  doctor_id INT NULL,
  tracking_code VARCHAR(8) NULL UNIQUE,
  guest_name VARCHAR(255),
  guest_phone VARCHAR(20),
  guest_email VARCHAR(255),
  symptoms TEXT,
  appointment_date DATE,
  appointment_time TIME,
  preferred_date DATE,
  preferred_time TIME,
  department VARCHAR(100),
  reason TEXT,
  status ENUM('pending', 'accepted', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Insert existing appointments data
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status, created_at) VALUES
(1, 1, '2024-05-15', '09:00:00', 'Khám sức khỏe định kỳ', 'completed', '2024-05-15 09:00:00'),
(2, 2, '2024-05-15', '10:30:00', 'Khám trẻ sơ sinh', 'completed', '2024-05-15 10:30:00'),
(3, 3, '2024-05-16', '14:00:00', 'Bệnh ngoài da', 'completed', '2024-05-16 14:00:00'),
(4, 4, '2024-05-17', '15:30:00', 'Đau họng', 'completed', '2024-05-17 15:30:00');

-- Insert sample guest appointment
INSERT INTO appointments (tracking_code, guest_name, guest_phone, guest_email, symptoms, appointment_date, appointment_time, department, reason, status) VALUES
('GU123456', 'Nguyễn Văn Khách', '0987654321', 'khach@email.com', 'Ho, sốt nhẹ', '2024-05-20', '09:00:00', 'Nội khoa', 'Khám sức khỏe tổng quát', 'pending'); 