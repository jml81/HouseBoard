import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Material, MaterialCategory } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { CreateMaterialInput, UpdateMaterialInput } from '@/lib/api-client';

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

export function useCreateMaterial(): ReturnType<
  typeof useMutation<Material, Error, CreateMaterialInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMaterialInput) => apiClient.materials.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
  });
}

export function useUpdateMaterial(): ReturnType<
  typeof useMutation<Material, Error, UpdateMaterialInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMaterialInput) => apiClient.materials.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
  });
}

export function useDeleteMaterial(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.materials.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
  });
}
