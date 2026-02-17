import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { MeetingsPage } from './meetings-page';

const mockMeetings = [
  {
    id: 'm1',
    title: 'Varsinainen yhtiökokous 2026',
    type: 'yhtiokokous',
    status: 'upcoming',
    date: '2026-03-25',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Kerhohuone',
    description: 'Yhtiökokous.',
    documents: [
      { id: 'd1', name: 'Kokouskutsu', fileType: 'pdf', fileSize: '245 KB' },
      { id: 'd2', name: 'Tilinpäätös 2025', fileType: 'pdf', fileSize: '1.8 MB' },
    ],
  },
  {
    id: 'm2',
    title: 'Hallituksen kokous 3/2026',
    type: 'hallituksen-kokous',
    status: 'upcoming',
    date: '2026-03-10',
    startTime: '18:00',
    endTime: '19:30',
    location: 'Kerhohuone',
    description: 'Hallituksen kokous.',
    documents: [{ id: 'd4', name: 'Esityslista', fileType: 'pdf', fileSize: '120 KB' }],
  },
  {
    id: 'm3',
    title: 'Hallituksen kokous 2/2026',
    type: 'hallituksen-kokous',
    status: 'completed',
    date: '2026-02-10',
    startTime: '18:00',
    endTime: '19:30',
    location: 'Kerhohuone',
    description: 'Kokous.',
    documents: [],
  },
  {
    id: 'm6',
    title: 'Varsinainen yhtiökokous 2025',
    type: 'yhtiokokous',
    status: 'completed',
    date: '2025-03-27',
    startTime: '18:00',
    endTime: '20:30',
    location: 'Kerhohuone',
    description: 'Kokous.',
    documents: [],
  },
];

describe('MeetingsPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockMeetings), {
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
    renderWithProviders(<MeetingsPage />);
    expect(screen.getByText('Kokoukset')).toBeInTheDocument();
  });

  it('renders upcoming/past tabs', () => {
    renderWithProviders(<MeetingsPage />);
    expect(screen.getByText('Tulevat')).toBeInTheDocument();
    expect(screen.getByText('Menneet')).toBeInTheDocument();
  });

  it('renders upcoming meetings by default', async () => {
    renderWithProviders(<MeetingsPage />);
    expect(await screen.findByText('Varsinainen yhtiökokous 2026')).toBeInTheDocument();
    expect(screen.getByText('Hallituksen kokous 3/2026')).toBeInTheDocument();
  });

  it('renders meeting type badges', async () => {
    renderWithProviders(<MeetingsPage />);
    await screen.findByText('Varsinainen yhtiökokous 2026');
    expect(screen.getByText('Yhtiökokous')).toBeInTheDocument();
    expect(screen.getByText('Hallituksen kokous')).toBeInTheDocument();
  });

  it('shows past meetings when tab is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingsPage />);

    await screen.findByText('Varsinainen yhtiökokous 2026');
    await user.click(screen.getByText('Menneet'));
    expect(screen.getByText('Hallituksen kokous 2/2026')).toBeInTheDocument();
    expect(screen.getByText('Varsinainen yhtiökokous 2025')).toBeInTheDocument();
  });

  it('toggles document list on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingsPage />);

    await screen.findByText('Varsinainen yhtiökokous 2026');
    const showButton = screen.getAllByText(/Näytä asiakirjat/)[0]!;
    await user.click(showButton);
    expect(screen.getByText('Kokouskutsu')).toBeInTheDocument();
    expect(screen.getByText('Tilinpäätös 2025')).toBeInTheDocument();
  });
});
