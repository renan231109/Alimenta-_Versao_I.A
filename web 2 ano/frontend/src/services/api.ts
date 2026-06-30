import axios from 'axios';
import type {
  User,
  Donation,
  PlatformStats,
  ImpactCalculation,
  RankingUser,
  Achievement,
  CityImpact,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('alimenta_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('alimenta_token');
      localStorage.removeItem('alimenta_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/auth/login', { email, password }),
  register: (data: Record<string, unknown>) =>
    api.post<{ user: User; token: string; message: string }>('/auth/register', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  getProfile: () => api.get<User>('/auth/profile'),
  updateProfile: (data: Partial<User>) => api.put<User>('/auth/profile', data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/auth/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const donationsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<Donation[]>('/donations', { params }),
  get: (id: string) => api.get<Donation>(`/donations/${id}`),
  create: (data: FormData) =>
    api.post<Donation>('/donations', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/donations/${id}/status`, { status }),
  request: (id: string, message?: string) =>
    api.post(`/donations/${id}/request`, { message }),
  approveRequest: (requestId: string, scheduledAt?: string) =>
    api.patch(`/donations/requests/${requestId}/approve`, { scheduledAt }),
  rejectRequest: (requestId: string) =>
    api.patch(`/donations/requests/${requestId}/reject`),
  acceptDelivery: (id: string) => api.post(`/donations/${id}/delivery/accept`),
  completeDelivery: (deliveryId: string) =>
    api.patch(`/donations/deliveries/${deliveryId}/complete`),
  volunteerDeliveries: () => api.get('/donations/volunteer/deliveries'),
};

export const analyticsApi = {
  publicStats: () => api.get<PlatformStats>('/analytics/public'),
  dashboard: () => api.get<PlatformStats>('/analytics/dashboard'),
  ranking: () => api.get<RankingUser[]>('/analytics/ranking'),
  cityImpact: () => api.get<CityImpact>('/analytics/city-impact'),
  calculator: (foodKg: number) =>
    api.post<ImpactCalculation>('/analytics/calculator', { foodKg }),
  aiInsights: () => api.get('/analytics/ai/insights'),
  aiPrioritized: (lat: number, lng: number) =>
    api.get<Donation[]>('/analytics/ai/prioritized', { params: { lat, lng } }),
  aiRoute: (lat: number, lng: number) =>
    api.get('/analytics/ai/route', { params: { lat, lng } }),
  achievements: () => api.get<Achievement[]>('/analytics/achievements'),
  certificate: (achievementId: string) =>
    api.get(`/analytics/certificates/${achievementId}`),
  admin: () => api.get('/analytics/admin'),
};

export default api;
