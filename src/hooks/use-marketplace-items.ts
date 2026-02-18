import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MarketplaceItem } from '@/types';
import { apiClient } from '@/lib/api-client';
import type {
  MarketplaceFilters,
  CreateMarketplaceItemInput,
  UpdateMarketplaceStatusInput,
} from '@/lib/api-client';

export const marketplaceItemKeys = {
  all: ['marketplace-items'] as const,
  list: (filters?: MarketplaceFilters) =>
    filters
      ? ([...marketplaceItemKeys.all, 'list', filters] as const)
      : ([...marketplaceItemKeys.all, 'list'] as const),
  detail: (id: string) => [...marketplaceItemKeys.all, 'detail', id] as const,
};

export function useMarketplaceItems(filters?: MarketplaceFilters): {
  data: MarketplaceItem[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: marketplaceItemKeys.list(filters),
    queryFn: () => apiClient.marketplaceItems.list(filters),
  });
}

export function useMarketplaceItem(id: string): {
  data: MarketplaceItem | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: marketplaceItemKeys.detail(id),
    queryFn: () => apiClient.marketplaceItems.get(id),
  });
}

export function useCreateMarketplaceItem(): ReturnType<
  typeof useMutation<MarketplaceItem, Error, CreateMarketplaceItemInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMarketplaceItemInput) => apiClient.marketplaceItems.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: marketplaceItemKeys.all });
    },
  });
}

export function useUpdateMarketplaceItemStatus(): ReturnType<
  typeof useMutation<MarketplaceItem, Error, UpdateMarketplaceStatusInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMarketplaceStatusInput) =>
      apiClient.marketplaceItems.updateStatus(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: marketplaceItemKeys.all });
    },
  });
}

export function useDeleteMarketplaceItem(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.marketplaceItems.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: marketplaceItemKeys.all });
    },
  });
}
