import { useQuery } from '@tanstack/react-query';
import type { BoardMember } from '@/types';
import { apiClient } from '@/lib/api-client';

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
