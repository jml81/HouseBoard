import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { EventsPage } from './events-page';

const mockEvents = [
  {
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
  },
  {
    id: 'e2',
    title: 'Yhtiökokous',
    description: 'Yhtiökokous',
    date: '2026-03-25',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Kerhohuone',
    organizer: 'Hallitus',
    interestedCount: 22,
    status: 'upcoming',
  },
  {
    id: 'e5',
    title: 'Jouluglögihetki',
    description: 'Glögiä',
    date: '2025-12-14',
    startTime: '16:00',
    endTime: '19:00',
    location: 'Kerhohuone',
    organizer: 'Pihatoimikunta',
    interestedCount: 28,
    status: 'past',
  },
  {
    id: 'e6',
    title: 'Syystalkoot',
    description: 'Haravoidaan',
    date: '2025-10-11',
    startTime: '10:00',
    endTime: '14:00',
    location: 'Piha-alue',
    organizer: 'Hallitus',
    interestedCount: 15,
    status: 'past',
  },
];

describe('EventsPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockEvents), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders page header', () => {
    renderWithProviders(<EventsPage />);
    expect(screen.getByText('Tapahtumat')).toBeInTheDocument();
  });

  it('renders upcoming/past tabs', () => {
    renderWithProviders(<EventsPage />);
    expect(screen.getByText('Tulevat')).toBeInTheDocument();
    expect(screen.getByText('Menneet')).toBeInTheDocument();
  });

  it('renders upcoming events by default', async () => {
    renderWithProviders(<EventsPage />);
    expect(await screen.findByText('Kevättalkoot')).toBeInTheDocument();
    expect(screen.getAllByText('Yhtiökokous').length).toBeGreaterThanOrEqual(1);
  });

  it('shows past events when tab is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventsPage />);

    await screen.findByText('Kevättalkoot');
    await user.click(screen.getByText('Menneet'));
    expect(await screen.findByText('Jouluglögihetki')).toBeInTheDocument();
    expect(screen.getByText('Syystalkoot')).toBeInTheDocument();
  });

  it('renders event details (location, organizer, interested count)', async () => {
    renderWithProviders(<EventsPage />);
    expect(await screen.findByText('Piha-alue')).toBeInTheDocument();
    expect(screen.getAllByText(/Hallitus/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/18 kiinnostunutta/)).toBeInTheDocument();
  });
});
