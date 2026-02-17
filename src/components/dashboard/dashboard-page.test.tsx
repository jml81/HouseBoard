import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouterContext } from '@/test-utils';
import { DashboardPage } from './dashboard-page';

const mockAnnouncements = [
  {
    id: 'a1',
    title: 'Kevätsiivous 15.3.2026',
    summary: 'Taloyhtiön kevätsiivous',
    content: 'Sisältö',
    category: 'yleinen',
    author: 'Hallitus',
    publishedAt: '2026-02-28',
    isNew: true,
  },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockAnnouncements), {
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

  it('renders welcome message', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(screen.getByText('Tervetuloa!')).toBeInTheDocument();
  });

  it('renders building name', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(screen.getByText('As Oy Mäntyrinne')).toBeInTheDocument();
  });

  it('renders all four summary cards', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(screen.getByText('Tulevat varaukset')).toBeInTheDocument();
    expect(screen.getByText('Viimeisimmät tiedotteet')).toBeInTheDocument();
    expect(screen.getByText('Tulevat tapahtumat')).toBeInTheDocument();
    expect(screen.getByText('Uusimmat materiaalit')).toBeInTheDocument();
  });

  it('renders show all links', async () => {
    await renderWithRouterContext(<DashboardPage />);
    const showAllLinks = screen.getAllByText('Näytä kaikki');
    expect(showAllLinks).toHaveLength(4);
  });

  it('renders upcoming bookings', async () => {
    await renderWithRouterContext(<DashboardPage />);
    // Multiple "Saunavuoro" entries in the mock data
    expect(screen.getAllByText('Saunavuoro').length).toBeGreaterThanOrEqual(1);
  });

  it('renders latest announcements', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(await screen.findByText('Kevätsiivous 15.3.2026')).toBeInTheDocument();
  });
});
