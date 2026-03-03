/**
 * Utility functions for localStorage management with performance optimizations
 */

const STORAGE_KEYS = {
  UPLOADED_FILES: 'arc_uploaded_files',
  USER_PREFERENCES: 'arc_user_preferences',
  CACHE: 'arc_cache',
} as const;

// Cache for frequently accessed data
let memoryCache: { [key: string]: any } = {};
let cacheTimestamps: { [key: string]: number } = {};
const CACHE_DURATION = 5000; // 5 seconds

export interface FileData {
  file_id: string;
  file_name: string;
  file_size: number;
  building: string;
  room: string;
  location: string;
  retention_years: number;
  upload_date: string;
  expiry_date: string;
  status: string;
}

/**
 * Get uploaded files from localStorage with caching
 */
export function getUploadedFiles(): FileData[] {
  const cacheKey = STORAGE_KEYS.UPLOADED_FILES;
  const now = Date.now();

  // Check if cached data is still valid
  if (memoryCache[cacheKey] && cacheTimestamps[cacheKey] && (now - cacheTimestamps[cacheKey] < CACHE_DURATION)) {
    return memoryCache[cacheKey];
  }

  // Fetch from localStorage
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES);
    const files = storedData ? JSON.parse(storedData) : [];
    
    // Update status for all files
    const updatedFiles = files.map((file: FileData) => ({
      ...file,
      status: calculateFileStatus(file.expiry_date),
    }));

    // Update cache
    memoryCache[cacheKey] = updatedFiles;
    cacheTimestamps[cacheKey] = now;

    return updatedFiles;
  } catch (error) {
    console.error('Error reading uploaded files:', error);
    return [];
  }
}

/**
 * Save uploaded files to localStorage and invalidate cache
 */
export function saveUploadedFiles(files: FileData[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(files));
    
    // Invalidate cache
    const cacheKey = STORAGE_KEYS.UPLOADED_FILES;
    delete memoryCache[cacheKey];
    delete cacheTimestamps[cacheKey];
    
    return true;
  } catch (error) {
    console.error('Error saving uploaded files:', error);
    return false;
  }
}

/**
 * Add a new file to uploaded files
 */
export function addUploadedFile(file: FileData): boolean {
  const existingFiles = getUploadedFiles();
  existingFiles.unshift(file); // Add to beginning
  return saveUploadedFiles(existingFiles);
}

/**
 * Calculate file status based on expiry date
 */
export function calculateFileStatus(expiryDate: string): string {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return "Expired";
  } else if (daysUntilExpiry <= 30) {
    return "Expiring Soon";
  } else {
    return "Active";
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  memoryCache = {};
  cacheTimestamps = {};
}

/**
 * Force refresh cache for a specific key
 */
export function refreshCache(key: string): void {
  delete memoryCache[key];
  delete cacheTimestamps[key];
}

/**
 * Get files with filtering and sorting (optimized)
 */
export function getFilteredFiles(
  statusFilter: string = 'all',
  sortBy: string = 'newest'
): FileData[] {
  let files = getUploadedFiles();

  // Apply status filter
  if (statusFilter !== 'all') {
    files = files.filter((f) => f.status === statusFilter);
  }

  // Apply sorting
  switch (sortBy) {
    case 'newest':
      files.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
      break;
    case 'oldest':
      files.sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
      break;
    case 'expiry':
      files.sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
      break;
    case 'name':
      files.sort((a, b) => a.file_name.localeCompare(b.file_name));
      break;
  }

  return files;
}

/**
 * Get statistics about uploaded files (optimized)
 */
export function getFileStatistics() {
  const files = getUploadedFiles();
  
  const stats = {
    total: files.length,
    active: files.filter((f) => f.status === "Active").length,
    expiringSoon: files.filter((f) => f.status === "Expiring Soon").length,
    expired: files.filter((f) => f.status === "Expired").length,
  };

  return stats;
}

/**
 * Get files expiring within a certain number of days
 */
export function getExpiringFiles(daysThreshold: number = 30): FileData[] {
  const files = getUploadedFiles();
  const today = new Date();

  return files
    .filter((file) => {
      const expiry = new Date(file.expiry_date);
      const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft > 0 && daysLeft <= daysThreshold;
    })
    .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
}

/**
 * Search files by File ID or name
 */
export function searchFiles(query: string): FileData[] {
  if (!query.trim()) {
    return [];
  }

  const files = getUploadedFiles();
  const lowerQuery = query.toLowerCase().trim();

  return files.filter((file) => 
    file.file_id.toLowerCase().includes(lowerQuery) ||
    file.file_name.toLowerCase().includes(lowerQuery) ||
    file.location.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });
}

/**
 * Get status badge color class
 */
export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "Expiring Soon":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Expired":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

/**
 * Export files to CSV
 */
export function exportToCSV(files: FileData[]): string {
  const headers = [
    'File ID',
    'File Name',
    'File Size (bytes)',
    'Building',
    'Room',
    'Location',
    'Retention Years',
    'Upload Date',
    'Expiry Date',
    'Status'
  ];

  const rows = files.map(file => [
    file.file_id,
    file.file_name,
    file.file_size.toString(),
    file.building,
    file.room,
    file.location,
    file.retention_years.toString(),
    file.upload_date,
    file.expiry_date,
    file.status
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'archive_export.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Validate File ID format (ARC-YYYY-XXXXXX)
 */
export function isValidFileId(fileId: string): boolean {
  const pattern = /^ARC-\d{4}-\d{6}$/;
  return pattern.test(fileId);
}

/**
 * Get monthly upload statistics
 */
export function getMonthlyUploadStats(months: number = 6): { month: string; uploads: number }[] {
  const files = getUploadedFiles();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const stats = [];
  for (let i = months - 1; i >= 0; i--) {
    const targetMonth = (currentMonth - i + 12) % 12;
    const targetYear = currentYear - Math.floor((currentMonth - targetMonth + 12) / 12) + (currentMonth - targetMonth < 0 ? 0 : 0);
    
    const filesInMonth = files.filter((file) => {
      const fileDate = new Date(file.upload_date);
      return fileDate.getMonth() === targetMonth && fileDate.getFullYear() === targetYear;
    }).length;

    stats.push({
      month: monthNames[targetMonth],
      uploads: filesInMonth
    });
  }

  return stats;
}
