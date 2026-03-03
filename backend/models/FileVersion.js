import mongoose from 'mongoose';

/**
 * Stores metadata history for files so admins can view revision history.
 */
const fileVersionSchema = new mongoose.Schema(
  {
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: true,
    },
    file_id: { type: String, required: true },
    version: { type: Number, required: true },
    file_name: { type: String, required: true },
    file_url: { type: String, required: true },
    file_type: { type: String, required: true },
    file_size: { type: Number, required: true },
    retention_years: { type: Number, required: true },
    expiry_date: { type: Date, required: true },
    status: { type: String, required: true },
    building: { type: String, default: '' },
    room: { type: String, default: '' },
    location: { type: String, default: '' },
    changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    change_reason: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
  }
);

fileVersionSchema.index({ file: 1, version: -1 });
fileVersionSchema.index({ file_id: 1, version: -1 });

export const FileVersion = mongoose.model('FileVersion', fileVersionSchema);
