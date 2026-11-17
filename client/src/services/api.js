import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiFetch(endpoint, options = {}) {
  let token = null;
  try {
    const { data } = await supabase.auth.getSession();
    token = data?.session?.access_token;
  } catch (err) {
    // Supabase offline fallback
  }

  if (!token) {
    const savedDemo = localStorage.getItem('smart_lost_found_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        token = `demo-jwt-${parsed.role || 'student'}`;
      } catch (e) {}
    }
  }

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const HealthService = {
  checkHealth: () => apiFetch('/health'),
};

export const UserService = {
  getProfile: () => apiFetch('/me'),
  updateProfile: (data) => apiFetch('/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

export const CategoryService = {
  getCategories: () => apiFetch('/categories'),
  getLocations: () => apiFetch('/locations'),
};

export const ReportService = {
  getReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/reports${query ? `?${query}` : ''}`);
  },
  getReportById: (id) => apiFetch(`/reports/${id}`),
  createReport: (data) => apiFetch('/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  uploadImage: (reportId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch(`/reports/${reportId}/images`, {
      method: 'POST',
      body: formData,
    });
  },
  closeReport: (id) => apiFetch(`/reports/${id}/close`, { method: 'POST' }),
  getMatches: (id) => apiFetch(`/reports/${id}/matches`),
  dismissMatch: (matchId) => apiFetch(`/reports/matches/${matchId}/dismiss`, { method: 'POST' }),
};

export const ClaimService = {
  submitClaim: (data) => apiFetch('/claims', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getMyClaims: () => apiFetch('/claims/mine'),
  getModerationQueue: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/claims/moderation/queue${query ? `?${query}` : ''}`);
  },
  reviewClaim: (id, data) => apiFetch(`/claims/moderation/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  generateHandoverToken: (id) => apiFetch(`/claims/${id}/handover-token`, {
    method: 'POST',
  }),
  redeemHandoverToken: (rawToken) => apiFetch('/claims/handover/redeem', {
    method: 'POST',
    body: JSON.stringify({ rawToken }),
  }),
  confirmManualHandover: (claimId) => apiFetch(`/claims/handover/${claimId}/confirm`, {
    method: 'POST',
  }),
};

export const NotificationService = {
  getNotifications: () => apiFetch('/notifications'),
  markAsRead: (id) => apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => apiFetch('/notifications/read-all', { method: 'PATCH' }),
};

export const AdminService = {
  getAnalytics: () => apiFetch('/admin/analytics'),
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/admin/audit-logs${query ? `?${query}` : ''}`);
  },
};
