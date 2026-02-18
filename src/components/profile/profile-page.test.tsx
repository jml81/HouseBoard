import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth, TEST_RESIDENT } from '@/test-utils';
import { ProfilePage } from './profile-page';

function mockFetch(data: unknown): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    setTestAuth();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders user info', () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByText('Profiili')).toBeInTheDocument();
    expect(screen.getByText('Aino Virtanen')).toBeInTheDocument();
    expect(screen.getByText('asukas@talo.fi')).toBeInTheDocument();
    expect(screen.getByText('A 12')).toBeInTheDocument();
    expect(screen.getByText('Asukas')).toBeInTheDocument();
  });

  it('enables editing when edit button clicked', async () => {
    renderWithProviders(<ProfilePage />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Muokkaa tietoja'));

    // Name should now be an input
    expect(screen.getByDisplayValue('Aino Virtanen')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A 12')).toBeInTheDocument();
    expect(screen.getByText('Tallenna')).toBeInTheDocument();
    expect(screen.getByText('Peruuta')).toBeInTheDocument();
  });

  it('saves profile changes', async () => {
    const updated = { ...TEST_RESIDENT, name: 'Updated Name' };
    mockFetch(updated);

    renderWithProviders(<ProfilePage />);
    const user = userEvent.setup();

    await user.click(screen.getByText('Muokkaa tietoja'));

    const nameInput = screen.getByDisplayValue('Aino Virtanen');
    await user.clear(nameInput);
    await user.paste('Updated Name');
    await user.click(screen.getByText('Tallenna'));

    expect(fetch).toHaveBeenCalledWith(
      '/api/profile',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('shows password validation errors', async () => {
    renderWithProviders(<ProfilePage />);
    const user = userEvent.setup();

    const newPasswordInput = screen.getByLabelText('Uusi salasana');
    await user.click(newPasswordInput);
    await user.paste('short');

    expect(screen.getByText('Salasanan pitää olla vähintään 8 merkkiä')).toBeInTheDocument();
  });

  it('shows password mismatch error', async () => {
    renderWithProviders(<ProfilePage />);
    const user = userEvent.setup();

    const newPasswordInput = screen.getByLabelText('Uusi salasana');
    await user.click(newPasswordInput);
    await user.paste('ValidPass123!');

    const confirmInput = screen.getByLabelText('Vahvista salasana');
    await user.click(confirmInput);
    await user.paste('DifferentPass!');

    expect(screen.getByText('Salasanat eivät täsmää')).toBeInTheDocument();
  });

  it('submits password change', async () => {
    mockFetch({ success: true });

    renderWithProviders(<ProfilePage />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Nykyinen salasana'));
    await user.paste('OldPass123!');

    await user.click(screen.getByLabelText('Uusi salasana'));
    await user.paste('NewPass456!');

    await user.click(screen.getByLabelText('Vahvista salasana'));
    await user.paste('NewPass456!');

    await user.click(screen.getByRole('button', { name: 'Vaihda salasana' }));

    expect(fetch).toHaveBeenCalledWith(
      '/api/profile/change-password',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
