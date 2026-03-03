import { errorResponse } from '../utils/apiResponse.js';

/**
 * 404 route handler for undefined routes.
 */
export const notFound = (req, res, next) => {
  errorResponse(res, 404, `Not found: ${req.method} ${req.originalUrl}`);
};
