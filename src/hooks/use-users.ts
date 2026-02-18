import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserInput, UpdateUserInput } from '@/types';
import { apiClient } from '@/lib/api-client';

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
};

export function useUsers(): {
  data: User[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => apiClient.users.list(),
  });
}

export function useCreateUser(): ReturnType<typeof useMutation<User, Error, CreateUserInput>> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => apiClient.users.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUser(): ReturnType<typeof useMutation<User, Error, UpdateUserInput>> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => apiClient.users.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useDeleteUser(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.users.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
