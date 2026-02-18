import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { HousingEvent, EventStatus } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { CreateEventInput, UpdateEventInput } from '@/lib/api-client';

export const eventKeys = {
  all: ['events'] as const,
  list: (status?: EventStatus) =>
    status ? ([...eventKeys.all, 'list', status] as const) : ([...eventKeys.all, 'list'] as const),
  detail: (id: string) => [...eventKeys.all, 'detail', id] as const,
};

export function useEvents(status?: EventStatus): {
  data: HousingEvent[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: eventKeys.list(status),
    queryFn: () => apiClient.events.list(status),
  });
}

export function useEvent(id: string): {
  data: HousingEvent | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => apiClient.events.get(id),
  });
}

export function useCreateEvent(): ReturnType<
  typeof useMutation<HousingEvent, Error, CreateEventInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventInput) => apiClient.events.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useUpdateEvent(): ReturnType<
  typeof useMutation<HousingEvent, Error, UpdateEventInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEventInput) => apiClient.events.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useDeleteEvent(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.events.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
