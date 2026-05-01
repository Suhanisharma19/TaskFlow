const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { signupValidation, loginValidation, handleValidationErrors } = require('../utils/validators');

// POST /api/auth/signup - Register new user
router.post('/signup', signupValidation, handleValidationErrors, signup);

// POST /api/auth/login - Login user
router.post('/login', loginValidation, handleValidationErrors, login);

// POST /api/auth/logout - Logout user
router.post('/logout', protect, logout);

// GET /api/auth/me - Get current authenticated user
router.get('/me', protect, getMe);

module.exports = router;
