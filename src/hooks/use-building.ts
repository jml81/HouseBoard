import { useQuery } from '@tanstack/react-query';
import type { Building } from '@/types';
import { apiClient } from '@/lib/api-client';

export const buildingKeys = {
  all: ['building'] as const,
  detail: () => [...buildingKeys.all, 'detail'] as const,
};

export function useBuilding(): {
  data: Building | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: buildingKeys.detail(),
    queryFn: () => apiClient.building.get(),
  });
}
