import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiClient, ApiError } from './api-client';
import type { CreateMarketplaceItemInput } from './api-client';

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

describe('apiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('announcements.list', () => {
    it('fetches /api/announcements', async () => {
      const mockData = [{ id: 'a1', title: 'Test' }];
      mockFetch(mockData);

      const result = await apiClient.announcements.list();
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/api/announcements');
    });

    it('appends category query parameter', async () => {
      mockFetch([]);

      await apiClient.announcements.list('huolto');
      expect(fetch).toHaveBeenCalledWith('/api/announcements?category=huolto');
    });
  });

  describe('announcements.get', () => {
    it('fetches /api/announcements/:id', async () => {
      const mockData = { id: 'a1', title: 'Test' };
      mockFetch(mockData);

      const result = await apiClient.announcements.get('a1');
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/api/announcements/a1');
    });
  });

  describe('marketplaceItems.create', () => {
    it('sends POST to /api/marketplace-items with body', async () => {
      const created = { id: 'new-1', title: 'Test item' };
      mockFetch(created, 201);

      const input: CreateMarketplaceItemInput = {
        title: 'Test item',
        description: 'A test',
        price: 10,
        category: 'muu',
        condition: 'hyva',
        sellerName: 'Testi',
        sellerApartment: 'A 1',
      };

      const result = await apiClient.marketplaceItems.create(input);
      expect(result).toEqual(created);
      expect(fetch).toHaveBeenCalledWith('/api/marketplace-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    });
  });

  describe('marketplaceItems.updateStatus', () => {
    it('sends PATCH to /api/marketplace-items/:id', async () => {
      const updated = { id: 'mp1', status: 'sold' };
      mockFetch(updated);

      const result = await apiClient.marketplaceItems.updateStatus({ id: 'mp1', status: 'sold' });
      expect(result).toEqual(updated);
      expect(fetch).toHaveBeenCalledWith('/api/marketplace-items/mp1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sold' }),
      });
    });
  });

  describe('marketplaceItems.delete', () => {
    it('sends DELETE to /api/marketplace-items/:id', async () => {
      mockFetch({ success: true });

      const result = await apiClient.marketplaceItems.delete('mp1');
      expect(result).toEqual({ success: true });
      expect(fetch).toHaveBeenCalledWith('/api/marketplace-items/mp1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('error handling', () => {
    it('throws ApiError on non-ok response', async () => {
      mockFetch({ error: 'Not found' }, 404);

      await expect(apiClient.announcements.get('missing')).rejects.toThrow(ApiError);
    });

    it('includes status code in ApiError', async () => {
      mockFetch({ error: 'Not found' }, 404);

      try {
        await apiClient.announcements.get('missing');
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
      }
    });
  });
});
