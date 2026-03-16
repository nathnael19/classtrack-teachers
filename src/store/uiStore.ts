import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      isMobileMenuOpen: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'classtrack-ui-storage',
      partialize: (state) => ({ 
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme 
      }),
    }
  )
);
