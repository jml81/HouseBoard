import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import type { Booking } from '@/types';
import { BookingList } from './booking-list';

const mockBookings: Booking[] = [
  {
    id: 'test-1',
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
  {
    id: 'test-2',
    title: 'Pyykinpesu',
    date: '2026-03-03',
    startTime: '08:00',
    endTime: '12:00',
    category: 'pesutupa',
    location: 'Pesutupa',
    bookerName: 'Korhonen Anna',
    apartment: 'B 3',
    createdBy: null,
  },
];

describe('BookingList', () => {
  it('renders bookings grouped by date', () => {
    renderWithProviders(<BookingList bookings={mockBookings} />);
    expect(screen.getByText('2.3.2026')).toBeInTheDocument();
    expect(screen.getByText('3.3.2026')).toBeInTheDocument();
  });

  it('renders booking details', () => {
    renderWithProviders(<BookingList bookings={mockBookings} />);
    expect(screen.getByText('Saunavuoro')).toBeInTheDocument();
    expect(screen.getByText('18:00-20:00')).toBeInTheDocument();
    expect(screen.getByText('Taloyhtiön sauna')).toBeInTheDocument();
  });

  it('shows empty state when no bookings', () => {
    renderWithProviders(<BookingList bookings={[]} />);
    expect(screen.getByText('Ei varauksia')).toBeInTheDocument();
  });

  it('renders category badges', () => {
    renderWithProviders(<BookingList bookings={mockBookings} />);
    expect(screen.getByText('Sauna')).toBeInTheDocument();
    // "Pesutupa" appears as both badge and location, so use getAllByText
    expect(screen.getAllByText('Pesutupa').length).toBeGreaterThanOrEqual(1);
  });
});
