import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Protect routes - require valid JWT.
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    if (!token) {
      return errorResponse(res, 401, 'Not authorized. Please login.');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 401, 'User no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired. Please login again.');
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token.');
    }
    logger.error('Auth middleware error:', err);
    return errorResponse(res, 500, 'Authentication failed.');
  }
};

/**
 * Restrict to specific roles (e.g. admin only, manager and above).
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Not authorized.');
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'You do not have permission to perform this action.');
    }
    next();
  };
};
