import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useEvents, useEvent, eventKeys } from './use-events';

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
      expect(fetch).toHaveBeenCalledWith('/api/events?status=upcoming');
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

describe('eventKeys', () => {
  it('generates correct key structure', () => {
    expect(eventKeys.all).toEqual(['events']);
    expect(eventKeys.list()).toEqual(['events', 'list']);
    expect(eventKeys.list('upcoming')).toEqual(['events', 'list', 'upcoming']);
    expect(eventKeys.detail('e1')).toEqual(['events', 'detail', 'e1']);
  });
});
