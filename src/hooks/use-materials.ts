import { useQuery } from '@tanstack/react-query';
import type { Material, MaterialCategory } from '@/types';
import { apiClient } from '@/lib/api-client';

export const materialKeys = {
  all: ['materials'] as const,
  list: (category?: MaterialCategory) =>
    category
      ? ([...materialKeys.all, 'list', category] as const)
      : ([...materialKeys.all, 'list'] as const),
  detail: (id: string) => [...materialKeys.all, 'detail', id] as const,
};

export function useMaterials(category?: MaterialCategory): {
  data: Material[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: materialKeys.list(category),
    queryFn: () => apiClient.materials.list(category),
  });
}

export function useMaterial(id: string): {
  data: Material | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => apiClient.materials.get(id),
  });
}
