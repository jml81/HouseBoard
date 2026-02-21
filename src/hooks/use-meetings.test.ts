import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  useMeetings,
  useMeeting,
  useUploadMeetingDocument,
  useDeleteMeetingDocument,
  meetingKeys,
} from './use-meetings';

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
    documents: [
      { id: 'd1', name: 'Kokouskutsu', fileType: 'pdf', fileSize: '245 KB', fileUrl: null },
    ],
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
      expect(fetch).toHaveBeenCalledWith(
        '/api/meetings?status=upcoming',
        expect.objectContaining({}),
      );
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

describe('useUploadMeetingDocument', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('uploads document via FormData', async () => {
    const uploaded = {
      id: 'd-new',
      name: 'test.pdf',
      fileType: 'pdf',
      fileSize: '100 KB',
      fileUrl: '/api/files/meetings/m1/d-new.pdf',
    };
    mockFetch(uploaded);

    const testFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    const { result } = renderHook(() => useUploadMeetingDocument(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        meetingId: 'm1',
        file: testFile,
      });
      expect(response).toEqual(uploaded);
    });

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
    const postCall = calls.find((call: unknown[]) => {
      const init = call[1] as RequestInit | undefined;
      return init?.body instanceof FormData;
    });
    expect(postCall).toBeDefined();
    expect(postCall![0]).toBe('/api/meetings/m1/documents');
  });
});

describe('useDeleteMeetingDocument', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends DELETE for meeting document', async () => {
    mockFetch({ success: true });

    const { result } = renderHook(() => useDeleteMeetingDocument(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        meetingId: 'm1',
        docId: 'd1',
      });
      expect(response).toEqual({ success: true });
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/meetings/m1/documents/d1',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
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
