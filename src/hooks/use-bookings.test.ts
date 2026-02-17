import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useBookings, useBooking, bookingKeys } from './use-bookings';

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

function mockFetch(data: unknown): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

function createWrapper(): ({ children }: { children: ReactNode }) => React.JSX.Element {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useBookings', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches bookings list', async () => {
    mockFetch(mockBookings);

    const { result } = renderHook(() => useBookings(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockBookings);
    });
  });

  it('passes category to API', async () => {
    mockFetch([]);

    renderHook(() => useBookings('sauna'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/bookings?category=sauna');
    });
  });
});

describe('useBooking', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches single booking', async () => {
    const mockItem = mockBookings[0];
    mockFetch(mockItem);

    const { result } = renderHook(() => useBooking('b1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItem);
    });
  });
});

describe('bookingKeys', () => {
  it('generates correct key structure', () => {
    expect(bookingKeys.all).toEqual(['bookings']);
    expect(bookingKeys.list()).toEqual(['bookings', 'list']);
    expect(bookingKeys.list('sauna')).toEqual(['bookings', 'list', 'sauna']);
    expect(bookingKeys.detail('b1')).toEqual(['bookings', 'detail', 'b1']);
  });
});
