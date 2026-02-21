import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './login-form';
import { renderWithProviders } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';

// Mock useNavigate and Link (Link requires router context)
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...(actual as Record<string, unknown>),
    useNavigate: () => vi.fn(),
    Link: ({
      children,
      to,
      ...props
    }: {
      children: React.ReactNode;
      to: string;
      className?: string;
    }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

describe('LoginForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({
      isAuthenticated: false,
      isManager: false,
      user: null,
      token: null,
    });
  });

  it('renders email and password fields', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByLabelText('Sähköposti')).toBeInTheDocument();
    expect(screen.getByLabelText('Salasana')).toBeInTheDocument();
  });

  it('renders login button', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByRole('button', { name: 'Kirjaudu sisään' })).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid' }),
      }),
    );

    renderWithProviders(<LoginForm />);

    await user.click(screen.getByLabelText('Sähköposti'));
    await user.paste('wrong@test.fi');
    await user.click(screen.getByLabelText('Salasana'));
    await user.paste('wrongpass');
    await user.click(screen.getByRole('button', { name: 'Kirjaudu sisään' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Virheellinen sähköposti tai salasana');
    });
  });

  it('calls login on successful submission', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      token: 'test-token',
      user: {
        id: 'u1',
        name: 'Test',
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

    renderWithProviders(<LoginForm />);

    await user.click(screen.getByLabelText('Sähköposti'));
    await user.paste('test@test.fi');
    await user.click(screen.getByLabelText('Salasana'));
    await user.paste('password');
    await user.click(screen.getByRole('button', { name: 'Kirjaudu sisään' }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
