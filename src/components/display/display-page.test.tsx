import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { DisplayPage } from './display-page';

const mockBuilding = {
  name: 'As Oy Mäntyrinne',
  address: 'Mäntypolku 5',
  postalCode: '00320',
  city: 'Helsinki',
  apartments: 24,
  buildYear: 1985,
  managementCompany: 'Realia Isännöinti Oy',
};

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

describe('DisplayPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 16, 14, 35, 0));
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/api/building')) return Promise.resolve(okJson(mockBuilding));
        if (url.includes('/api/bookings')) return Promise.resolve(okJson([]));
        if (url.includes('/api/events')) return Promise.resolve(okJson([]));
        if (url.includes('/api/announcements')) return Promise.resolve(okJson(mockAnnouncements));
        return Promise.resolve(okJson([]));
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders building name', async () => {
    renderWithProviders(<DisplayPage />);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(screen.getByText('As Oy Mäntyrinne')).toBeInTheDocument();
  });

  it('renders clock time', () => {
    renderWithProviders(<DisplayPage />);
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(screen.getByText('14:35')).toBeInTheDocument();
  });

  it('renders current date', () => {
    renderWithProviders(<DisplayPage />);
    expect(screen.getByText(/maanantaina 16. helmikuuta 2026/)).toBeInTheDocument();
  });

  it('shows bookings slide by default', () => {
    renderWithProviders(<DisplayPage />);
    expect(screen.getByText('Tämän päivän varaukset')).toBeInTheDocument();
  });

  it('shows 4 progress dots', () => {
    renderWithProviders(<DisplayPage />);
    const dots = screen.getAllByRole('button', { name: /Slide/ });
    expect(dots).toHaveLength(4);
  });

  it('first dot is active', () => {
    renderWithProviders(<DisplayPage />);
    const dots = screen.getAllByRole('button', { name: /Slide/ });
    expect(dots[0]).toHaveClass('bg-hb-accent');
    expect(dots[1]).toHaveClass('bg-white/30');
  });

  it('rotates to announcements slide after interval', () => {
    renderWithProviders(<DisplayPage />);

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(screen.getByText('Ajankohtaista')).toBeInTheDocument();
  });

  it('wraps to first slide after last', () => {
    renderWithProviders(<DisplayPage />);

    // Advance through all 4 slides
    act(() => {
      vi.advanceTimersByTime(40_000);
    });

    // Should be back to bookings
    expect(screen.getByText('Tämän päivän varaukset')).toBeInTheDocument();
  });
});
