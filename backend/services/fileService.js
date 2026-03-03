import { File } from '../models/File.js';
import { FileVersion } from '../models/FileVersion.js';
import { generateFileId } from '../utils/generateFileId.js';
import { logger } from '../utils/logger.js';

const getStatus = (expiryDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const days = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Expired';
  if (days <= 30) return 'Expiring Soon';
  return 'Active';
};

export const createFileRecord = async (payload) => {
  const fileId = await generateFileId();
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + (payload.retention_years || 5));

  const doc = await File.create({
    file_id: fileId,
    file_name: payload.file_name,
    file_url: payload.file_url,
    file_type: payload.file_type,
    file_size: payload.file_size,
    uploaded_by: payload.uploaded_by,
    retention_years: payload.retention_years || 5,
    expiry_date: expiryDate,
    status: getStatus(expiryDate),
    building: payload.building || '',
    room: payload.room || '',
    location: [payload.building, payload.room].filter(Boolean).join(' - ') || '',
  });
  return doc;
};

export const findFileById = (fileId) => {
  return File.findOne({ file_id: fileId }).populate('uploaded_by', 'name email');
};

export const findFileByMongoId = (id) => {
  return File.findById(id).populate('uploaded_by', 'name email');
};

export const listFiles = async (query) => {
  const { page = 1, limit = 10, status, sort = 'newest', search } = query;
  const filter = {};

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search && search.trim()) {
    filter.$or = [
      { file_id: new RegExp(search.trim(), 'i') },
      { file_name: new RegExp(search.trim(), 'i') },
    ];
  }

  const sortOpt = {};
  switch (sort) {
    case 'oldest':
      sortOpt.createdAt = 1;
      break;
    case 'expiry':
      sortOpt.expiry_date = 1;
      break;
    case 'name':
      sortOpt.file_name = 1;
      break;
    default:
      sortOpt.createdAt = -1;
  }

  const skip = (page - 1) * limit;
  const [files, total] = await Promise.all([
    File.find(filter).sort(sortOpt).skip(skip).limit(limit).populate('uploaded_by', 'name email').lean(),
    File.countDocuments(filter),
  ]);

  return { files, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const updateFileRecord = async (fileId, updates, userId) => {
  const file = await File.findOne({ file_id: fileId });
  if (!file) return null;

  const prev = file.toObject();
  if (updates.retention_years != null) {
    const expiry = new Date(file.createdAt);
    expiry.setFullYear(expiry.getFullYear() + updates.retention_years);
    updates.expiry_date = expiry;
  }
  Object.assign(file, updates);
  await file.save();

  const versionCount = await FileVersion.countDocuments({ file: file._id });
  await FileVersion.create({
    file: file._id,
    file_id: file.file_id,
    version: versionCount + 1,
    file_name: file.file_name,
    file_url: file.file_url,
    file_type: file.file_type,
    file_size: file.file_size,
    retention_years: file.retention_years,
    expiry_date: file.expiry_date,
    status: file.status,
    building: file.building || '',
    room: file.room || '',
    location: file.location || '',
    changed_by: userId,
  });

  return file;
};

export const deleteFileRecord = async (fileId) => {
  const file = await File.findOneAndDelete({ file_id: fileId });
  return file;
};

export const getVersionHistory = async (fileId) => {
  return FileVersion.find({ file_id: fileId })
    .sort({ version: -1 })
    .populate('changed_by', 'name email')
    .lean();
};

/**
 * Periodic file check: update status (Active / Expiring Soon / Expired) for all files
 * based on current date vs expiry_date. Run on a schedule and once on startup.
 * Active: expiry > 30 days away; Expiring Soon: 0–30 days; Expired: past.
 */
export const runPeriodicFileStatusCheck = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);
  in30.setHours(23, 59, 59, 999);

  const expiredResult = await File.updateMany(
    { expiry_date: { $lt: today } },
    { $set: { status: 'Expired' } }
  );
  const expiringResult = await File.updateMany(
    { expiry_date: { $gte: today, $lte: in30 } },
    { $set: { status: 'Expiring Soon' } }
  );
  const activeResult = await File.updateMany(
    { expiry_date: { $gt: in30 } },
    { $set: { status: 'Active' } }
  );

  const total = expiredResult.modifiedCount + expiringResult.modifiedCount + activeResult.modifiedCount;
  if (total > 0) {
    logger.info(
      `Periodic file check: updated ${total} file(s) (Expired: ${expiredResult.modifiedCount}, Expiring Soon: ${expiringResult.modifiedCount}, Active: ${activeResult.modifiedCount})`
    );
  }
  return { expired: expiredResult.modifiedCount, expiringSoon: expiringResult.modifiedCount, active: activeResult.modifiedCount };
};
