import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useBoardMembers, boardMemberKeys } from './use-board-members';

const mockBoardMembers = [
  {
    id: 'bm1',
    name: 'Mikko Lahtinen',
    role: 'puheenjohtaja',
    apartment: 'A 4',
    email: 'mikko.lahtinen@email.fi',
    phone: '040 123 4567',
    termStart: '2025-03-27',
    termEnd: '2026-03-25',
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

describe('useBoardMembers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches board members list', async () => {
    mockFetch(mockBoardMembers);

    const { result } = renderHook(() => useBoardMembers(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockBoardMembers);
    });
  });

  it('calls correct API endpoint', async () => {
    mockFetch([]);

    renderHook(() => useBoardMembers(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/board-members', expect.objectContaining({}));
    });
  });
});

describe('boardMemberKeys', () => {
  it('generates correct key structure', () => {
    expect(boardMemberKeys.all).toEqual(['board-members']);
    expect(boardMemberKeys.list()).toEqual(['board-members', 'list']);
  });
});
