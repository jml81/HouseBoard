import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Meeting, MeetingDocument, MeetingStatus } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { CreateMeetingInput, UpdateMeetingInput } from '@/lib/api-client';

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

export function useCreateMeeting(): ReturnType<
  typeof useMutation<Meeting, Error, CreateMeetingInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMeetingInput) => apiClient.meetings.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
}

export function useUpdateMeeting(): ReturnType<
  typeof useMutation<Meeting, Error, UpdateMeetingInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMeetingInput) => apiClient.meetings.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
}

export function useDeleteMeeting(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.meetings.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
}

export function useUploadMeetingDocument(): ReturnType<
  typeof useMutation<MeetingDocument, Error, { meetingId: string; file: File; name?: string }>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { meetingId: string; file: File; name?: string }) =>
      apiClient.meetingDocuments.upload(input.meetingId, input.file, input.name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
}

export function useDeleteMeetingDocument(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, { meetingId: string; docId: string }>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { meetingId: string; docId: string }) =>
      apiClient.meetingDocuments.delete(input.meetingId, input.docId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: meetingKeys.all });
    },
  });
}
