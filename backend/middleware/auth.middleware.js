import jwt from 'jsonwebtoken';
import User from '../Modals/Auth.Modal.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = decoded;
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role '${user.role}' is not authorized to access this route`
        });
      }

      next();
    } catch (error) {
      console.error('Authorize middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };
};

