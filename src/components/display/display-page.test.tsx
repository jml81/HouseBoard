import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { DisplayPage } from './display-page';

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

describe('DisplayPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 16, 14, 35, 0));
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockAnnouncements), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders building name', () => {
    renderWithProviders(<DisplayPage />);
    expect(screen.getByText('As Oy Mäntyrinne')).toBeInTheDocument();
  });

  it('renders clock time', () => {
    renderWithProviders(<DisplayPage />);
    // After subscribe, timestamp is updated to fake time
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
