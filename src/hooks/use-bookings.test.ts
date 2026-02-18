import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  useBookings,
  useBooking,
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
  bookingKeys,
} from './use-bookings';

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

describe('useCreateBooking', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends POST and returns created booking', async () => {
    const created = {
      id: 'new-1',
      title: 'Saunavuoro',
      date: '2026-03-15',
      startTime: '18:00',
      endTime: '20:00',
      category: 'sauna',
      location: 'Taloyhtiön sauna',
      bookerName: 'Testi',
      apartment: 'A 1',
    };
    mockFetch(created);

    const { result } = renderHook(() => useCreateBooking(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        category: 'sauna',
        date: '2026-03-15',
        startTime: '18:00',
        endTime: '20:00',
        bookerName: 'Testi',
        apartment: 'A 1',
      });
      expect(response).toEqual(created);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/bookings',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});

describe('useUpdateBooking', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends PATCH and returns updated booking', async () => {
    const updated = { ...mockBookings[0], endTime: '21:00' };
    mockFetch(updated);

    const { result } = renderHook(() => useUpdateBooking(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({ id: 'b1', endTime: '21:00' });
      expect(response).toEqual(updated);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/bookings/b1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
  });
});

describe('useDeleteBooking', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends DELETE and returns success', async () => {
    mockFetch({ success: true });

    const { result } = renderHook(() => useDeleteBooking(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync('b1');
      expect(response).toEqual({ success: true });
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/bookings/b1',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
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
