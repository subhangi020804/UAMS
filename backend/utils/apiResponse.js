/**
 * Centralized API response format: { success, message, data }
 */
export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null && data !== undefined && { data }),
  });
};

export const errorResponse = (res, statusCode = 500, message = 'Internal server error', data = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(data !== null && data !== undefined && { data }),
  });
};
