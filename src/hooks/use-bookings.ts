import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Booking, BookingCategory } from '@/types';
import { apiClient } from '@/lib/api-client';
import type { CreateBookingInput, UpdateBookingInput } from '@/lib/api-client';

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (category?: BookingCategory) =>
    category
      ? ([...bookingKeys.all, 'list', category] as const)
      : ([...bookingKeys.all, 'list'] as const),
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};

export function useBookings(category?: BookingCategory): {
  data: Booking[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: bookingKeys.list(category),
    queryFn: () => apiClient.bookings.list(category),
  });
}

export function useBooking(id: string): {
  data: Booking | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => apiClient.bookings.get(id),
  });
}

export function useCreateBooking(): ReturnType<
  typeof useMutation<Booking, Error, CreateBookingInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) => apiClient.bookings.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useUpdateBooking(): ReturnType<
  typeof useMutation<Booking, Error, UpdateBookingInput>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBookingInput) => apiClient.bookings.update(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useDeleteBooking(): ReturnType<
  typeof useMutation<{ success: boolean }, Error, string>
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.bookings.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
