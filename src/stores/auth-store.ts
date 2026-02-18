import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isManager: boolean;
  user: User | null;
  token: string | null;
  login: (response: AuthResponse) => void;
  logout: () => void;
  toggleManagerMode: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isManager: false,
      user: null,
      token: null,
      login: (response: AuthResponse) =>
        set({
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          isManager: response.user.role === 'manager',
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          isManager: false,
          user: null,
          token: null,
        }),
      toggleManagerMode: () => {
        const state = get();
        if (state.user?.role !== 'manager') return;
        set({ isManager: !state.isManager });
      },
    }),
    {
      name: 'houseboard-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isManager: state.isManager,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
