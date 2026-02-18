import { useMutation } from '@tanstack/react-query';
import type { AuthResponse, LoginCredentials } from '@/types';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

export function useLogin(): ReturnType<typeof useMutation<AuthResponse, Error, LoginCredentials>> {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.auth.login(credentials),
    onSuccess: (data) => {
      login(data);
    },
  });
}
