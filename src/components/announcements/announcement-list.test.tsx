import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouterContext, setTestAuth } from '@/test-utils';
import { AnnouncementList } from './announcement-list';

const mockAnnouncements = [
  {
    id: 'a1',
    title: 'Kevätsiivous 15.3.2026',
    summary: 'Taloyhtiön kevätsiivous järjestetään lauantaina 15.3.',
    content: 'Sisältö',
    category: 'yleinen',
    author: 'Hallitus',
    publishedAt: '2026-02-28',
    isNew: true,
  },
  {
    id: 'a2',
    title: 'Hissihuolto viikolla 11',
    summary: 'Hissin vuosihuolto suoritetaan viikolla 11.',
    content: 'Sisältö',
    category: 'huolto',
    author: 'Isännöitsijä',
    publishedAt: '2026-02-25',
    isNew: true,
  },
];

describe('AnnouncementList', () => {
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
    setTestAuth();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders page header', async () => {
    await renderWithRouterContext(<AnnouncementList />);
    expect(screen.getByText('Tiedotteet')).toBeInTheDocument();
  });

  it('renders category filter buttons', async () => {
    await renderWithRouterContext(<AnnouncementList />);
    const buttons = screen.getAllByRole('button');
    const filterLabels = buttons.map((b) => b.textContent);
    expect(filterLabels).toContain('Kaikki');
    expect(filterLabels).toContain('Yleinen');
    expect(filterLabels).toContain('Huolto');
    expect(filterLabels).toContain('Remontti');
    expect(filterLabels).toContain('Vesi & sähkö');
  });

  it('renders announcement titles', async () => {
    await renderWithRouterContext(<AnnouncementList />);
    expect(await screen.findByText('Kevätsiivous 15.3.2026')).toBeInTheDocument();
    expect(screen.getByText('Hissihuolto viikolla 11')).toBeInTheDocument();
  });

  it('shows new badge for new announcements', async () => {
    await renderWithRouterContext(<AnnouncementList />);
    const badges = await screen.findAllByText('Uusi');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('renders read more links', async () => {
    await renderWithRouterContext(<AnnouncementList />);
    const readMoreLinks = await screen.findAllByText('Lue lisää');
    expect(readMoreLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('does not show create button for non-manager', async () => {
    await renderWithRouterContext(<AnnouncementList />);
    await screen.findByText('Kevätsiivous 15.3.2026');
    expect(screen.queryByText('Uusi tiedote')).not.toBeInTheDocument();
  });

  it('shows create button for manager', async () => {
    setTestAuth({ isManager: true });
    await renderWithRouterContext(<AnnouncementList />);
    await screen.findByText('Kevätsiivous 15.3.2026');
    expect(screen.getByText('Uusi tiedote')).toBeInTheDocument();
  });
});
