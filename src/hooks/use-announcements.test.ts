import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  useAnnouncements,
  useAnnouncement,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  announcementKeys,
} from './use-announcements';

const mockAnnouncements = [
  {
    id: 'a1',
    title: 'Test Announcement',
    summary: 'Summary',
    content: 'Content',
    category: 'yleinen',
    author: 'Author',
    publishedAt: '2026-02-28',
    isNew: true,
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

describe('useAnnouncements', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches announcements list', async () => {
    mockFetch(mockAnnouncements);

    const { result } = renderHook(() => useAnnouncements(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockAnnouncements);
    });
  });

  it('passes category to API', async () => {
    mockFetch([]);

    renderHook(() => useAnnouncements('huolto'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/announcements?category=huolto',
        expect.objectContaining({}),
      );
    });
  });
});

describe('useAnnouncement', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches single announcement', async () => {
    const mockItem = mockAnnouncements[0];
    mockFetch(mockItem);

    const { result } = renderHook(() => useAnnouncement('a1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItem);
    });
  });
});

describe('useCreateAnnouncement', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends POST and returns created announcement', async () => {
    const created = {
      id: 'new-1',
      title: 'Uusi tiedote',
      summary: 'Yhteenveto',
      content: 'Sisältö',
      category: 'yleinen',
      author: 'Hallitus',
      publishedAt: '2026-03-01',
      isNew: true,
    };
    mockFetch(created);

    const { result } = renderHook(() => useCreateAnnouncement(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        title: 'Uusi tiedote',
        summary: 'Yhteenveto',
        content: 'Sisältö',
        category: 'yleinen',
        author: 'Hallitus',
      });
      expect(response).toEqual(created);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/announcements',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});

describe('useUpdateAnnouncement', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends PATCH and returns updated announcement', async () => {
    const updated = { ...mockAnnouncements[0], title: 'Päivitetty otsikko' };
    mockFetch(updated);

    const { result } = renderHook(() => useUpdateAnnouncement(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        id: 'a1',
        title: 'Päivitetty otsikko',
      });
      expect(response).toEqual(updated);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/announcements/a1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
  });
});

describe('useDeleteAnnouncement', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends DELETE and returns success', async () => {
    mockFetch({ success: true });

    const { result } = renderHook(() => useDeleteAnnouncement(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync('a1');
      expect(response).toEqual({ success: true });
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/announcements/a1',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });
});

describe('announcementKeys', () => {
  it('generates correct key structure', () => {
    expect(announcementKeys.all).toEqual(['announcements']);
    expect(announcementKeys.list()).toEqual(['announcements', 'list']);
    expect(announcementKeys.list('huolto')).toEqual(['announcements', 'list', 'huolto']);
    expect(announcementKeys.detail('a1')).toEqual(['announcements', 'detail', 'a1']);
  });
});
