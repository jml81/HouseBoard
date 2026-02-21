import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Meeting } from '@/types';
import { MeetingCard } from './meeting-card';

const upcomingMeeting: Meeting = {
  id: 'm1',
  title: 'Hallituksen kokous',
  type: 'hallituksen-kokous',
  status: 'upcoming',
  date: '2026-04-15',
  startTime: '18:00',
  endTime: '20:00',
  location: 'Kerhohuone',
  description: 'Kevään hallituksen kokous',
  documents: [],
};

const meetingWithDocs: Meeting = {
  ...upcomingMeeting,
  id: 'm3',
  documents: [
    {
      id: 'd1',
      name: 'Esityslista',
      fileType: 'pdf',
      fileSize: '120 KB',
      fileUrl: '/api/files/meetings/m3/doc.pdf',
    },
  ],
};

const completedMeeting: Meeting = {
  ...upcomingMeeting,
  id: 'm2',
  title: 'Yhtiökokous 2025',
  type: 'yhtiokokous',
  status: 'completed',
};

describe('MeetingCard', () => {
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

  it('renders meeting details', () => {
    renderWithProviders(<MeetingCard meeting={upcomingMeeting} />);
    expect(screen.getAllByText('Hallituksen kokous')).toHaveLength(2); // title + type badge
    expect(screen.getByText('Kevään hallituksen kokous')).toBeInTheDocument();
    expect(screen.getByText('Kerhohuone')).toBeInTheDocument();
  });

  it('shows edit/delete buttons for manager', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<MeetingCard meeting={upcomingMeeting} />);
    expect(screen.getByLabelText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByLabelText('Poista kokous')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for resident', () => {
    setTestAuth({ isManager: false });
    renderWithProviders(<MeetingCard meeting={upcomingMeeting} />);
    expect(screen.queryByLabelText('Muokkaa')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Poista kokous')).not.toBeInTheDocument();
  });

  it('shows edit/delete buttons for completed meetings too', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<MeetingCard meeting={completedMeeting} />);
    expect(screen.getByLabelText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByLabelText('Poista kokous')).toBeInTheDocument();
  });

  it('opens edit dialog when edit button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<MeetingCard meeting={upcomingMeeting} />);

    await user.click(screen.getByLabelText('Muokkaa'));
    expect(await screen.findByText('Muokkaa kokousta')).toBeInTheDocument();
    expect(screen.getByLabelText('Otsikko')).toHaveValue('Hallituksen kokous');
  });

  it('opens delete confirmation dialog when delete button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<MeetingCard meeting={upcomingMeeting} />);

    await user.click(screen.getByLabelText('Poista kokous'));
    expect(
      await screen.findByText(
        'Haluatko varmasti poistaa tämän kokouksen? Myös kokouksen asiakirjat poistetaan.',
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

    renderWithProviders(<MeetingCard meeting={upcomingMeeting} />);

    await user.click(screen.getByLabelText('Poista kokous'));
    await screen.findByText(
      'Haluatko varmasti poistaa tämän kokouksen? Myös kokouksen asiakirjat poistetaan.',
    );
    await user.click(screen.getByRole('button', { name: 'Poista' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/meetings/m1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  it('shows document toggle when meeting has documents', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingCard meeting={meetingWithDocs} />);
    const toggleBtn = screen.getByText(/Näytä asiakirjat/);
    expect(toggleBtn).toBeInTheDocument();

    await user.click(toggleBtn);
    expect(await screen.findByText('Esityslista')).toBeInTheDocument();
  });

  it('does not show document toggle when no documents', () => {
    renderWithProviders(<MeetingCard meeting={upcomingMeeting} />);
    expect(screen.queryByText(/Näytä asiakirjat/)).not.toBeInTheDocument();
  });
});
