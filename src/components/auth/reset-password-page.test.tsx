import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterContext } from '@/test-utils';
import { ResetPasswordPage } from './reset-password-page';

vi.stubGlobal('fetch', vi.fn());

beforeEach(() => {
  vi.mocked(fetch).mockReset();
});

describe('ResetPasswordPage', () => {
  it('renders the title and password inputs', async () => {
    await renderWithRouterContext(<ResetPasswordPage token="abc123" />);
    expect(screen.getByText('Aseta uusi salasana')).toBeInTheDocument();
    expect(screen.getByLabelText('Uusi salasana')).toBeInTheDocument();
    expect(screen.getByLabelText('Vahvista salasana')).toBeInTheDocument();
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<ResetPasswordPage token="abc123" />);

    const passwordInput = screen.getByLabelText('Uusi salasana');
    const confirmInput = screen.getByLabelText('Vahvista salasana');

    await user.click(passwordInput);
    await user.paste('short');
    await user.click(confirmInput);
    await user.paste('short');
    await user.click(screen.getByRole('button', { name: 'Vaihda salasana' }));

    expect(screen.getByRole('alert')).toHaveTextContent('vähintään 8 merkkiä');
  });

  it('shows validation error for password mismatch', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<ResetPasswordPage token="abc123" />);

    const passwordInput = screen.getByLabelText('Uusi salasana');
    const confirmInput = screen.getByLabelText('Vahvista salasana');

    await user.click(passwordInput);
    await user.paste('ValidPass1!');
    await user.click(confirmInput);
    await user.paste('DifferentPass1!');
    await user.click(screen.getByRole('button', { name: 'Vaihda salasana' }));

    expect(screen.getByRole('alert')).toHaveTextContent('eivät täsmää');
  });

  it('shows success message after valid submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );

    const user = userEvent.setup();
    await renderWithRouterContext(<ResetPasswordPage token="abc123" />);

    const passwordInput = screen.getByLabelText('Uusi salasana');
    const confirmInput = screen.getByLabelText('Vahvista salasana');

    await user.click(passwordInput);
    await user.paste('NewPassword1!');
    await user.click(confirmInput);
    await user.paste('NewPassword1!');
    await user.click(screen.getByRole('button', { name: 'Vaihda salasana' }));

    await waitFor(() => {
      expect(screen.getByText(/vaihdettu onnistuneesti/i)).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Invalid token' }), { status: 400 }),
    );

    const user = userEvent.setup();
    await renderWithRouterContext(<ResetPasswordPage token="expired-token" />);

    const passwordInput = screen.getByLabelText('Uusi salasana');
    const confirmInput = screen.getByLabelText('Vahvista salasana');

    await user.click(passwordInput);
    await user.paste('NewPassword1!');
    await user.click(confirmInput);
    await user.paste('NewPassword1!');
    await user.click(screen.getByRole('button', { name: 'Vaihda salasana' }));

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.some((a) => a.textContent?.includes('virheellinen tai vanhentunut'))).toBe(
        true,
      );
    });
  });
});
