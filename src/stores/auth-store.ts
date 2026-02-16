import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  isManager: boolean;
  user: User;
  toggleManagerMode: () => void;
}

const DEFAULT_USER: User = {
  id: 'u1',
  name: 'Aino Virtanen',
  apartment: 'A 12',
  role: 'resident',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isManager: false,
      user: DEFAULT_USER,
      toggleManagerMode: () =>
        set((state) => ({
          isManager: !state.isManager,
          user: { ...state.user, role: state.isManager ? 'resident' : 'manager' },
        })),
    }),
    {
      name: 'houseboard-auth',
      partialize: (state) => ({ isManager: state.isManager }),
    },
  ),
);
