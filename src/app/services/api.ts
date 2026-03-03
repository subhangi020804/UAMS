import axios, { type AxiosError } from 'axios';

// In dev, use relative /api so Vite proxy forwards to backend (no CORS). Otherwise use env or default.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5001/api' : 'http://localhost:5001/api');

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiResponse>) => {
    const status = err.response?.status;
    const isNetworkError = err.code === 'ERR_NETWORK' || err.message === 'Network Error';
    const is403 = status === 403;
    let message: string;
    if (isNetworkError) {
      message = 'Cannot reach server. Make sure the backend is running (e.g. npm run dev in the backend folder).';
    } else if (is403) {
      message = err.response?.data?.message || 'Access denied. The server rejected the request (403).';
    } else {
      message = err.response?.data?.message || err.message || 'Request failed';
    }
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject({ ...err, message });
  }
);

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: { id: string; name: string; email: string; role: string }; token: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: { id: string; name: string; email: string; role: string }; token: string }>>('/auth/login', data),
};

export const filesApi = {
  list: (params?: { page?: number; limit?: number; status?: string; sort?: string; search?: string }) =>
    api.get<ApiResponse<{ files: FileRecord[]; total: number; page: number; limit: number; totalPages: number }>>('/files', { params }),
  getById: (id: string) => api.get<ApiResponse<{ file: FileRecord }>>(`/files/${id}`),
  upload: (formData: FormData) => api.post<ApiResponse<{ file: FileRecord }>>('/files', formData),
  update: (id: string, data: Partial<FileRecord>) => api.put<ApiResponse<{ file: FileRecord }>>(`/files/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/files/${id}`),
  versionHistory: (id: string) =>
    api.get<ApiResponse<{ history: FileVersionRecord[] }>>(`/files/${id}/versions`),
};

export const dashboardApi = {
  stats: () =>
    api.get<
      ApiResponse<{
        stats: {
          totalFiles: number;
          activeFiles: number;
          expiringSoonFiles: number;
          expiredFiles: number;
          storageUsedBytes: number;
        };
        fileTypeDistribution: { _id: string; count: number }[];
        recentUploads: FileRecord[];
        expiringSoonAlerts: { file_id: string; file_name: string; expiry_date: string }[];
      }>
    >('/dashboard/stats'),
};

export const auditApi = {
  list: (params?: { page?: number; limit?: number; action?: string }) =>
    api.get<ApiResponse<{ logs: AuditLogRecord[]; total: number; page: number; totalPages: number }>>('/audit', { params }),
};

export interface FileRecord {
  _id?: string;
  file_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by?: { name: string; email: string };
  retention_years: number;
  expiry_date: string;
  status: 'Active' | 'Expired' | 'Expiring Soon';
  building?: string;
  room?: string;
  location?: string;
  createdAt?: string;
}

export interface FileVersionRecord {
  version: number;
  file_name: string;
  changed_by: { name: string; email: string };
  createdAt: string;
}

export interface AuditLogRecord {
  _id: string;
  action: string;
  user?: { name: string; email: string };
  file_id?: string;
  ip_address?: string;
  createdAt: string;
}
