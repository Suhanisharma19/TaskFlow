/**
 * Role-based access control middleware
 */

/**
 * Require admin role
 */
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

/**
 * Require member role (admin or member)
 */
const requireMember = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'member')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Authentication required.'
    });
  }
};

module.exports = { requireAdmin, requireMember };
