import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import type { Booking } from '@/types';
import { BookingCard } from './booking-card';

const mockBooking: Booking = {
  id: 'b1',
  title: 'Saunavuoro',
  date: '2026-03-15',
  startTime: '18:00',
  endTime: '20:00',
  category: 'sauna',
  location: 'Taloyhtiön sauna',
  bookerName: 'Aino Virtanen',
  apartment: 'A 12',
};

const otherBooking: Booking = {
  ...mockBooking,
  id: 'b2',
  bookerName: 'Matti Korhonen',
  apartment: 'B 5',
};

function mockFetch(): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

describe('BookingCard', () => {
  beforeEach(() => {
    mockFetch();
    setTestAuth();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders booking title and category badge', () => {
    renderWithProviders(<BookingCard booking={mockBooking} />);
    expect(screen.getByText('Saunavuoro')).toBeInTheDocument();
    expect(screen.getByText('Sauna')).toBeInTheDocument();
  });

  it('renders time, location and booker info', () => {
    renderWithProviders(<BookingCard booking={mockBooking} />);
    expect(screen.getByText('18:00-20:00')).toBeInTheDocument();
    expect(screen.getByText('Taloyhtiön sauna')).toBeInTheDocument();
    expect(screen.getByText('Aino Virtanen (A 12)')).toBeInTheDocument();
  });

  it('shows edit/delete buttons for booking owner', () => {
    renderWithProviders(<BookingCard booking={mockBooking} />);
    expect(screen.getByText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByText('Peruuta varaus')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for non-owner', () => {
    renderWithProviders(<BookingCard booking={otherBooking} />);
    expect(screen.queryByText('Muokkaa')).not.toBeInTheDocument();
    expect(screen.queryByText('Peruuta varaus')).not.toBeInTheDocument();
  });

  it('shows edit/delete buttons for manager on any booking', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<BookingCard booking={otherBooking} />);
    expect(screen.getByText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByText('Peruuta varaus')).toBeInTheDocument();
  });

  it('opens delete confirmation dialog', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingCard booking={mockBooking} />);

    await user.click(screen.getByText('Peruuta varaus'));

    expect(screen.getByText('Haluatko varmasti peruuttaa tämän varauksen?')).toBeInTheDocument();
    expect(screen.getByText('Peruuta')).toBeInTheDocument();
    expect(screen.getByText('Poista')).toBeInTheDocument();
  });

  it('calls delete API when confirmed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingCard booking={mockBooking} />);

    await user.click(screen.getByText('Peruuta varaus'));
    await user.click(screen.getByText('Poista'));

    await waitFor(() => {
      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
      const deleteCall = calls.find(
        (call: unknown[]) => (call[1] as RequestInit | undefined)?.method === 'DELETE',
      );
      expect(deleteCall).toBeDefined();
    });
  });

  it('opens edit dialog when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingCard booking={mockBooking} />);

    await user.click(screen.getByText('Muokkaa'));

    expect(screen.getByText('Muokkaa varausta')).toBeInTheDocument();
  });
});
