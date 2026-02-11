import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const data = await authService.login(credentials);
        set({
          user: data.data.user,
          token: data.data.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),

      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// UI Store
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: 'light',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));

// Filter Store
export const useFilterStore = create((set) => ({
  complaintFilters: {
    status: '',
    priority: '',
    complaintType: '',
    zone: '',
    startDate: '',
    endDate: '',
  },

  setComplaintFilters: (filters) =>
    set((state) => ({
      complaintFilters: { ...state.complaintFilters, ...filters },
    })),

  resetComplaintFilters: () =>
    set({
      complaintFilters: {
        status: '',
        priority: '',
        complaintType: '',
        zone: '',
        startDate: '',
        endDate: '',
      },
    }),
}));
