const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

/**
 * Frontend (e.g. *.up.railway.app) and API are different sites → cross-origin
 * credentialed requests need SameSite=None + Secure. Railway often omits NODE_ENV;
 * still set RAILWAY_* envs, so detect those too.
 */
const useCrossSiteAuthCookie = () => {
  if (process.env.AUTH_COOKIE_SAMESITE === 'lax') return false;
  // Local dev on http://localhost: use Lax + non-Secure. Anything else (Railway,
  // missing NODE_ENV, staging) needs None + Secure so credentialed XHR works
  // across *.up.railway.app subdomains.
  if (process.env.NODE_ENV === 'development') return false;
  return true;
};

const authCookieOptions = () => {
  const crossSite = useCrossSiteAuthCookie();
  return {
    httpOnly: true,
    secure: crossSite,
    sameSite: crossSite ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, authCookieOptions());
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, role, adminAccessKey } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user (password auto-hashed by Mongoose pre-save hook)
    let allowedRole = 'member';
    let adminAccessKeyHash = null;
    if (role === 'admin') {
      const normalizedInputKey = (adminAccessKey || '').trim();
      if (!normalizedInputKey || normalizedInputKey.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Admin access key must be at least 8 characters'
        });
      }

      adminAccessKeyHash = await bcrypt.hash(normalizedInputKey, 12);
      allowedRole = 'admin';
    }

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRole,
      adminAccessKeyHash
    });

    // Generate token
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      ...(isProduction ? {} : { error: error.message })
    });
  }
};

exports.logout = async (req, res) => {
  const { httpOnly, secure, sameSite } = authCookieOptions();
  res.clearCookie('token', {
    httpOnly,
    secure,
    sameSite
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};
