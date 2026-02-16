import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouterContext } from '@/test-utils';
import { AnnouncementList } from './announcement-list';

describe('AnnouncementList', () => {
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
    expect(screen.getByText('Kevätsiivous 15.3.2026')).toBeInTheDocument();
    expect(screen.getByText('Hissihuolto viikolla 11')).toBeInTheDocument();
  });

  it('shows new badge for new announcements', async () => {
    await renderWithRouterContext(<AnnouncementList />);
    const badges = screen.getAllByText('Uusi');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('renders read more links', async () => {
    await renderWithRouterContext(<AnnouncementList />);
    const readMoreLinks = screen.getAllByText('Lue lisää');
    expect(readMoreLinks.length).toBeGreaterThanOrEqual(1);
  });
});
