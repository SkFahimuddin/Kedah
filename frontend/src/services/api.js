import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePassword: async (passwords) => {
    const response = await api.put('/auth/update-password', passwords);
    return response.data;
  },
};

// Complaint Services
export const complaintService = {
  getAll: async (params) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/complaints/${id}`, data);
    return response.data;
  },

  assign: async (id, userId) => {
    const response = await api.put(`/complaints/${id}/assign`, { assignedTo: userId });
    return response.data;
  },

  resolve: async (id, resolutionNotes) => {
    const response = await api.put(`/complaints/${id}/resolve`, { resolutionNotes });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/complaints/stats');
    return response.data;
  },
};

// Dashboard Services
export const dashboardService = {
  getOverview: async (params) => {
    const response = await api.get('/dashboard/overview', { params });
    return response.data;
  },

  getComplaintAnalytics: async (period) => {
    const response = await api.get('/dashboard/complaint-analytics', { params: { period } });
    return response.data;
  },

  getProductionAnalytics: async (period) => {
    const response = await api.get('/dashboard/production-analytics', { params: { period } });
    return response.data;
  },

  getMaintenanceAnalytics: async (period) => {
    const response = await api.get('/dashboard/maintenance-analytics', { params: { period } });
    return response.data;
  },

  getKPIs: async () => {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  },
};

// Meter Reading Services
export const meterReadingService = {
  getAll: async (params) => {
    const response = await api.get('/meter-readings', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/meter-readings', data);
    return response.data;
  },
};

// Asset Services
export const assetService = {
  getAll: async (params) => {
    const response = await api.get('/assets', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/assets', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/assets/${id}`, data);
    return response.data;
  },
};

// Task Services
export const taskService = {
  getAll: async (params) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },
};

export default api;
