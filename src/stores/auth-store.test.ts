import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './auth-store';

describe('auth-store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isManager: false,
      user: { id: 'u1', name: 'Aino Virtanen', apartment: 'A 12', role: 'resident' },
    });
  });

  it('starts with isManager false', () => {
    expect(useAuthStore.getState().isManager).toBe(false);
  });

  it('starts with default resident user', () => {
    const { user } = useAuthStore.getState();
    expect(user.role).toBe('resident');
    expect(user.name).toBe('Aino Virtanen');
  });

  it('toggleManagerMode switches to manager', () => {
    useAuthStore.getState().toggleManagerMode();
    expect(useAuthStore.getState().isManager).toBe(true);
    expect(useAuthStore.getState().user.role).toBe('manager');
  });

  it('toggleManagerMode switches back to resident', () => {
    useAuthStore.getState().toggleManagerMode();
    useAuthStore.getState().toggleManagerMode();
    expect(useAuthStore.getState().isManager).toBe(false);
    expect(useAuthStore.getState().user.role).toBe('resident');
  });
});
