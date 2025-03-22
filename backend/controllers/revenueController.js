const db = require('../config/db');

const revenueController = {
  // Lấy tổng quan doanh thu
  getRevenueSummary: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // Query tổng doanh thu và số lượng hóa đơn
      const [summary] = await db.query(`
        SELECT 
          COUNT(DISTINCT i.id) as totalInvoices,
          SUM(i.total_amount) as totalRevenue
        FROM invoices i
        WHERE i.payment_status = 'paid'
        AND i.payment_date BETWEEN ? AND ?
      `, [startDate, endDate]);

      // Query tổng số items
      const [itemSummary] = await db.query(`
        SELECT 
          SUM(ii.quantity) as totalItems
        FROM invoices i
        JOIN invoice_items ii ON i.id = ii.invoice_id
        WHERE i.payment_status = 'paid'
        AND i.payment_date BETWEEN ? AND ?
      `, [startDate, endDate]);

      // Query doanh thu kỳ trước để tính tăng trưởng
      const previousStartDate = new Date(startDate);
      const previousEndDate = new Date(endDate);
      const daysDiff = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      previousStartDate.setDate(previousStartDate.getDate() - daysDiff);
      previousEndDate.setDate(previousEndDate.getDate() - daysDiff);

      const [previousSummary] = await db.query(`
        SELECT 
          SUM(total_amount) as previousRevenue
        FROM invoices
        WHERE payment_status = 'paid'
        AND payment_date BETWEEN ? AND ?
      `, [previousStartDate, previousEndDate]);

      // Lấy dữ liệu từ kết quả query
      const {
        totalInvoices = 0,
        totalRevenue = 0
      } = summary[0] || {};

      const totalItems = Number(itemSummary[0]?.totalItems) || 0;
      const previousRevenue = Number(previousSummary[0]?.previousRevenue) || 0;
      
      // Tính tỷ lệ tăng trưởng
      const growthRate = previousRevenue > 0 
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      res.json({
        totalRevenue: Number(totalRevenue),
        totalInvoices: Number(totalInvoices),
        totalItems: totalItems,
        avgPerInvoice: Number(totalInvoices) > 0 ? Number(totalRevenue) / Number(totalInvoices) : 0,
        paymentRate: 100, // Vì chỉ lấy hóa đơn đã thanh toán
        growthRate: Math.round(growthRate * 10) / 10
      });
    } catch (error) {
      console.error('Error in getRevenueSummary:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy doanh thu theo thời gian
  getRevenueByTime: async (req, res) => {
    try {
      const { startDate, endDate, groupBy = 'month' } = req.query;

      let timeFormat;
      switch (groupBy) {
        case 'day':
          timeFormat = '%Y-%m-%d';
          break;
        case 'month':
          timeFormat = '%Y-%m';
          break;
        case 'year':
          timeFormat = '%Y';
          break;
        default:
          timeFormat = '%Y-%m';
      }

      const [data] = await db.query(`
        SELECT 
          DATE_FORMAT(i.payment_date, ?) as time,
          SUM(i.total_amount) as value,
          COUNT(DISTINCT i.id) as invoiceCount
        FROM invoices i
        WHERE i.payment_status = 'paid'
        AND i.payment_date BETWEEN ? AND ?
        GROUP BY time
        ORDER BY time ASC
      `, [timeFormat, startDate, endDate]);

      res.json(data.map(row => ({
        ...row,
        value: Number(row.value) || 0,
        invoiceCount: Number(row.invoiceCount) || 0
      })));
    } catch (error) {
      console.error('Error in getRevenueByTime:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy doanh thu theo dịch vụ
  getRevenueByService: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const [data] = await db.query(`
        SELECT 
          s.name,
          COUNT(DISTINCT i.id) as invoiceCount,
          SUM(ii.subtotal) as value
        FROM invoices i
        JOIN invoice_items ii ON i.id = ii.invoice_id
        JOIN services s ON s.id = ii.item_id
        WHERE i.payment_status = 'paid'
        AND ii.item_type = 'service'
        AND i.payment_date BETWEEN ? AND ?
        GROUP BY s.id, s.name
        ORDER BY value DESC
        LIMIT 5
      `, [startDate, endDate]);

      res.json(data.map(row => ({
        ...row,
        value: Number(row.value) || 0,
        invoiceCount: Number(row.invoiceCount) || 0
      })));
    } catch (error) {
      console.error('Error in getRevenueByService:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy doanh thu theo bác sĩ
  getRevenueByDoctor: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const [data] = await db.query(`
        SELECT 
          u.name,
          COUNT(DISTINCT i.id) as invoiceCount,
          SUM(i.total_amount) as value
        FROM invoices i
        JOIN appointments a ON a.id = i.appointment_id
        JOIN doctors d ON d.id = a.doctor_id
        JOIN users u ON u.id = d.user_id
        WHERE i.payment_status = 'paid'
        AND i.payment_date BETWEEN ? AND ?
        GROUP BY d.id, u.name
        ORDER BY value DESC
        LIMIT 5
      `, [startDate, endDate]);

      res.json(data.map(row => ({
        ...row,
        value: Number(row.value) || 0,
        invoiceCount: Number(row.invoiceCount) || 0
      })));
    } catch (error) {
      console.error('Error in getRevenueByDoctor:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = revenueController; 