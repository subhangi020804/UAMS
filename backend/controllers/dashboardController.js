import { File } from '../models/File.js';
import { successResponse } from '../utils/apiResponse.js';

export const getStats = async (req, res, next) => {
  try {
    const [total, active, expiringSoon, expired, totalSize, byType, recent] = await Promise.all([
      File.countDocuments(),
      File.countDocuments({ status: 'Active' }),
      File.countDocuments({ status: 'Expiring Soon' }),
      File.countDocuments({ status: 'Expired' }),
      File.aggregate([{ $group: { _id: null, total: { $sum: '$file_size' } } }]),
      File.aggregate([{ $group: { _id: '$file_type', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      File.find().sort({ createdAt: -1 }).limit(10).populate('uploaded_by', 'name email').lean(),
    ]);

    const expiringSoonList = await File.find({ status: 'Expiring Soon' })
      .sort({ expiry_date: 1 })
      .limit(10)
      .select('file_id file_name expiry_date')
      .lean();

    const storageUsed = totalSize[0]?.total || 0;

    return successResponse(res, 200, 'Dashboard stats', {
      stats: {
        totalFiles: total,
        activeFiles: active,
        expiringSoonFiles: expiringSoon,
        expiredFiles: expired,
        storageUsedBytes: storageUsed,
      },
      fileTypeDistribution: byType,
      recentUploads: recent,
      expiringSoonAlerts: expiringSoonList,
    });
  } catch (err) {
    next(err);
  }
};
