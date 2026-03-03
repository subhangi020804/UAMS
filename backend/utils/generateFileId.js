import { File } from '../models/File.js';

/**
 * Generate unique file ID in format ARC-YYYY-XXXXXX.
 * XXXXXX is a 6-digit sequence per year.
 */
export const generateFileId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ARC-${year}-`;

  const lastFile = await File.findOne({ file_id: new RegExp(`^${prefix}`) })
    .sort({ file_id: -1 })
    .select('file_id')
    .lean();

  let nextNum = 1;
  if (lastFile?.file_id) {
    const match = lastFile.file_id.match(/^ARC-\d{4}-(\d+)$/);
    if (match) nextNum = parseInt(match[1], 10) + 1;
  }

  const seq = nextNum.toString().padStart(6, '0');
  return `${prefix}${seq}`;
};
