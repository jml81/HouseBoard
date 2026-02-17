import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { CalendarPage } from './calendar-page';

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
  },
];

describe('CalendarPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockBookings), {
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
    renderWithProviders(<CalendarPage />);
    expect(screen.getByText('Kalenteri')).toBeInTheDocument();
  });

  it('renders month/list tabs', () => {
    renderWithProviders(<CalendarPage />);
    expect(screen.getByText('Kuukausi')).toBeInTheDocument();
    expect(screen.getByText('Lista')).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    renderWithProviders(<CalendarPage />);
    expect(screen.getByText('Kaikki')).toBeInTheDocument();
    expect(screen.getByText('Sauna')).toBeInTheDocument();
    expect(screen.getByText('Pesutupa')).toBeInTheDocument();
    expect(screen.getByText('Kerhohuone')).toBeInTheDocument();
    expect(screen.getByText('Talkoot')).toBeInTheDocument();
  });

  it('renders month year heading', () => {
    renderWithProviders(<CalendarPage />);
    expect(screen.getByText('Maaliskuu 2026')).toBeInTheDocument();
  });

  it('renders weekday headers', () => {
    renderWithProviders(<CalendarPage />);
    expect(screen.getByText('ma')).toBeInTheDocument();
    expect(screen.getByText('su')).toBeInTheDocument();
  });
});
