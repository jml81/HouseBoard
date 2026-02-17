import type { Announcement, AnnouncementCategory } from '@/types';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.status.toString()}`);
  }
  return response.json() as Promise<T>;
}

export const apiClient = {
  announcements: {
    list(category?: AnnouncementCategory): Promise<Announcement[]> {
      const url = category
        ? `/api/announcements?category=${encodeURIComponent(category)}`
        : '/api/announcements';
      return fetchJson<Announcement[]>(url);
    },
    get(id: string): Promise<Announcement> {
      return fetchJson<Announcement>(`/api/announcements/${encodeURIComponent(id)}`);
    },
  },
};
