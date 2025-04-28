const Service = require('../models/serviceModel');

// Lấy tất cả dịch vụ
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy dịch vụ theo ID
exports.getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.getById(serviceId);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error getting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tìm kiếm dịch vụ theo tên
exports.searchServices = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      const services = await Service.getAll();
      return res.json(services);
    }
    
    const services = await Service.searchByName(name);
    res.json(services);
  } catch (error) {
    console.error('Error searching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tạo dịch vụ mới
exports.createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    // Validate input
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    
    const serviceId = await Service.create({
      name,
      description: description || '',
      price: parseFloat(price)
    });
    
    const newService = await Service.getById(serviceId);
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật dịch vụ
exports.updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { name, description, price } = req.body;
    
    // Validate input
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    
    const serviceExists = await Service.getById(serviceId);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await Service.update(serviceId, {
      name,
      description: description || '',
      price: parseFloat(price)
    });
    
    const updatedService = await Service.getById(serviceId);
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Xóa dịch vụ
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    const serviceExists = await Service.getById(serviceId);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await Service.delete(serviceId);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy lịch sử giá của dịch vụ
exports.getServicePriceHistory = async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    const serviceExists = await Service.getById(serviceId);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const priceHistory = await Service.getPriceHistory(serviceId);
    res.json(priceHistory);
  } catch (error) {
    console.error('Error getting service price history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current price of a service
exports.getServicePrice = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.getById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    res.json({
      success: true,
      price: service.price
    });
  } catch (error) {
    console.error('Error in getServicePrice:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy giá dịch vụ',
      error: error.message
    });
  }
}; 