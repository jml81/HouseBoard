import { useMutation } from '@tanstack/react-query';
import type { User, UpdateProfileInput, ChangePasswordInput } from '@/types';
import { apiClient } from '@/lib/api-client';

export function useUpdateProfile(): ReturnType<
  typeof useMutation<User, Error, UpdateProfileInput>
> {
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => apiClient.profile.update(input),
  });
}

export function useChangePassword(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, ChangePasswordInput>
> {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => apiClient.profile.changePassword(input),
  });
}
