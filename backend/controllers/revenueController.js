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
          SUM(CASE WHEN i.payment_status = 'paid' THEN i.total_amount ELSE 0 END) as totalRevenue,
          COUNT(DISTINCT CASE WHEN i.payment_status = 'paid' THEN i.id END) as paidInvoices,
          COUNT(DISTINCT ii.id) as totalItems
        FROM invoices i
        LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
        WHERE i.created_at BETWEEN ? AND ?
      `, [startDate, endDate]);

      // Query doanh thu kỳ trước để tính tăng trưởng
      const previousStartDate = new Date(startDate);
      const previousEndDate = new Date(endDate);
      const daysDiff = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      previousStartDate.setDate(previousStartDate.getDate() - daysDiff);
      previousEndDate.setDate(previousEndDate.getDate() - daysDiff);

      const [previousSummary] = await db.query(`
        SELECT 
          SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as previousRevenue
        FROM invoices
        WHERE created_at BETWEEN ? AND ?
      `, [previousStartDate, previousEndDate]);

      const { totalInvoices, totalRevenue, paidInvoices, totalItems } = summary[0];
      const previousRevenue = previousSummary[0].previousRevenue || 0;
      
      const growthRate = previousRevenue > 0 
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      res.json({
        totalRevenue: totalRevenue || 0,
        totalInvoices: totalInvoices || 0,
        totalItems: totalItems || 0,
        avgPerInvoice: paidInvoices > 0 ? totalRevenue / paidInvoices : 0,
        paymentRate: totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0,
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
          DATE_FORMAT(i.created_at, ?) as time,
          SUM(CASE WHEN i.payment_status = 'paid' THEN i.total_amount ELSE 0 END) as value,
          COUNT(DISTINCT i.id) as invoiceCount
        FROM invoices i
        WHERE i.created_at BETWEEN ? AND ?
        GROUP BY time
        ORDER BY time ASC
      `, [timeFormat, startDate, endDate]);

      res.json(data);
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
          SUM(CASE WHEN i.payment_status = 'paid' THEN ii.price * ii.quantity ELSE 0 END) as value
        FROM invoice_items ii
        JOIN invoices i ON i.id = ii.invoice_id
        JOIN services s ON s.id = ii.item_id
        WHERE 
          ii.item_type = 'service'
          AND i.created_at BETWEEN ? AND ?
        GROUP BY s.id, s.name
        ORDER BY value DESC
        LIMIT 5
      `, [startDate, endDate]);

      res.json(data);
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
          SUM(CASE WHEN i.payment_status = 'paid' THEN i.total_amount ELSE 0 END) as value
        FROM invoices i
        JOIN patients p ON p.id = i.patient_id
        JOIN appointments a ON a.patient_id = p.id
        JOIN doctors d ON d.id = a.doctor_id
        JOIN users u ON u.id = d.user_id
        WHERE 
          a.status = 'completed'
          AND i.created_at BETWEEN ? AND ?
        GROUP BY d.id, u.name
        ORDER BY value DESC
        LIMIT 5
      `, [startDate, endDate]);

      res.json(data);
    } catch (error) {
      console.error('Error in getRevenueByDoctor:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = revenueController; 