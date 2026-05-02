const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  const bearerMatch =
    typeof authHeader === 'string' && authHeader.match(/^Bearer\s+(\S+)/i);

  if (bearerMatch) {
    try {
      token = bearerMatch[1].trim();
      if (!token) {
        token = null;
      } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId || decoded.id;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: 'Not authorized, invalid token'
          });
        }
        req.user = await User.findById(userId).select('-password');

        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'User not found'
          });
        }

        return next();
      }
    } catch (error) {
      token = null;
    }
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId || decoded.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token'
        });
      }
      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = protect;
