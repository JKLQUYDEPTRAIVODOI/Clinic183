# Clinic HMS (Healthcare Management System)

Hệ thống quản lý phòng khám toàn diện với các chức năng dành cho quản trị viên (Admin), bác sĩ và bệnh nhân.

## Công nghệ sử dụng

- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Express.js, Node.js
- **Database**: MySQL

## Các tính năng chính

### Admin
- Quản lý người dùng và bác sĩ
- Quản lý thuốc
- Thống kê doanh thu
- Quản lý lịch hẹn
- Quản lý lịch sử khám bệnh
- Quản lý chẩn đoán
- Quản lý dịch vụ và hóa đơn

### Bệnh nhân
- Quản lý hồ sơ cá nhân
- Xem lịch sử khám bệnh
- Đặt lịch hẹn với bác sĩ
- Quản lý lịch hẹn cá nhân
- Xem chi phí đã thanh toán
- Xem danh sách bác sĩ

### Bác sĩ
- Quản lý cuộc hẹn
- Kê đơn thuốc và chẩn đoán
- Xem lịch sử khám bệnh và hồ sơ bệnh nhân

## Cài đặt và chạy dự án

### Yêu cầu
- Node.js (phiên bản 14 trở lên)
- MySQL

### Cài đặt

1. **Clone dự án**

```bash
git clone <repository-url>
cd Clinic_HMS
```

2. **Cài đặt thư viện cho Backend**

```bash
cd backend
npm install
```

3. **Cài đặt thư viện cho Frontend**

```bash
cd frontend
npm install
```

4. **Thiết lập database**

- Tạo database MySQL với tên `clinic_hms`
- Chạy script SQL trong file `backend/database.sql` để tạo bảng và dữ liệu mẫu

5. **Cấu hình biến môi trường**

- Tạo file `.env` trong thư mục `backend` (hoặc sửa file `.env` hiện có) và cập nhật các thông tin kết nối database:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clinic_hms
JWT_SECRET=your_jwt_secret_key
```

### Chạy dự án

1. **Chạy Backend**

```bash
cd backend
npm run dev
```

Backend sẽ chạy trên: http://localhost:5000

2. **Chạy Frontend**

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy trên: http://localhost:3000 (hoặc port được Vite cấu hình)

### Tài khoản mặc định

- **Admin**: 
  - Email: admin@clinichms.com
  - Password: admin123

## Thông tin liên hệ

Nếu có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng liên hệ với chúng tôi. 