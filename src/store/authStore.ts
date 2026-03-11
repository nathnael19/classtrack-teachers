import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'lecturer' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { id: '1', name: 'Dr. Smith', email: 'smith@university.edu', role: 'lecturer' }, // Mock authenticated user
  token: 'mock-token', // Mock token for development
  isAuthenticated: true, 
  login: (user, token) => {
    localStorage.setItem('geoattend_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('geoattend_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
