import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterContext } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Announcement } from '@/types';
import { AnnouncementDetail } from './announcement-detail';

const mockAnnouncement: Announcement = {
  id: 'test-1',
  title: 'Testiotsikko',
  summary: 'Yhteenveto',
  content: 'Tämä on testin sisältö.\n\nToinen kappale.',
  category: 'yleinen',
  author: 'Hallitus',
  publishedAt: '2026-03-01',
  isNew: false,
};

describe('AnnouncementDetail', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    useAuthStore.setState({ isManager: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders announcement title', async () => {
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    expect(screen.getByText('Testiotsikko')).toBeInTheDocument();
  });

  it('renders back link', async () => {
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    expect(screen.getByText('Takaisin tiedotteisiin')).toBeInTheDocument();
  });

  it('renders author', async () => {
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    expect(screen.getByText(/Hallitus/)).toBeInTheDocument();
  });

  it('renders full content', async () => {
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    expect(screen.getByText(/Tämä on testin sisältö/)).toBeInTheDocument();
    expect(screen.getByText(/Toinen kappale/)).toBeInTheDocument();
  });

  it('renders category badge', async () => {
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    expect(screen.getByText('Yleinen')).toBeInTheDocument();
  });

  it('renders formatted date', async () => {
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    expect(screen.getByText(/1\.3\.2026/)).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for non-manager', async () => {
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    expect(screen.queryByText('Muokkaa')).not.toBeInTheDocument();
    expect(screen.queryByText('Poista tiedote')).not.toBeInTheDocument();
  });

  it('shows edit/delete buttons for manager', async () => {
    useAuthStore.setState({ isManager: true });
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    expect(screen.getByText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByText('Poista tiedote')).toBeInTheDocument();
  });

  it('opens delete confirmation dialog when delete button clicked', async () => {
    useAuthStore.setState({ isManager: true });
    const user = userEvent.setup();
    await renderWithRouterContext(<AnnouncementDetail announcement={mockAnnouncement} />);
    await user.click(screen.getByText('Poista tiedote'));
    expect(
      screen.getByText('Haluatko varmasti poistaa tämän tiedotteen? Toimintoa ei voi perua.'),
    ).toBeInTheDocument();
  });
});
