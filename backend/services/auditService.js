import { AuditLog } from '../models/AuditLog.js';

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;
};

const getAgent = (req) => {
  return req.headers['user-agent'] || null;
};

/**
 * Log an action to the audit trail.
 */
export const logAudit = async (req, action, options = {}) => {
  const payload = {
    action,
    user: req.user?.id || null,
    file_id: options.file_id ?? null,
    file_ref: options.file_ref ?? null,
    ip_address: getClientIp(req),
    user_agent: getAgent(req),
    metadata: options.metadata || {},
  };
  await AuditLog.create(payload);
};
