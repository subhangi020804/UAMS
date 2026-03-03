import { AuditLog } from '../models/AuditLog.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const action = req.query.action || null;
    const filter = action ? { action } : {};

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email role').lean(),
      AuditLog.countDocuments(filter),
    ]);

    return successResponse(res, 200, 'Audit logs retrieved', {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};
