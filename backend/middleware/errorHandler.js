import { logger } from '../utils/logger.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Centralized error handling middleware.
 * Handles Mongoose, JWT, and generic errors.
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err.message, err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 400, messages.join('; '));
  }

  // Mongoose duplicate key (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return errorResponse(res, 409, `${field} already exists`);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, 400, 'Invalid ID format');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Token expired');
  }

  // Joi validation
  if (err.isJoi) {
    return errorResponse(res, 400, err.details?.[0]?.message || 'Validation error');
  }

  // Multer file size
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 400, 'File too large');
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, statusCode, message);
};
