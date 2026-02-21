import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Contact, ContactRole } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { CreateContactInput, UpdateContactInput } from '@/lib/api-client';

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

export function useCreateContact(): ReturnType<
  typeof useMutation<Contact, Error, CreateContactInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateContactInput) => apiClient.contacts.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}

export function useUpdateContact(): ReturnType<
  typeof useMutation<Contact, Error, UpdateContactInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateContactInput) => apiClient.contacts.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}

export function useDeleteContact(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.contacts.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}
