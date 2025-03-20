-- Create database
CREATE DATABASE IF NOT EXISTS clinic_hms;
USE clinic_hms;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'patient') NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  experience_years INT,
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  blood_group VARCHAR(5),
  address TEXT,
  phone VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT,
  status ENUM('pending', 'accepted', 'completed', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  diagnosis TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medical_record_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);

-- Prescription items table
CREATE TABLE IF NOT EXISTS prescription_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prescription_id INT NOT NULL,
  medicine_id INT NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  instructions TEXT,
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
  payment_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  item_type ENUM('service', 'medicine') NOT NULL,
  item_id INT,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Insert admin user
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@clinichms.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'admin');
-- Password: admin123

-- Insert sample users (doctors)
INSERT INTO users (name, email, password, role) VALUES
('BS. Nguyễn Văn A', 'doctor1@clinichms.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'doctor'),
('BS. Trần Thị B', 'doctor2@clinichms.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'doctor'),
('BS. Lê Văn C', 'doctor3@clinichms.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'doctor'),
('BS. Phạm Thị D', 'doctor4@clinichms.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'doctor');
-- Password: admin123

-- Insert sample users (patients) 
INSERT INTO users (name, email, password, role) VALUES
('Nguyễn Văn Bệnh', 'patient1@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'patient'),
('Trần Thị Khỏe', 'patient2@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'patient'),
('Lê Văn Đau', 'patient3@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'patient'),
('Phạm Thị Ốm', 'patient4@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'patient'),
('Hoàng Văn Mệt', 'patient5@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 'patient');
-- Password: admin123

-- Insert sample doctors
INSERT INTO doctors (user_id, specialization, experience_years, bio) VALUES
(2, 'Nội khoa', 15, 'Bác sĩ chuyên khoa nội với kinh nghiệm điều trị các bệnh về tim mạch và hô hấp.'),
(3, 'Nhi khoa', 10, 'Bác sĩ nhi khoa với kinh nghiệm điều trị các bệnh thường gặp ở trẻ em.'),
(4, 'Da liễu', 8, 'Bác sĩ da liễu với kinh nghiệm điều trị các bệnh về da và thẩm mỹ.'),
(5, 'Tai mũi họng', 12, 'Bác sĩ tai mũi họng với kinh nghiệm điều trị các bệnh về đường hô hấp trên.');

-- Insert sample patients
INSERT INTO patients (user_id, date_of_birth, gender, blood_group, address, phone) VALUES
(6, '1985-05-15', 'male', 'A+', 'Số 10, Đường Lê Lợi, Quận 1, TP.HCM', '0901234567'),
(7, '1990-08-20', 'female', 'B+', 'Số 25, Đường Nguyễn Huệ, Quận 1, TP.HCM', '0912345678'),
(8, '1975-03-10', 'male', 'O+', 'Số 15, Đường Lý Tự Trọng, Quận 3, TP.HCM', '0923456789'),
(9, '1988-12-05', 'female', 'AB+', 'Số 30, Đường Trần Hưng Đạo, Quận 5, TP.HCM', '0934567890'),
(10, '1980-07-25', 'male', 'A-', 'Số 40, Đường Võ Văn Tần, Quận 3, TP.HCM', '0945678901');

-- Insert sample services
INSERT INTO services (name, description, price) VALUES
('Khám tổng quát', 'Kiểm tra sức khỏe tổng quát', 200000),
('Xét nghiệm máu', 'Xét nghiệm máu cơ bản', 150000),
('Chụp X-quang', 'Chụp X-quang ngực', 300000),
('Khám nhi', 'Khám tổng quát cho trẻ em', 250000),
('Khám da liễu', 'Khám và điều trị bệnh da liễu', 200000),
('Khám tai mũi họng', 'Khám và điều trị bệnh tai mũi họng', 200000),
('Khám nội', 'Khám và điều trị bệnh nội khoa', 180000),
('Siêu âm', 'Siêu âm tổng quát', 250000),
('Tư vấn dinh dưỡng', 'Tư vấn chế độ dinh dưỡng phù hợp', 150000),
('Tiêm vắc-xin', 'Tiêm vắc-xin phòng bệnh', 120000);

-- Insert sample medicines
INSERT INTO medicines (name, description, price, stock) VALUES
('Paracetamol', 'Thuốc giảm đau, hạ sốt', 15000, 1000),
('Amoxicillin', 'Kháng sinh', 30000, 800),
('Omeprazole', 'Thuốc điều trị đau dạ dày', 25000, 600),
('Cetirizine', 'Thuốc kháng histamine', 18000, 700),
('Vitamin C', 'Bổ sung vitamin C', 12000, 1200),
('Ibuprofen', 'Thuốc giảm đau, kháng viêm', 20000, 900),
('Salbutamol', 'Thuốc giãn phế quản', 35000, 500),
('Metformin', 'Thuốc điều trị tiểu đường', 28000, 400),
('Loratadine', 'Thuốc kháng dị ứng', 22000, 600),
('Lactulose', 'Thuốc nhuận tràng', 32000, 300);

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
(1, 1, '2024-05-15', '09:00:00', 'Khám sức khỏe định kỳ', 'completed'),
(2, 2, '2024-05-15', '10:30:00', 'Khám trẻ sơ sinh', 'completed'),
(3, 3, '2024-05-16', '14:00:00', 'Bệnh ngoài da', 'completed'),
(4, 4, '2024-05-17', '15:30:00', 'Đau họng', 'completed'),
(5, 1, '2024-05-18', '09:30:00', 'Khó thở', 'accepted'),
(1, 3, '2024-05-19', '10:00:00', 'Nổi mẩn đỏ', 'pending'),
(2, 4, '2024-05-20', '11:00:00', 'Viêm họng', 'pending');

-- Insert sample medical records
INSERT INTO medical_records (appointment_id, diagnosis, notes) VALUES
(1, 'Sức khỏe bình thường', 'Bệnh nhân có sức khỏe tốt, cần bổ sung dinh dưỡng'),
(2, 'Sức khỏe bình thường', 'Trẻ phát triển tốt, cần tiêm phòng đầy đủ'),
(3, 'Viêm da cơ địa', 'Bệnh nhân bị viêm da, cần tránh các chất kích ứng'),
(4, 'Viêm họng cấp', 'Bệnh nhân bị viêm họng, cần uống nhiều nước và nghỉ ngơi');

-- Insert sample prescriptions
INSERT INTO prescriptions (medical_record_id) VALUES
(1),
(2),
(3),
(4);

-- Insert sample prescription items
INSERT INTO prescription_items (prescription_id, medicine_id, dosage, frequency, duration, instructions) VALUES
(1, 5, '1 viên', '2 lần/ngày', '1 tuần', 'Uống sau ăn'),
(1, 1, '1 viên', '3 lần/ngày', '3 ngày', 'Uống khi sốt trên 38.5 độ C'),
(2, 5, '1/2 viên', '1 lần/ngày', '1 tháng', 'Uống sau ăn sáng'),
(3, 4, '1 viên', '2 lần/ngày', '1 tuần', 'Uống sau ăn'),
(3, 6, '1 viên', '3 lần/ngày', '5 ngày', 'Uống sau ăn'),
(4, 2, '1 viên', '2 lần/ngày', '5 ngày', 'Uống sau ăn'),
(4, 1, '1 viên', '3 lần/ngày', '3 ngày', 'Uống khi sốt trên 38.5 độ C');

-- Insert sample invoices
INSERT INTO invoices (patient_id, total_amount, payment_status, payment_date, created_at) VALUES
(1, 350000, 'paid', '2024-05-15 11:30:00', '2024-05-15 09:45:00'),
(2, 400000, 'paid', '2024-05-15 12:15:00', '2024-05-15 11:00:00'),
(3, 350000, 'paid', '2024-05-16 16:00:00', '2024-05-16 14:30:00'),
(4, 350000, 'pending', NULL, '2024-05-17 16:00:00'),
(5, 200000, 'pending', NULL, '2024-05-18 10:00:00');

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, item_type, item_id, quantity, price, name) VALUES
-- Invoice 1
(1, 'service', 1, 1, 200000, 'Khám tổng quát'),
(1, 'service', 2, 1, 150000, 'Xét nghiệm máu'),
(1, 'medicine', 5, 1, 12000, 'Vitamin C'),
(1, 'medicine', 1, 1, 15000, 'Paracetamol'),

-- Invoice 2
(2, 'service', 4, 1, 250000, 'Khám nhi'),
(2, 'service', 8, 1, 250000, 'Siêu âm'),
(2, 'medicine', 5, 1, 12000, 'Vitamin C'),

-- Invoice 3
(3, 'service', 5, 1, 200000, 'Khám da liễu'),
(3, 'medicine', 4, 1, 18000, 'Cetirizine'),
(3, 'medicine', 6, 1, 20000, 'Ibuprofen'),

-- Invoice 4
(4, 'service', 6, 1, 200000, 'Khám tai mũi họng'),
(4, 'medicine', 2, 1, 30000, 'Amoxicillin'),
(4, 'medicine', 1, 1, 15000, 'Paracetamol'),

-- Invoice 5
(5, 'service', 7, 1, 180000, 'Khám nội'),
(5, 'service', 9, 1, 150000, 'Tư vấn dinh dưỡng'); 