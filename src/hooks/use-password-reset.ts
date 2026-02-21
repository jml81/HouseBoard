import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useForgotPassword(): ReturnType<
  typeof useMutation<{ message: string }, Error, string>
> {
  return useMutation({
    mutationFn: (email: string) => apiClient.auth.forgotPassword(email),
  });
}

export function useResetPassword(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, { token: string; newPassword: string }>
> {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      apiClient.auth.resetPassword(token, newPassword),
  });
}
