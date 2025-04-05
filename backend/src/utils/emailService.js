const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

// Send appointment confirmation email
exports.sendAppointmentConfirmation = async ({ to, name, trackingCode, date, time, department }) => {
  try {
    const formattedDate = new Date(date).toLocaleDateString('vi-VN');
    
    const mailOptions = {
      from: `"Clinic HMS" <${config.email.user}>`,
      to: to,
      subject: 'Xác nhận đặt lịch khám',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Xác nhận đặt lịch khám</h2>
          <p>Xin chào ${name},</p>
          <p>Cảm ơn bạn đã đặt lịch khám tại phòng khám của chúng tôi. Dưới đây là thông tin lịch hẹn của bạn:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Mã theo dõi:</strong> ${trackingCode}</p>
            <p><strong>Ngày khám:</strong> ${formattedDate}</p>
            <p><strong>Giờ khám:</strong> ${time}</p>
            <p><strong>Chuyên khoa:</strong> ${department}</p>
          </div>
          
          <p>Bạn có thể sử dụng mã theo dõi để kiểm tra trạng thái lịch hẹn tại website của chúng tôi.</p>
          
          <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.</p>
          
          <p>Trân trọng,<br>Clinic HMS</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Appointment confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    throw error;
  }
};

// Send appointment status update email
exports.sendStatusUpdateEmail = async ({ to, name, trackingCode, status, note }) => {
  try {
    const statusText = {
      confirmed: 'đã được xác nhận',
      cancelled: 'đã bị hủy',
      completed: 'đã hoàn thành'
    }[status];

    const mailOptions = {
      from: `"Clinic HMS" <${config.email.user}>`,
      to: to,
      subject: `Cập nhật trạng thái lịch hẹn - ${trackingCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Cập nhật trạng thái lịch hẹn</h2>
          <p>Xin chào ${name},</p>
          <p>Lịch hẹn của bạn (mã theo dõi: ${trackingCode}) ${statusText}.</p>
          
          ${note ? `<p><strong>Ghi chú:</strong> ${note}</p>` : ''}
          
          <p>Bạn có thể kiểm tra chi tiết lịch hẹn bằng mã theo dõi trên website của chúng tôi.</p>
          
          <p>Trân trọng,<br>Clinic HMS</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully');
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
}; 