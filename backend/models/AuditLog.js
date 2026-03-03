import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['UPLOAD', 'DELETE', 'UPDATE', 'LOGIN', 'LOGOUT', 'ROLE_CHANGE', 'VIEW'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    file_id: {
      type: String,
      trim: true,
      default: null,
    },
    file_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      default: null,
    },
    ip_address: {
      type: String,
      trim: true,
      default: null,
    },
    user_agent: { type: String, trim: true, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ file_id: 1, createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
