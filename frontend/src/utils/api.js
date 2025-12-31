import axios from 'axios';

// For production, use full URL. For development, use proxy '/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://testimonials-system.onrender.com/api';

console.log('API Base URL:', API_BASE_URL);

// Helper function to parse error messages from API responses
export const parseErrorMessage = (error, defaultMessage = 'Terjadi kesalahan') => {
  const errorDetail = error.response?.data?.detail;
  
  if (typeof errorDetail === 'string') {
    return errorDetail;
  } else if (Array.isArray(errorDetail)) {
    // Validation errors from FastAPI (Pydantic)
    return errorDetail.map(err => {
      const field = err.loc ? err.loc[err.loc.length - 1] : '';
      const msg = err.msg || err.message || '';
      return field ? `${field}: ${msg}` : msg;
    }).join(', ');
  } else if (errorDetail?.msg) {
    return errorDetail.msg;
  } else if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      // Only clear and redirect if not on login/register page
      const isAuthPage = window.location.pathname.includes('/admin/login') || 
                         window.location.pathname.includes('/admin/register');
      if (!isAuthPage) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/admin/login', data),
  register: (data) => api.post('/admin/register', data),
  getMe: () => api.get('/admin/me'),
};

// Admin endpoints
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Projects
  getProjects: () => api.get('/admin/projects'),
  getProject: (id) => api.get(`/admin/projects/${id}`),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
  
  // Testimonials
  getTestimonials: (params) => api.get('/testimonials', { params }),
  getTestimonial: (id) => api.get(`/testimonials/${id}`),
  updateTestimonial: (id, data) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),
  toggleFeatured: (id) => api.post(`/testimonials/${id}/toggle-featured`),
  togglePublished: (id) => api.post(`/testimonials/${id}/toggle-published`),
};

// Token endpoints
export const tokenAPI = {
  getAll: () => api.get('/tokens'),
  getByProject: (projectId) => api.get(`/tokens/project/${projectId}`),
  generate: (data) => api.post('/tokens/generate', data),
  validate: (token) => api.get(`/tokens/validate/${token}`),
  revoke: (id) => api.delete(`/tokens/${id}`),
};

// Public endpoints (no auth required)
export const publicAPI = {
  getTestimonials: (params) => axios.get(`${API_BASE_URL}/public/testimonials`, { params }),
  getFeaturedTestimonials: (limit = 10) => axios.get(`${API_BASE_URL}/public/testimonials/featured`, { params: { limit } }),
  getProjects: () => axios.get(`${API_BASE_URL}/public/projects`),
  getStats: () => axios.get(`${API_BASE_URL}/public/stats`),
  validateToken: (token) => axios.get(`${API_BASE_URL}/tokens/validate/${token}`),
  submitTestimonial: (data) => axios.post(`${API_BASE_URL}/testimonials/submit`, data),
};

export default api;
