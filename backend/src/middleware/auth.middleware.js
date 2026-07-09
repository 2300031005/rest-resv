const { verifyToken } = require('../utils/jwt.util');
const User = require('../models/User');

/**
 * Protect middleware to authenticate requests via JWT
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      // Fetch the latest user info from the database (excluding password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        const error = new Error('Not authorized, user not found.');
        error.statusCode = 401;
        return next(error);
      }

      req.user = user;
      return next();
    } catch (err) {
      const error = new Error('Not authorized, token failed.');
      error.statusCode = 401;
      return next(error);
    }
  }

  if (!token) {
    const error = new Error('Not authorized, no token provided.');
    error.statusCode = 401;
    return next(error);
  }
};

/**
 * Authorize middleware to check user roles (RBAC)
 * @param {...string} allowedRoles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const error = new Error('Not authorized to access this resource.');
      error.statusCode = 403; // Forbidden
      return next(error);
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
