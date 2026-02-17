import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useBuilding, buildingKeys } from './use-building';

const mockBuilding = {
  name: 'As Oy Mäntyrinne',
  address: 'Mäntypolku 5',
  postalCode: '00320',
  city: 'Helsinki',
  apartments: 24,
  buildYear: 1985,
  managementCompany: 'Realia Isännöinti Oy',
};

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

describe('useBuilding', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches building data', async () => {
    mockFetch(mockBuilding);

    const { result } = renderHook(() => useBuilding(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockBuilding);
    });
  });

  it('calls correct API endpoint', async () => {
    mockFetch(mockBuilding);

    renderHook(() => useBuilding(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/building');
    });
  });
});

describe('buildingKeys', () => {
  it('generates correct key structure', () => {
    expect(buildingKeys.all).toEqual(['building']);
    expect(buildingKeys.detail()).toEqual(['building', 'detail']);
  });
});
