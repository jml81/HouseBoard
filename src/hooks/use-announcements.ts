import { useQuery } from '@tanstack/react-query';
import type { Announcement, AnnouncementCategory } from '@/types';
import { apiClient } from '@/lib/api-client';

export const announcementKeys = {
  all: ['announcements'] as const,
  list: (category?: AnnouncementCategory) =>
    category
      ? ([...announcementKeys.all, 'list', category] as const)
      : ([...announcementKeys.all, 'list'] as const),
  detail: (id: string) => [...announcementKeys.all, 'detail', id] as const,
};

export function useAnnouncements(category?: AnnouncementCategory): {
  data: Announcement[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: announcementKeys.list(category),
    queryFn: () => apiClient.announcements.list(category),
  });
}

export function useAnnouncement(id: string): {
  data: Announcement | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: () => apiClient.announcements.get(id),
  });
}
