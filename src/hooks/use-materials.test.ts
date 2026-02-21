import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  useMaterials,
  useMaterial,
  useCreateMaterial,
  useUpdateMaterial,
  useDeleteMaterial,
  materialKeys,
} from './use-materials';

const mockMaterials = [
  {
    id: 'm1',
    name: 'Järjestyssäännöt',
    category: 'saannot',
    fileType: 'pdf',
    fileSize: '245 KB',
    updatedAt: '2025-09-15',
    description: 'Järjestyssäännöt.',
    createdBy: 'u2',
    fileUrl: null,
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
      expect(fetch).toHaveBeenCalledWith(
        '/api/materials?category=talous',
        expect.objectContaining({}),
      );
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

describe('useCreateMaterial', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends POST with JSON when no file', async () => {
    const created = {
      id: 'new-1',
      name: 'Uusi dokumentti',
      category: 'talous',
      fileType: 'pdf',
      fileSize: '500 KB',
      updatedAt: '2026-02-21',
      description: 'Kuvaus',
      createdBy: 'u2',
      fileUrl: null,
    };
    mockFetch(created);

    const { result } = renderHook(() => useCreateMaterial(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        name: 'Uusi dokumentti',
        category: 'talous',
        fileType: 'pdf',
        fileSize: '500 KB',
        updatedAt: '2026-02-21',
        description: 'Kuvaus',
      });
      expect(response).toEqual(created);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/materials',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('sends POST with FormData when file provided', async () => {
    const created = {
      id: 'new-2',
      name: 'Tiedostolla',
      category: 'talous',
      fileType: 'pdf',
      fileSize: '1.2 MB',
      updatedAt: '2026-02-21',
      description: 'Kuvaus',
      createdBy: 'u2',
      fileUrl: '/api/files/materials/new-2.pdf',
    };
    mockFetch(created);

    const testFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    const { result } = renderHook(() => useCreateMaterial(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        name: 'Tiedostolla',
        category: 'talous',
        fileType: 'pdf',
        fileSize: '',
        updatedAt: '2026-02-21',
        description: 'Kuvaus',
        file: testFile,
      });
      expect(response).toEqual(created);
    });

    // When file is provided, FormData is used (no Content-Type header)
    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
    const postCall = calls.find((call: unknown[]) => {
      const init = call[1] as RequestInit | undefined;
      return init?.body instanceof FormData;
    });
    expect(postCall).toBeDefined();
  });
});

describe('useUpdateMaterial', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends PATCH and returns updated material', async () => {
    const updated = { ...mockMaterials[0], name: 'Päivitetty nimi' };
    mockFetch(updated);

    const { result } = renderHook(() => useUpdateMaterial(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        id: 'm1',
        name: 'Päivitetty nimi',
      });
      expect(response).toEqual(updated);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/materials/m1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
  });
});

describe('useDeleteMaterial', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends DELETE and returns success', async () => {
    mockFetch({ success: true });

    const { result } = renderHook(() => useDeleteMaterial(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync('m1');
      expect(response).toEqual({ success: true });
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/materials/m1',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
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
