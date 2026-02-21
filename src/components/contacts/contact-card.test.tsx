import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Contact } from '@/types';
import { ContactCard } from './contact-card';

const mockContact: Contact = {
  id: 'c1',
  name: 'Matti Meikäläinen',
  role: 'huolto',
  company: 'Huolto Oy',
  phone: '050 123 4567',
  email: 'matti@huolto.fi',
  description: 'Kiinteistöhuolto',
};

describe('ContactCard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    useAuthStore.setState({
      isAuthenticated: false,
      isManager: false,
      user: null,
      token: null,
    });
  });

  it('renders contact details', () => {
    renderWithProviders(<ContactCard contact={mockContact} />);
    expect(screen.getByText('Matti Meikäläinen')).toBeInTheDocument();
    expect(screen.getByText('Huolto Oy')).toBeInTheDocument();
    expect(screen.getByText('Kiinteistöhuolto')).toBeInTheDocument();
    expect(screen.getByText('050 123 4567')).toBeInTheDocument();
    expect(screen.getByText('matti@huolto.fi')).toBeInTheDocument();
  });

  it('shows edit/delete buttons for manager', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<ContactCard contact={mockContact} />);
    expect(screen.getByLabelText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByLabelText('Poista yhteystieto')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for resident', () => {
    setTestAuth({ isManager: false });
    renderWithProviders(<ContactCard contact={mockContact} />);
    expect(screen.queryByLabelText('Muokkaa')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Poista yhteystieto')).not.toBeInTheDocument();
  });

  it('opens edit dialog when edit button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<ContactCard contact={mockContact} />);

    await user.click(screen.getByLabelText('Muokkaa'));
    expect(await screen.findByText('Muokkaa yhteystietoa')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('Matti Meikäläinen');
  });

  it('opens delete confirmation dialog when delete button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<ContactCard contact={mockContact} />);

    await user.click(screen.getByLabelText('Poista yhteystieto'));
    expect(
      await screen.findByText('Haluatko varmasti poistaa tämän yhteystiedon?'),
    ).toBeInTheDocument();
  });

  it('calls delete API when confirming deletion', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderWithProviders(<ContactCard contact={mockContact} />);

    await user.click(screen.getByLabelText('Poista yhteystieto'));
    await screen.findByText('Haluatko varmasti poistaa tämän yhteystiedon?');
    await user.click(screen.getByRole('button', { name: 'Poista' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/contacts/c1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
