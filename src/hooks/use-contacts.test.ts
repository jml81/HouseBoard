import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useContacts, contactKeys } from './use-contacts';

const mockContacts = [
  {
    id: 'c1',
    name: 'Markku Toivonen',
    role: 'isannoitsija',
    company: 'Kiinteistöpalvelu Toivonen Oy',
    phone: '09 123 4567',
    email: 'markku.toivonen@kptoivonen.fi',
    description: 'Vastaa hallinnosta.',
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

describe('useContacts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches contacts list', async () => {
    mockFetch(mockContacts);

    const { result } = renderHook(() => useContacts(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockContacts);
    });
  });

  it('passes role to API', async () => {
    mockFetch([]);

    renderHook(() => useContacts('huolto'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contacts?role=huolto', expect.objectContaining({}));
    });
  });
});

describe('contactKeys', () => {
  it('generates correct key structure', () => {
    expect(contactKeys.all).toEqual(['contacts']);
    expect(contactKeys.list()).toEqual(['contacts', 'list']);
    expect(contactKeys.list('huolto')).toEqual(['contacts', 'list', 'huolto']);
  });
});
