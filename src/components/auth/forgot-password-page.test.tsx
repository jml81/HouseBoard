import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithRouterContext } from '@/test-utils';
import { ForgotPasswordPage } from './forgot-password-page';

vi.stubGlobal('fetch', vi.fn());

beforeEach(() => {
  vi.mocked(fetch).mockReset();
});

describe('ForgotPasswordPage', () => {
  it('renders the title and email input', async () => {
    await renderWithRouterContext(<ForgotPasswordPage />);
    expect(screen.getByText('Salasanan palautus')).toBeInTheDocument();
    expect(screen.getByLabelText('Sähköposti')).toBeInTheDocument();
  });

  it('renders the submit button', async () => {
    await renderWithRouterContext(<ForgotPasswordPage />);
    expect(screen.getByRole('button', { name: 'Lähetä palautuslinkki' })).toBeInTheDocument();
  });

  it('renders back to login link', async () => {
    await renderWithRouterContext(<ForgotPasswordPage />);
    expect(screen.getByText('Takaisin kirjautumiseen')).toBeInTheDocument();
  });

  it('shows success message after submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'sent' }), { status: 200 }),
    );

    await renderWithRouterContext(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText('Sähköposti'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lähetä palautuslinkki' }));

    await waitFor(() => {
      expect(screen.getByText(/palautuslinkki on lähetetty/i)).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'fail' }), { status: 500 }),
    );

    await renderWithRouterContext(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText('Sähköposti'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lähetä palautuslinkki' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
