import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  useMarketplaceItems,
  useMarketplaceItem,
  marketplaceItemKeys,
} from './use-marketplace-items';

const mockItems = [
  {
    id: 'mp1',
    title: 'Ikea Kallax -hylly',
    description: 'Hyväkuntoinen hylly.',
    price: 40,
    category: 'huonekalu',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Minna Korhonen', apartment: 'B 12' },
    publishedAt: '2026-02-14',
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

describe('useMarketplaceItems', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches marketplace items list', async () => {
    mockFetch(mockItems);

    const { result } = renderHook(() => useMarketplaceItems(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItems);
    });
  });

  it('passes filters to API', async () => {
    mockFetch([]);

    renderHook(() => useMarketplaceItems({ category: 'huonekalu' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/marketplace-items?category=huonekalu');
    });
  });
});

describe('useMarketplaceItem', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches single item', async () => {
    const mockItem = mockItems[0];
    mockFetch(mockItem);

    const { result } = renderHook(() => useMarketplaceItem('mp1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItem);
    });
  });
});

describe('marketplaceItemKeys', () => {
  it('generates correct key structure', () => {
    expect(marketplaceItemKeys.all).toEqual(['marketplace-items']);
    expect(marketplaceItemKeys.list()).toEqual(['marketplace-items', 'list']);
    expect(marketplaceItemKeys.detail('mp1')).toEqual(['marketplace-items', 'detail', 'mp1']);
  });
});
