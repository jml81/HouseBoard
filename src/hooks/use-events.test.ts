import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  useEvents,
  useEvent,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  eventKeys,
} from './use-events';

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

describe('useEvents', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches events list', async () => {
    mockFetch(mockEvents);

    const { result } = renderHook(() => useEvents(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockEvents);
    });
  });

  it('passes status to API', async () => {
    mockFetch([]);

    renderHook(() => useEvents('upcoming'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/events?status=upcoming',
        expect.objectContaining({}),
      );
    });
  });
});

describe('useEvent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches single event', async () => {
    const mockItem = mockEvents[0];
    mockFetch(mockItem);

    const { result } = renderHook(() => useEvent('e1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItem);
    });
  });
});

describe('useCreateEvent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends POST and returns created event', async () => {
    const created = {
      id: 'new-1',
      title: 'Uusi tapahtuma',
      description: 'Kuvaus',
      date: '2026-04-01',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Piha-alue',
      organizer: 'Hallitus',
      interestedCount: 0,
      status: 'upcoming',
      createdBy: 'u2',
    };
    mockFetch(created);

    const { result } = renderHook(() => useCreateEvent(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        title: 'Uusi tapahtuma',
        description: 'Kuvaus',
        date: '2026-04-01',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Piha-alue',
        organizer: 'Hallitus',
      });
      expect(response).toEqual(created);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/events',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});

describe('useUpdateEvent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends PATCH and returns updated event', async () => {
    const updated = { ...mockEvents[0], title: 'Päivitetty tapahtuma' };
    mockFetch(updated);

    const { result } = renderHook(() => useUpdateEvent(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        id: 'e1',
        title: 'Päivitetty tapahtuma',
      });
      expect(response).toEqual(updated);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/events/e1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
  });
});

describe('useDeleteEvent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends DELETE and returns success', async () => {
    mockFetch({ success: true });

    const { result } = renderHook(() => useDeleteEvent(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync('e1');
      expect(response).toEqual({ success: true });
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/events/e1',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });
});

describe('eventKeys', () => {
  it('generates correct key structure', () => {
    expect(eventKeys.all).toEqual(['events']);
    expect(eventKeys.list()).toEqual(['events', 'list']);
    expect(eventKeys.list('upcoming')).toEqual(['events', 'list', 'upcoming']);
    expect(eventKeys.detail('e1')).toEqual(['events', 'detail', 'e1']);
  });
});
