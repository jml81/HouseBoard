import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { useLogin } from './use-auth';
import { useAuthStore } from '@/stores/auth-store';
import { renderWithProviders } from '@/test-utils';

function LoginTestComponent(): React.JSX.Element {
  const loginMutation = useLogin();

  return (
    <div>
      <span data-testid="status">
        {loginMutation.isPending
          ? 'pending'
          : loginMutation.isSuccess
            ? 'success'
            : loginMutation.isError
              ? 'error'
              : 'idle'}
      </span>
      <button onClick={() => loginMutation.mutate({ email: 'test@test.fi', password: 'pass' })}>
        login
      </button>
      <button onClick={() => loginMutation.mutate({ email: 'wrong@test.fi', password: 'wrong' })}>
        loginFail
      </button>
    </div>
  );
}

describe('useLogin', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({
      isAuthenticated: false,
      isManager: false,
      user: null,
      token: null,
    });
  });

  it('calls login on auth store on success', async () => {
    const mockResponse = {
      token: 'jwt-token',
      user: {
        id: 'u1',
        name: 'Test User',
        email: 'test@test.fi',
        apartment: 'A 1',
        role: 'resident',
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    renderWithProviders(<LoginTestComponent />);

    screen.getByText('login').click();

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('success');
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('jwt-token');
    expect(state.user?.email).toBe('test@test.fi');
  });

  it('does not update store on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid' }),
      }),
    );

    renderWithProviders(<LoginTestComponent />);

    screen.getByText('loginFail').click();

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('error');
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
