const nodemailer = require('nodemailer');

// Create a test account using Ethereal
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Create transporter for Gmail
const createGmailTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Get appropriate transporter based on environment
const getTransporter = async () => {
  // Use Gmail for both production and development
  return createGmailTransport();
};

// Send appointment confirmation email
exports.sendAppointmentConfirmation = async ({ to, name, trackingCode, date, time, department }) => {
  try {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"Phòng khám" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Xác nhận đặt lịch khám bệnh',
      html: `
        <h2>Xin chào ${name},</h2>
        <p>Cảm ơn bạn đã đặt lịch khám tại phòng khám của chúng tôi.</p>
        <h3>Thông tin lịch khám:</h3>
        <ul>
          <li><strong>Mã theo dõi:</strong> ${trackingCode}</li>
          <li><strong>Ngày khám:</strong> ${date}</li>
          <li><strong>Giờ khám:</strong> ${time}</li>
          <li><strong>Chuyên khoa:</strong> ${department}</li>
        </ul>
        <p>Vui lòng lưu lại mã theo dõi để kiểm tra trạng thái lịch khám của bạn.</p>
        <p>Chúng tôi sẽ liên hệ với bạn sớm nhất có thể để xác nhận lịch hẹn.</p>
        <p>Trân trọng,<br>Phòng khám</p>
      `,
    });

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send status update email
exports.sendStatusUpdateEmail = async ({ to, name, trackingCode, status, note }) => {
  try {
    const transporter = await getTransporter();

    const getStatusText = (status) => {
      switch (status) {
        case 'accepted':
          return 'đã được xác nhận';
        case 'cancelled':
          return 'đã bị hủy';
        case 'completed':
          return 'đã hoàn thành';
        case 'rejected':
          return 'đã bị từ chối';
        default:
          return status;
      }
    };

    const info = await transporter.sendMail({
      from: `"Phòng khám" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Cập nhật trạng thái lịch khám',
      html: `
        <h2>Xin chào ${name},</h2>
        <p>Lịch khám của bạn (mã theo dõi: ${trackingCode}) ${getStatusText(status)}.</p>
        ${note ? `<p><strong>Ghi chú:</strong> ${note}</p>` : ''}
        <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
        <p>Trân trọng,<br>Phòng khám</p>
      `,
    });

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 