import { useQuery } from '@tanstack/react-query';
import type { Contact, ContactRole } from '@/types';
import { apiClient } from '@/lib/api-client';

export const contactKeys = {
  all: ['contacts'] as const,
  list: (role?: ContactRole) =>
    role ? ([...contactKeys.all, 'list', role] as const) : ([...contactKeys.all, 'list'] as const),
};

export function useContacts(role?: ContactRole): {
  data: Contact[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: contactKeys.list(role),
    queryFn: () => apiClient.contacts.list(role),
  });
}
