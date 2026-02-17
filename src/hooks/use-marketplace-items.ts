import { useQuery } from '@tanstack/react-query';
import type { MarketplaceItem } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { MarketplaceFilters } from '@/lib/api-client';

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
