import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouterContext } from '@/test-utils';
import { DashboardPage } from './dashboard-page';

const mockBuilding = {
  name: 'As Oy Mäntyrinne',
  address: 'Mäntypolku 5',
  postalCode: '00320',
  city: 'Helsinki',
  apartments: 24,
  buildYear: 1985,
  managementCompany: 'Realia Isännöinti Oy',
};

const mockBookings = [
  {
    id: 'b1',
    title: 'Saunavuoro',
    date: '2026-03-02',
    startTime: '18:00',
    endTime: '20:00',
    category: 'sauna',
    location: 'Taloyhtiön sauna',
    bookerName: 'Virtanen Matti',
    apartment: 'A 12',
    createdBy: null,
  },
];

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
];

const mockMaterials = [
  {
    id: 'm1',
    name: 'Järjestyssäännöt',
    category: 'saannot',
    fileType: 'pdf',
    fileSize: '245 KB',
    updatedAt: '2025-09-15',
    description: 'Järjestyssäännöt.',
  },
];

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

function okJson(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/api/building')) return Promise.resolve(okJson(mockBuilding));
        if (url.includes('/api/bookings')) return Promise.resolve(okJson(mockBookings));
        if (url.includes('/api/events')) return Promise.resolve(okJson(mockEvents));
        if (url.includes('/api/materials')) return Promise.resolve(okJson(mockMaterials));
        if (url.includes('/api/announcements')) return Promise.resolve(okJson(mockAnnouncements));
        return Promise.resolve(okJson([]));
      }),
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
    expect(await screen.findByText('As Oy Mäntyrinne')).toBeInTheDocument();
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
    expect(await screen.findByText('Saunavuoro')).toBeInTheDocument();
  });

  it('renders latest announcements', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(await screen.findByText('Kevätsiivous 15.3.2026')).toBeInTheDocument();
  });
});
