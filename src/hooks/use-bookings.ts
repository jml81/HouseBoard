import { useQuery } from '@tanstack/react-query';
import type { Booking, BookingCategory } from '@/types';
import { apiClient } from '@/lib/api-client';

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
