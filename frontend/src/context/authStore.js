import { create } from 'zustand';
import { authAPI } from '../utils/api';

const useAuthStore = create((set, get) => ({
  admin: null,
  token: localStorage.getItem('admin_token') || null,
  isAuthenticated: !!localStorage.getItem('admin_token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { access_token, admin } = response.data;
      
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_data', JSON.stringify(admin));
      
      set({
        admin,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { access_token, admin } = response.data;
      
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_data', JSON.stringify(admin));
      
      set({
        admin,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    set({
      admin: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      set({ isAuthenticated: false, admin: null });
      return false;
    }
    
    try {
      const response = await authAPI.getMe();
      set({ admin: response.data, isAuthenticated: true });
      return true;
    } catch (error) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      set({ isAuthenticated: false, admin: null, token: null });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
