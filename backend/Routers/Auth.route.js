import express from 'express';
import { register, login, getMe } from '../Controllers/Auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateRegister, validateLogin } from '../middleware/validator.middleware.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, getMe);

export default router;

