import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiClient, ApiError } from './api-client';

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
