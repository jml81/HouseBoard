import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useMeetings, useMeeting, meetingKeys } from './use-meetings';

const mockMeetings = [
  {
    id: 'm1',
    title: 'Varsinainen yhtiökokous 2026',
    type: 'yhtiokokous',
    status: 'upcoming',
    date: '2026-03-25',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Kerhohuone',
    description: 'Yhtiökokous.',
    documents: [{ id: 'd1', name: 'Kokouskutsu', fileType: 'pdf', fileSize: '245 KB' }],
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

describe('useMeetings', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches meetings list', async () => {
    mockFetch(mockMeetings);

    const { result } = renderHook(() => useMeetings(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockMeetings);
    });
  });

  it('passes status to API', async () => {
    mockFetch([]);

    renderHook(() => useMeetings('upcoming'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/meetings?status=upcoming');
    });
  });
});

describe('useMeeting', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches single meeting', async () => {
    const mockItem = mockMeetings[0];
    mockFetch(mockItem);

    const { result } = renderHook(() => useMeeting('m1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItem);
    });
  });
});

describe('meetingKeys', () => {
  it('generates correct key structure', () => {
    expect(meetingKeys.all).toEqual(['meetings']);
    expect(meetingKeys.list()).toEqual(['meetings', 'list']);
    expect(meetingKeys.list('upcoming')).toEqual(['meetings', 'list', 'upcoming']);
    expect(meetingKeys.detail('m1')).toEqual(['meetings', 'detail', 'm1']);
  });
});
