import path from 'path';
import fs from 'fs/promises';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import * as fileService from '../services/fileService.js';
import { logAudit } from '../services/auditService.js';
import { env } from '../config/env.js';

const ALLOWED_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'text/plain',
];

const isAllowedMime = (mime) => {
  if (!mime) return false;
  const lower = mime.toLowerCase();
  if (ALLOWED_MIMES.includes(lower)) return true;
  if (lower.startsWith('image/')) return true;
  return false;
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'No file uploaded');
    }
    const file = req.file;
    const mime = (file.mimetype || '').toLowerCase();
    if (!isAllowedMime(mime)) {
      await fs.unlink(file.path).catch(() => {});
      return errorResponse(res, 400, 'File type not allowed');
    }

    const body = req.body || {};
    const retention_years = parseInt(body.retention_years, 10) || 5;
    const building = (body.building || '').trim();
    const room = (body.room || '').trim();

    const fileUrl = `/uploads/${path.basename(file.path)}`;
    const doc = await fileService.createFileRecord({
      file_name: file.originalname,
      file_url: fileUrl,
      file_type: file.mimetype,
      file_size: file.size,
      uploaded_by: req.user.id,
      retention_years,
      building,
      room,
    });

    await logAudit(req, 'UPLOAD', { file_id: doc.file_id, file_ref: doc._id });

    return successResponse(res, 201, 'File uploaded successfully', {
      file: doc.toObject ? doc.toObject() : doc,
    });
  } catch (err) {
    next(err);
  }
};

export const getFiles = async (req, res, next) => {
  try {
    const result = await fileService.listFiles(req.query);
    return successResponse(res, 200, 'Files retrieved', result);
  } catch (err) {
    next(err);
  }
};

export const getFileById = async (req, res, next) => {
  try {
    const file = await fileService.findFileById(req.params.id);
    if (!file) {
      return errorResponse(res, 404, 'File not found');
    }
    await logAudit(req, 'VIEW', { file_id: file.file_id, file_ref: file._id });
    return successResponse(res, 200, 'File retrieved', { file });
  } catch (err) {
    next(err);
  }
};

export const updateFile = async (req, res, next) => {
  try {
    const file = await fileService.updateFileRecord(req.params.id, req.body, req.user.id);
    if (!file) {
      return errorResponse(res, 404, 'File not found');
    }
    await logAudit(req, 'UPDATE', { file_id: file.file_id, file_ref: file._id });
    return successResponse(res, 200, 'File updated', { file });
  } catch (err) {
    next(err);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const file = await fileService.findFileById(req.params.id);
    if (!file) {
      return errorResponse(res, 404, 'File not found');
    }
    const fullPath = path.join(process.cwd(), file.file_url);
    await fs.unlink(fullPath).catch(() => {});
    await fileService.deleteFileRecord(req.params.id);
    await logAudit(req, 'DELETE', { file_id: file.file_id });
    return successResponse(res, 200, 'File deleted');
  } catch (err) {
    next(err);
  }
};

export const getVersionHistory = async (req, res, next) => {
  try {
    const history = await fileService.getVersionHistory(req.params.id);
    return successResponse(res, 200, 'Version history', { history });
  } catch (err) {
    next(err);
  }
};
