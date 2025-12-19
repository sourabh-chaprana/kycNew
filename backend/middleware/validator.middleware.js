import { body } from 'express-validator';

// Register validation
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isIn(['agent', 'admin'])
    .withMessage('Role must be either agent or admin')
];

// Login validation
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// PNR validation
export const validateCreatePNR = [
  body('pnr')
    .trim()
    .notEmpty()
    .withMessage('PNR is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('PNR must be between 3 and 20 characters'),
  
  body('tag')
    .trim()
    .notEmpty()
    .withMessage('Tag is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('Tag must be between 2 and 10 characters'),
  
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('At least one passenger is required'),
  
  body('passengers.*.name')
    .trim()
    .notEmpty()
    .withMessage('Passenger name is required'),
  
  body('passengers.*.documentId')
    .trim()
    .notEmpty()
    .withMessage('Document ID is required')
];

// Update passenger status validation
export const validateUpdatePassengerStatus = [
  body('status')
    .isIn(['pending', 'approved', 'declined'])
    .withMessage('Status must be pending, approved, or declined'),
  
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason cannot exceed 500 characters')
];

