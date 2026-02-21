import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BoardMember } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { CreateBoardMemberInput, UpdateBoardMemberInput } from '@/lib/api-client';

export const boardMemberKeys = {
  all: ['board-members'] as const,
  list: () => [...boardMemberKeys.all, 'list'] as const,
};

export function useBoardMembers(): {
  data: BoardMember[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: boardMemberKeys.list(),
    queryFn: () => apiClient.boardMembers.list(),
  });
}

export function useCreateBoardMember(): ReturnType<
  typeof useMutation<BoardMember, Error, CreateBoardMemberInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBoardMemberInput) => apiClient.boardMembers.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardMemberKeys.all });
    },
  });
}

export function useUpdateBoardMember(): ReturnType<
  typeof useMutation<BoardMember, Error, UpdateBoardMemberInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBoardMemberInput) => apiClient.boardMembers.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardMemberKeys.all });
    },
  });
}

export function useDeleteBoardMember(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.boardMembers.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: boardMemberKeys.all });
    },
  });
}
