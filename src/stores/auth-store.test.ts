import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './auth-store';
import type { AuthResponse } from '@/types';

const MOCK_RESIDENT_RESPONSE: AuthResponse = {
  token: 'resident-token',
  user: {
    id: 'u1',
    name: 'Aino Virtanen',
    email: 'asukas@talo.fi',
    apartment: 'A 12',
    role: 'resident',
  },
};

const MOCK_MANAGER_RESPONSE: AuthResponse = {
  token: 'manager-token',
  user: {
    id: 'u2',
    name: 'Mikko Lahtinen',
    email: 'isannoitsija@talo.fi',
    apartment: 'A 4',
    role: 'manager',
  },
};

describe('auth-store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isManager: false,
      user: null,
      token: null,
    });
  });

  it('starts logged out', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('login sets authenticated state with resident', () => {
    useAuthStore.getState().login(MOCK_RESIDENT_RESPONSE);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('resident-token');
    expect(state.user?.role).toBe('resident');
    expect(state.isManager).toBe(false);
  });

  it('login sets isManager true for manager role', () => {
    useAuthStore.getState().login(MOCK_MANAGER_RESPONSE);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isManager).toBe(true);
  });

  it('logout clears all state', () => {
    useAuthStore.getState().login(MOCK_MANAGER_RESPONSE);
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isManager).toBe(false);
  });

  it('toggleManagerMode toggles for manager user', () => {
    useAuthStore.getState().login(MOCK_MANAGER_RESPONSE);
    expect(useAuthStore.getState().isManager).toBe(true);
    useAuthStore.getState().toggleManagerMode();
    expect(useAuthStore.getState().isManager).toBe(false);
    useAuthStore.getState().toggleManagerMode();
    expect(useAuthStore.getState().isManager).toBe(true);
  });

  it('toggleManagerMode does nothing for resident user', () => {
    useAuthStore.getState().login(MOCK_RESIDENT_RESPONSE);
    useAuthStore.getState().toggleManagerMode();
    expect(useAuthStore.getState().isManager).toBe(false);
  });
});
