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
      
      // Attach user info from token (userId and role)
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      
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

// Role-based authorization (uses role from token, no DB query needed)
export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      // Role is already in req.user from protect middleware
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role '${req.user.role}' is not authorized to access this route`
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

