const Medicine = require('../models/medicineModel');

// Lấy tất cả thuốc
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.getAll();
    res.json(medicines);
  } catch (error) {
    console.error('Error getting medicines:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy thuốc theo ID
exports.getMedicineById = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Medicine.getById(medicineId);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    console.error('Error getting medicine:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tìm kiếm thuốc theo tên
exports.searchMedicines = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      const medicines = await Medicine.getAll();
      return res.json(medicines);
    }
    
    const medicines = await Medicine.searchByName(name);
    res.json(medicines);
  } catch (error) {
    console.error('Error searching medicines:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tạo thuốc mới
exports.createMedicine = async (req, res) => {
  try {
    const { name, description, price, unit_in_stock, unit } = req.body;
    
    // Validate input
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    const medicineId = await Medicine.create({
      name,
      description: description || '',
      price: parseFloat(price),
      unit_in_stock: parseInt(unit_in_stock) || 0,
      unit: unit || 'Viên'
    });
    
    const newMedicine = await Medicine.getById(medicineId);
    res.status(201).json(newMedicine);
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật thuốc
exports.updateMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const { name, description, price, unit_in_stock, unit } = req.body;
    
    // Validate input
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    const medicineExists = await Medicine.getById(medicineId);
    if (!medicineExists) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    await Medicine.update(medicineId, {
      name,
      description: description || '',
      price: parseFloat(price),
      unit_in_stock: parseInt(unit_in_stock) || 0,
      unit: unit || 'Viên'
    });
    
    const updatedMedicine = await Medicine.getById(medicineId);
    res.json(updatedMedicine);
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Xóa thuốc
exports.deleteMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id;
    
    const medicineExists = await Medicine.getById(medicineId);
    if (!medicineExists) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    await Medicine.delete(medicineId);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật số lượng trong kho
exports.updateStock = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }
    
    const medicineExists = await Medicine.getById(medicineId);
    if (!medicineExists) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    await Medicine.updateStock(medicineId, parseInt(quantity));
    const updatedMedicine = await Medicine.getById(medicineId);
    
    res.json(updatedMedicine);
  } catch (error) {
    console.error('Error updating medicine stock:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 