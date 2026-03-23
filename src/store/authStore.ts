import { create } from 'zustand';
import api from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('geoattend_token'),
  isAuthenticated: !!localStorage.getItem('geoattend_token'),
  // Start as loading if we have a token (need to rehydrate user from backend)
  isLoading: !!localStorage.getItem('geoattend_token'),
  login: (user, token) => {
    localStorage.setItem('geoattend_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('geoattend_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/users/me');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('geoattend_token');
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
