import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, userKeys } from './use-users';

const mockUsers = [
  {
    id: 'u1',
    email: 'asukas@talo.fi',
    name: 'Aino Virtanen',
    apartment: 'A 12',
    role: 'resident',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'u2',
    email: 'isannoitsija@talo.fi',
    name: 'Mikko Lahtinen',
    apartment: 'A 4',
    role: 'manager',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

function mockFetch(data: unknown, status = 200): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

function mockFetchError(status: number, error: string): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error }), {
        status,
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

describe('useUsers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches users list', async () => {
    mockFetch(mockUsers);

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUsers);
    });
  });
});

describe('useCreateUser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends POST and returns created user', async () => {
    const created = {
      id: 'u3',
      email: 'new@talo.fi',
      name: 'New User',
      apartment: 'B 1',
      role: 'resident',
      status: 'active',
      createdAt: '2026-02-18T00:00:00Z',
    };
    mockFetch(created);

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        email: 'new@talo.fi',
        password: 'TestPass123!',
        name: 'New User',
        apartment: 'B 1',
        role: 'resident',
      });
      expect(response).toEqual(created);
    });

    expect(fetch).toHaveBeenCalledWith('/api/users', expect.objectContaining({ method: 'POST' }));
  });

  it('handles 409 email conflict', async () => {
    mockFetchError(409, 'Email already in use');

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          email: 'asukas@talo.fi',
          password: 'TestPass123!',
          name: 'Duplicate',
          apartment: 'A 1',
          role: 'resident',
        }),
      ).rejects.toThrow('409');
    });
  });
});

describe('useUpdateUser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends PATCH and returns updated user', async () => {
    const updated = { ...mockUsers[0], name: 'Updated Name' };
    mockFetch(updated);

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync({
        id: 'u1',
        name: 'Updated Name',
      });
      expect(response).toEqual(updated);
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/users/u1',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });
});

describe('useDeleteUser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends DELETE and returns success', async () => {
    mockFetch({ success: true });

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync('u1');
      expect(response).toEqual({ success: true });
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/users/u1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('handles 403 self-delete', async () => {
    mockFetchError(403, 'Cannot delete own account');

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await expect(result.current.mutateAsync('u2')).rejects.toThrow('403');
    });
  });
});

describe('userKeys', () => {
  it('generates correct key structure', () => {
    expect(userKeys.all).toEqual(['users']);
    expect(userKeys.list()).toEqual(['users', 'list']);
  });
});
