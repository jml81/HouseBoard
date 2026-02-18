import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { DisplayEventsSlide } from './display-events-slide';

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
    createdBy: 'u2',
  },
  {
    id: 'e5',
    title: 'Jouluglögihetki',
    description: 'Glögiä ja pipareita',
    date: '2025-12-14',
    startTime: '16:00',
    endTime: '19:00',
    location: 'Kerhohuone',
    organizer: 'Pihatoimikunta',
    interestedCount: 28,
    status: 'past',
    createdBy: null,
  },
];

function okJson(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('DisplayEventsSlide', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders upcoming events', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => Promise.resolve(okJson(mockEvents))),
    );

    renderWithProviders(<DisplayEventsSlide />);
    expect(await screen.findByText('Kevättalkoot')).toBeInTheDocument();
  });

  it('does not render past events', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => Promise.resolve(okJson(mockEvents))),
    );

    renderWithProviders(<DisplayEventsSlide />);
    await screen.findByText('Kevättalkoot');
    expect(screen.queryByText('Jouluglögihetki')).not.toBeInTheDocument();
  });

  it('renders no-events message when empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => Promise.resolve(okJson([]))),
    );

    renderWithProviders(<DisplayEventsSlide />);
    expect(await screen.findByText('Ei tulevia tapahtumia')).toBeInTheDocument();
  });
});
