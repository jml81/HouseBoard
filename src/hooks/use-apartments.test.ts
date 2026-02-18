import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import {
  useApartments,
  useApartmentPayments,
  useApartmentPayment,
  useCreateApartmentPayment,
  useUpdateApartmentPayment,
  useDeleteApartmentPayment,
  apartmentKeys,
} from './use-apartments';

const mockApartments = [
  {
    id: 'apt-a1',
    number: 'A 1',
    staircase: 'A',
    floor: 1,
    type: '2h+k',
    area: 45.5,
    shares: '1-455',
    resident: 'Kari Mäkinen',
  },
];

const mockPayments = [
  {
    apartmentId: 'apt-a1',
    monthlyCharge: 240,
    paymentStatus: 'paid',
    lastPaymentDate: '2026-02-01',
    arrears: 0,
    chargeBreakdown: { hoitovastike: 156, rahoitusvastike: 60, vesimaksu: 24 },
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

describe('useApartments', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches apartments list', async () => {
    mockFetch(mockApartments);

    const { result } = renderHook(() => useApartments(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockApartments);
    });
  });

  it('passes staircase to API', async () => {
    mockFetch([]);

    renderHook(() => useApartments('A'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/apartments?staircase=A');
    });
  });
});

describe('useApartmentPayments', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches all payments', async () => {
    mockFetch(mockPayments);

    const { result } = renderHook(() => useApartmentPayments(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPayments);
    });
  });
});

describe('useApartmentPayment', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fetches single payment', async () => {
    const mockItem = mockPayments[0];
    mockFetch(mockItem);

    const { result } = renderHook(() => useApartmentPayment('apt-a1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockItem);
    });
  });
});

describe('useCreateApartmentPayment', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends POST request with correct URL and body', async () => {
    const created = { ...mockPayments[0] };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(created), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useCreateApartmentPayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      apartmentId: 'apt-a1',
      paymentStatus: 'paid',
      lastPaymentDate: '2026-02-01',
      arrears: 0,
      hoitovastike: 156,
      rahoitusvastike: 60,
      vesimaksu: 24,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/apartment-payments',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});

describe('useUpdateApartmentPayment', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends PATCH request with correct URL', async () => {
    const updated = { ...mockPayments[0], paymentStatus: 'overdue' };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(updated), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useUpdateApartmentPayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      apartmentId: 'apt-a1',
      paymentStatus: 'overdue',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/apartment-payments/apt-a1',
      expect.objectContaining({
        method: 'PATCH',
      }),
    );
  });
});

describe('useDeleteApartmentPayment', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('sends DELETE request with correct URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useDeleteApartmentPayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('apt-a1');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/apartment-payments/apt-a1',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });
});

describe('apartmentKeys', () => {
  it('generates correct key structure', () => {
    expect(apartmentKeys.all).toEqual(['apartments']);
    expect(apartmentKeys.list()).toEqual(['apartments', 'list']);
    expect(apartmentKeys.list('A')).toEqual(['apartments', 'list', 'A']);
    expect(apartmentKeys.payments()).toEqual(['apartment-payments', 'list']);
    expect(apartmentKeys.payment('apt-a1')).toEqual(['apartment-payments', 'detail', 'apt-a1']);
  });
});
