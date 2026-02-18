import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Apartment, ApartmentPayment } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { CreateApartmentPaymentInput, UpdateApartmentPaymentInput } from '@/lib/api-client';

export const apartmentKeys = {
  all: ['apartments'] as const,
  list: (staircase?: string) =>
    staircase
      ? ([...apartmentKeys.all, 'list', staircase] as const)
      : ([...apartmentKeys.all, 'list'] as const),
  payments: () => ['apartment-payments', 'list'] as const,
  payment: (apartmentId: string) => ['apartment-payments', 'detail', apartmentId] as const,
};

export function useApartments(staircase?: string): {
  data: Apartment[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: apartmentKeys.list(staircase),
    queryFn: () => apiClient.apartments.list(staircase),
  });
}

export function useApartmentPayments(): {
  data: ApartmentPayment[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: apartmentKeys.payments(),
    queryFn: () => apiClient.apartmentPayments.list(),
  });
}

export function useApartmentPayment(apartmentId: string): {
  data: ApartmentPayment | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: apartmentKeys.payment(apartmentId),
    queryFn: () => apiClient.apartmentPayments.get(apartmentId),
  });
}

export function useCreateApartmentPayment(): ReturnType<
  typeof useMutation<ApartmentPayment, Error, CreateApartmentPaymentInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateApartmentPaymentInput) => apiClient.apartmentPayments.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apartmentKeys.payments() });
    },
  });
}

export function useUpdateApartmentPayment(): ReturnType<
  typeof useMutation<ApartmentPayment, Error, UpdateApartmentPaymentInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateApartmentPaymentInput) => apiClient.apartmentPayments.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apartmentKeys.payments() });
    },
  });
}

export function useDeleteApartmentPayment(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (apartmentId: string) => apiClient.apartmentPayments.delete(apartmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apartmentKeys.payments() });
    },
  });
}
