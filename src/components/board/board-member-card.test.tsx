import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';
import type { BoardMember } from '@/types';
import { BoardMemberCard } from './board-member-card';

const mockMember: BoardMember = {
  id: 'bm1',
  name: 'Liisa Virtanen',
  role: 'puheenjohtaja',
  apartment: 'A 1',
  email: 'liisa@taloyhtiö.fi',
  phone: '040 555 1234',
  termStart: '2025-01-01',
  termEnd: '2026-12-31',
};

describe('BoardMemberCard', () => {
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

  it('renders member details', () => {
    renderWithProviders(<BoardMemberCard member={mockMember} />);
    expect(screen.getByText('Liisa Virtanen')).toBeInTheDocument();
    expect(screen.getByText('Puheenjohtaja')).toBeInTheDocument();
    expect(screen.getByText('A 1')).toBeInTheDocument();
    expect(screen.getByText('liisa@taloyhtiö.fi')).toBeInTheDocument();
    expect(screen.getByText('040 555 1234')).toBeInTheDocument();
  });

  it('shows edit/delete buttons for manager', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<BoardMemberCard member={mockMember} />);
    expect(screen.getByLabelText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByLabelText('Poista jäsen')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for resident', () => {
    setTestAuth({ isManager: false });
    renderWithProviders(<BoardMemberCard member={mockMember} />);
    expect(screen.queryByLabelText('Muokkaa')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Poista jäsen')).not.toBeInTheDocument();
  });

  it('opens edit dialog when edit button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<BoardMemberCard member={mockMember} />);

    await user.click(screen.getByLabelText('Muokkaa'));
    expect(await screen.findByText('Muokkaa jäsentä')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('Liisa Virtanen');
  });

  it('opens delete confirmation dialog when delete button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<BoardMemberCard member={mockMember} />);

    await user.click(screen.getByLabelText('Poista jäsen'));
    expect(
      await screen.findByText('Haluatko varmasti poistaa tämän hallituksen jäsenen?'),
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

    renderWithProviders(<BoardMemberCard member={mockMember} />);

    await user.click(screen.getByLabelText('Poista jäsen'));
    await screen.findByText('Haluatko varmasti poistaa tämän hallituksen jäsenen?');
    await user.click(screen.getByRole('button', { name: 'Poista' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/board-members/bm1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
