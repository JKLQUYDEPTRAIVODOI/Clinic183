const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Protect routes - verify token and attach user info
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const [users] = await db.execute(
        'SELECT id, email, role FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Attach user to request object
      req.user = users[0];

      // If user is a doctor, get doctor details
      if (req.user.role === 'doctor') {
        const [doctors] = await db.execute(
          'SELECT * FROM doctors WHERE user_id = ?',
          [req.user.id]
        );
        if (doctors.length > 0) {
          req.doctor = doctors[0];
        }
      }

      // If user is a patient, get patient details
      if (req.user.role === 'patient') {
        const [patients] = await db.execute(
          'SELECT * FROM patients WHERE user_id = ?',
          [req.user.id]
        );
        if (patients.length > 0) {
          req.patient = patients[0];
        }
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Authorize roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
}; 