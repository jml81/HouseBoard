import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouterContext } from '@/test-utils';
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
});
