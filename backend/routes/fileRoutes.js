import express from 'express';
import path from 'path';
import multer from 'multer';
import { env } from '../config/env.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  uploadFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  getVersionHistory,
} from '../controllers/fileController.js';
import { listFilesQuerySchema, updateFileSchema, fileIdParamSchema } from '../validators/fileValidator.js';
import fs from 'fs/promises';

const uploadsDir = path.join(process.cwd(), 'uploads');
await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname) || ''}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.UPLOAD_MAX_SIZE },
});

const router = express.Router();

router.use(protect);

router.post('/', upload.single('file'), uploadFile);
router.get('/', validate(listFilesQuerySchema, 'query'), getFiles);
router.get('/:id', validate(fileIdParamSchema, 'params'), getFileById);
router.put('/:id', validate(fileIdParamSchema, 'params'), validate(updateFileSchema), updateFile);
router.get('/:id/versions', validate(fileIdParamSchema, 'params'), getVersionHistory);

router.delete('/:id', restrictTo('admin'), validate(fileIdParamSchema, 'params'), deleteFile);

export default router;
