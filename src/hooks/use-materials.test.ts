import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useMaterials, useMaterial, materialKeys } from './use-materials';

const mockMaterials = [
  {
    id: 'm1',
    name: 'Järjestyssäännöt',
    category: 'saannot',
    fileType: 'pdf',
    fileSize: '245 KB',
    updatedAt: '2025-09-15',
    description: 'Järjestyssäännöt.',
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

describe('useMaterials', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches materials list', async () => {
    mockFetch(mockMaterials);

    const { result } = renderHook(() => useMaterials(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockMaterials);
    });
  });

  it('passes category to API', async () => {
    mockFetch([]);

    renderHook(() => useMaterials('talous'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/materials?category=talous');
    });
  });
});

describe('useMaterial', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches single material', async () => {
    const mockItem = mockMaterials[0];
    mockFetch(mockItem);

    const { result } = renderHook(() => useMaterial('m1'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItem);
    });
  });
});

describe('materialKeys', () => {
  it('generates correct key structure', () => {
    expect(materialKeys.all).toEqual(['materials']);
    expect(materialKeys.list()).toEqual(['materials', 'list']);
    expect(materialKeys.list('talous')).toEqual(['materials', 'list', 'talous']);
    expect(materialKeys.detail('m1')).toEqual(['materials', 'detail', 'm1']);
  });
});
