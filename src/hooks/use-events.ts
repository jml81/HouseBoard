import { useQuery } from '@tanstack/react-query';
import type { HousingEvent, EventStatus } from '@/types';
import { apiClient } from '@/lib/api-client';

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
