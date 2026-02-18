import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';
import type { HousingEvent } from '@/types';
import { EventCard } from './event-card';

const upcomingEvent: HousingEvent = {
  id: 'e1',
  title: 'Kevättalkoot',
  description: 'Piha-alueen siivous',
  date: '2026-03-15',
  startTime: '10:00',
  endTime: '15:00',
  location: 'Piha-alue',
  organizer: 'Hallitus',
  interestedCount: 18,
  status: 'upcoming',
  createdBy: 'u2',
};

const pastEvent: HousingEvent = {
  ...upcomingEvent,
  id: 'e5',
  title: 'Jouluglögihetki',
  status: 'past',
  createdBy: null,
};

describe('EventCard', () => {
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

  it('renders event details', () => {
    renderWithProviders(<EventCard event={upcomingEvent} />);
    expect(screen.getByText('Kevättalkoot')).toBeInTheDocument();
    expect(screen.getByText('Piha-alueen siivous')).toBeInTheDocument();
    expect(screen.getByText('Piha-alue')).toBeInTheDocument();
    expect(screen.getByText(/18 kiinnostunutta/)).toBeInTheDocument();
  });

  it('shows edit/delete buttons for manager on upcoming events', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<EventCard event={upcomingEvent} />);
    expect(screen.getByLabelText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByLabelText('Poista tapahtuma')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for resident', () => {
    setTestAuth({ isManager: false });
    renderWithProviders(<EventCard event={upcomingEvent} />);
    expect(screen.queryByLabelText('Muokkaa')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Poista tapahtuma')).not.toBeInTheDocument();
  });

  it('does not show edit/delete buttons for past events even as manager', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<EventCard event={pastEvent} />);
    expect(screen.queryByLabelText('Muokkaa')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Poista tapahtuma')).not.toBeInTheDocument();
  });

  it('opens edit dialog when edit button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<EventCard event={upcomingEvent} />);

    await user.click(screen.getByLabelText('Muokkaa'));
    expect(await screen.findByText('Muokkaa tapahtumaa')).toBeInTheDocument();
    expect(screen.getByLabelText('Otsikko')).toHaveValue('Kevättalkoot');
  });

  it('opens delete confirmation dialog when delete button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<EventCard event={upcomingEvent} />);

    await user.click(screen.getByLabelText('Poista tapahtuma'));
    expect(
      await screen.findByText(
        'Haluatko varmasti poistaa tämän tapahtuman? Toimintoa ei voi perua.',
      ),
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

    renderWithProviders(<EventCard event={upcomingEvent} />);

    await user.click(screen.getByLabelText('Poista tapahtuma'));
    await screen.findByText('Haluatko varmasti poistaa tämän tapahtuman? Toimintoa ei voi perua.');
    await user.click(screen.getByRole('button', { name: 'Poista' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/events/e1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
