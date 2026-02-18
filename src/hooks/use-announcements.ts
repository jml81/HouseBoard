import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Announcement, AnnouncementCategory } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { CreateAnnouncementInput, UpdateAnnouncementInput } from '@/lib/api-client';

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

export function useCreateAnnouncement(): ReturnType<
  typeof useMutation<Announcement, Error, CreateAnnouncementInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAnnouncementInput) => apiClient.announcements.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: announcementKeys.all });
    },
  });
}

export function useUpdateAnnouncement(): ReturnType<
  typeof useMutation<Announcement, Error, UpdateAnnouncementInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAnnouncementInput) => apiClient.announcements.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: announcementKeys.all });
    },
  });
}

export function useDeleteAnnouncement(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.announcements.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: announcementKeys.all });
    },
  });
}
