import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    file_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^ARC-\d{4}-\d{6}$/, 'Invalid file_id format'],
    },
    file_name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    file_url: {
      type: String,
      required: true,
      trim: true,
    },
    file_type: {
      type: String,
      required: true,
      trim: true,
    },
    file_size: {
      type: Number,
      required: true,
      min: 0,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    retention_years: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Expiring Soon'],
      default: 'Active',
    },
    building: { type: String, trim: true, default: '' },
    room: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

fileSchema.index({ uploaded_by: 1 });
fileSchema.index({ status: 1 });
fileSchema.index({ expiry_date: 1 });
fileSchema.index({ createdAt: -1 });
fileSchema.index({ file_name: 'text', file_id: 'text' });

/**
 * Recalculate status from expiry_date before save.
 */
fileSchema.pre('save', function (next) {
  if (!this.expiry_date) return next();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(this.expiry_date);
  expiry.setHours(0, 0, 0, 0);
  const daysUntil = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) this.status = 'Expired';
  else if (daysUntil <= 30) this.status = 'Expiring Soon';
  else this.status = 'Active';
  next();
});

export const File = mongoose.model('File', fileSchema);
