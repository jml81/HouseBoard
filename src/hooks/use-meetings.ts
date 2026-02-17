import { useQuery } from '@tanstack/react-query';
import type { Meeting, MeetingStatus } from '@/types';
import { apiClient } from '@/lib/api-client';

export const meetingKeys = {
  all: ['meetings'] as const,
  list: (status?: MeetingStatus) =>
    status
      ? ([...meetingKeys.all, 'list', status] as const)
      : ([...meetingKeys.all, 'list'] as const),
  detail: (id: string) => [...meetingKeys.all, 'detail', id] as const,
};

export function useMeetings(status?: MeetingStatus): {
  data: Meeting[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: meetingKeys.list(status),
    queryFn: () => apiClient.meetings.list(status),
  });
}

export function useMeeting(id: string): {
  data: Meeting | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: () => apiClient.meetings.get(id),
  });
}
