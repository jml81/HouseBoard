import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  useMarketplaceItems,
  useMarketplaceItem,
  useCreateMarketplaceItem,
  useUpdateMarketplaceItemStatus,
  useDeleteMarketplaceItem,
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
      expect(fetch).toHaveBeenCalledWith(
        '/api/marketplace-items?category=huonekalu',
        expect.objectContaining({}),
      );
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

describe('useCreateMarketplaceItem', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends POST and returns created item', async () => {
    const created = {
      id: 'new-1',
      title: 'New item',
      description: 'Desc',
      price: 10,
      category: 'muu',
      condition: 'hyva',
      status: 'available',
      seller: { name: 'Testi', apartment: 'A 1' },
      publishedAt: '2026-02-18',
    };
    mockFetch(created);

    const { result } = renderHook(() => useCreateMarketplaceItem(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        title: 'New item',
        description: 'Desc',
        price: 10,
        category: 'muu',
        condition: 'hyva',
        sellerName: 'Testi',
        sellerApartment: 'A 1',
      });
      expect(response).toEqual(created);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/marketplace-items',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});

describe('useUpdateMarketplaceItemStatus', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends PATCH and returns updated item', async () => {
    const updated = { ...mockItems[0], status: 'sold' };
    mockFetch(updated);

    const { result } = renderHook(() => useUpdateMarketplaceItemStatus(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({ id: 'mp1', status: 'sold' });
      expect(response).toEqual(updated);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/marketplace-items/mp1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
  });
});

describe('useDeleteMarketplaceItem', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends DELETE and returns success', async () => {
    mockFetch({ success: true });

    const { result } = renderHook(() => useDeleteMarketplaceItem(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync('mp1');
      expect(response).toEqual({ success: true });
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/marketplace-items/mp1',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });
});

describe('marketplaceItemKeys', () => {
  it('generates correct key structure', () => {
    expect(marketplaceItemKeys.all).toEqual(['marketplace-items']);
    expect(marketplaceItemKeys.list()).toEqual(['marketplace-items', 'list']);
    expect(marketplaceItemKeys.detail('mp1')).toEqual(['marketplace-items', 'detail', 'mp1']);
  });
});
