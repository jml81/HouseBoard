import type {
  Announcement,
  AnnouncementCategory,
  AuthResponse,
  Building,
  Booking,
  BookingCategory,
  HousingEvent,
  EventStatus,
  LoginCredentials,
  Material,
  MaterialCategory,
  FileType,
  Meeting,
  MeetingStatus,
  BoardMember,
  Apartment,
  Contact,
  ContactRole,
  MarketplaceItem,
  MarketplaceCategory,
  ItemCondition,
  ItemStatus,
  ApartmentPayment,
  PaymentStatus,
  User,
  CreateUserInput,
  UpdateUserInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from '@/types';
import { useAuthStore } from '@/stores/auth-store';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

function handleUnauthorized(status: number): void {
  if (status === 401) {
    useAuthStore.getState().logout();
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    handleUnauthorized(response.status);
    throw new ApiError(response.status, `API error: ${response.status.toString()}`);
  }
  return response.json() as Promise<T>;
}

async function mutateJson<T>(url: string, options: { method: string; body?: unknown }): Promise<T> {
  const init: RequestInit = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }
  const response = await fetch(url, init);
  if (!response.ok) {
    handleUnauthorized(response.status);
    throw new ApiError(response.status, `API error: ${response.status.toString()}`);
  }
  return response.json() as Promise<T>;
}

export interface CreateAnnouncementInput {
  title: string;
  summary: string;
  content: string;
  category: AnnouncementCategory;
  author: string;
}

export interface UpdateAnnouncementInput {
  id: string;
  title?: string;
  summary?: string;
  content?: string;
  category?: AnnouncementCategory;
}

export interface MarketplaceFilters {
  category?: MarketplaceCategory;
  status?: ItemStatus;
  search?: string;
}

export interface CreateMarketplaceItemInput {
  title: string;
  description: string;
  price: number;
  category: MarketplaceCategory;
  condition: ItemCondition;
  sellerName: string;
  sellerApartment: string;
}

export interface UpdateMarketplaceStatusInput {
  id: string;
  status: ItemStatus;
}

export interface CreateBookingInput {
  category: BookingCategory;
  date: string;
  startTime: string;
  endTime: string;
  title?: string;
  location?: string;
  bookerName: string;
  apartment: string;
}

export interface UpdateBookingInput {
  id: string;
  category?: BookingCategory;
  date?: string;
  startTime?: string;
  endTime?: string;
  title?: string;
  location?: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
}

export interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  organizer?: string;
  status?: EventStatus;
}

export interface CreateMaterialInput {
  name: string;
  category: MaterialCategory;
  fileType: FileType;
  fileSize: string;
  updatedAt: string;
  description: string;
}

export interface UpdateMaterialInput {
  id: string;
  name?: string;
  category?: MaterialCategory;
  fileType?: FileType;
  fileSize?: string;
  updatedAt?: string;
  description?: string;
}

export interface CreateApartmentPaymentInput {
  apartmentId: string;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string;
  arrears: number;
  hoitovastike: number;
  rahoitusvastike: number;
  vesimaksu: number;
}

export interface UpdateApartmentPaymentInput {
  apartmentId: string;
  paymentStatus?: PaymentStatus;
  lastPaymentDate?: string;
  arrears?: number;
  hoitovastike?: number;
  rahoitusvastike?: number;
  vesimaksu?: number;
}

export const apiClient = {
  auth: {
    login(credentials: LoginCredentials): Promise<AuthResponse> {
      return mutateJson<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });
    },
  },

  announcements: {
    list(category?: AnnouncementCategory): Promise<Announcement[]> {
      const url = category
        ? `/api/announcements?category=${encodeURIComponent(category)}`
        : '/api/announcements';
      return fetchJson<Announcement[]>(url);
    },
    get(id: string): Promise<Announcement> {
      return fetchJson<Announcement>(`/api/announcements/${encodeURIComponent(id)}`);
    },
    create(input: CreateAnnouncementInput): Promise<Announcement> {
      return mutateJson<Announcement>('/api/announcements', {
        method: 'POST',
        body: input,
      });
    },
    update(input: UpdateAnnouncementInput): Promise<Announcement> {
      const { id, ...data } = input;
      return mutateJson<Announcement>(`/api/announcements/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: data,
      });
    },
    delete(id: string): Promise<{ success: boolean }> {
      return mutateJson<{ success: boolean }>(`/api/announcements/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    },
  },

  building: {
    get(): Promise<Building> {
      return fetchJson<Building>('/api/building');
    },
  },

  bookings: {
    list(category?: BookingCategory): Promise<Booking[]> {
      const url = category
        ? `/api/bookings?category=${encodeURIComponent(category)}`
        : '/api/bookings';
      return fetchJson<Booking[]>(url);
    },
    get(id: string): Promise<Booking> {
      return fetchJson<Booking>(`/api/bookings/${encodeURIComponent(id)}`);
    },
    create(input: CreateBookingInput): Promise<Booking> {
      return mutateJson<Booking>('/api/bookings', {
        method: 'POST',
        body: input,
      });
    },
    update(input: UpdateBookingInput): Promise<Booking> {
      const { id, ...data } = input;
      return mutateJson<Booking>(`/api/bookings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: data,
      });
    },
    delete(id: string): Promise<{ success: boolean }> {
      return mutateJson<{ success: boolean }>(`/api/bookings/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    },
  },

  events: {
    list(status?: EventStatus): Promise<HousingEvent[]> {
      const url = status ? `/api/events?status=${encodeURIComponent(status)}` : '/api/events';
      return fetchJson<HousingEvent[]>(url);
    },
    get(id: string): Promise<HousingEvent> {
      return fetchJson<HousingEvent>(`/api/events/${encodeURIComponent(id)}`);
    },
    create(input: CreateEventInput): Promise<HousingEvent> {
      return mutateJson<HousingEvent>('/api/events', {
        method: 'POST',
        body: input,
      });
    },
    update(input: UpdateEventInput): Promise<HousingEvent> {
      const { id, ...data } = input;
      return mutateJson<HousingEvent>(`/api/events/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: data,
      });
    },
    delete(id: string): Promise<{ success: boolean }> {
      return mutateJson<{ success: boolean }>(`/api/events/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    },
  },

  materials: {
    list(category?: MaterialCategory): Promise<Material[]> {
      const url = category
        ? `/api/materials?category=${encodeURIComponent(category)}`
        : '/api/materials';
      return fetchJson<Material[]>(url);
    },
    get(id: string): Promise<Material> {
      return fetchJson<Material>(`/api/materials/${encodeURIComponent(id)}`);
    },
    create(input: CreateMaterialInput): Promise<Material> {
      return mutateJson<Material>('/api/materials', {
        method: 'POST',
        body: input,
      });
    },
    update(input: UpdateMaterialInput): Promise<Material> {
      const { id, ...data } = input;
      return mutateJson<Material>(`/api/materials/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: data,
      });
    },
    delete(id: string): Promise<{ success: boolean }> {
      return mutateJson<{ success: boolean }>(`/api/materials/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    },
  },

  meetings: {
    list(status?: MeetingStatus): Promise<Meeting[]> {
      const url = status ? `/api/meetings?status=${encodeURIComponent(status)}` : '/api/meetings';
      return fetchJson<Meeting[]>(url);
    },
    get(id: string): Promise<Meeting> {
      return fetchJson<Meeting>(`/api/meetings/${encodeURIComponent(id)}`);
    },
  },

  boardMembers: {
    list(): Promise<BoardMember[]> {
      return fetchJson<BoardMember[]>('/api/board-members');
    },
  },

  apartments: {
    list(staircase?: string): Promise<Apartment[]> {
      const url = staircase
        ? `/api/apartments?staircase=${encodeURIComponent(staircase)}`
        : '/api/apartments';
      return fetchJson<Apartment[]>(url);
    },
  },

  contacts: {
    list(role?: ContactRole): Promise<Contact[]> {
      const url = role ? `/api/contacts?role=${encodeURIComponent(role)}` : '/api/contacts';
      return fetchJson<Contact[]>(url);
    },
  },

  marketplaceItems: {
    list(filters?: MarketplaceFilters): Promise<MarketplaceItem[]> {
      const params = new URLSearchParams();
      if (filters?.category) params.set('category', filters.category);
      if (filters?.status) params.set('status', filters.status);
      if (filters?.search) params.set('search', filters.search);
      const qs = params.toString();
      const url = qs ? `/api/marketplace-items?${qs}` : '/api/marketplace-items';
      return fetchJson<MarketplaceItem[]>(url);
    },
    get(id: string): Promise<MarketplaceItem> {
      return fetchJson<MarketplaceItem>(`/api/marketplace-items/${encodeURIComponent(id)}`);
    },
    create(input: CreateMarketplaceItemInput): Promise<MarketplaceItem> {
      return mutateJson<MarketplaceItem>('/api/marketplace-items', {
        method: 'POST',
        body: input,
      });
    },
    updateStatus(input: UpdateMarketplaceStatusInput): Promise<MarketplaceItem> {
      return mutateJson<MarketplaceItem>(`/api/marketplace-items/${encodeURIComponent(input.id)}`, {
        method: 'PATCH',
        body: { status: input.status },
      });
    },
    delete(id: string): Promise<{ success: boolean }> {
      return mutateJson<{ success: boolean }>(`/api/marketplace-items/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    },
  },

  users: {
    list(): Promise<User[]> {
      return fetchJson<User[]>('/api/users');
    },
    create(input: CreateUserInput): Promise<User> {
      return mutateJson<User>('/api/users', {
        method: 'POST',
        body: input,
      });
    },
    update(input: UpdateUserInput): Promise<User> {
      const { id, ...data } = input;
      return mutateJson<User>(`/api/users/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: data,
      });
    },
    delete(id: string): Promise<{ success: boolean }> {
      return mutateJson<{ success: boolean }>(`/api/users/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    },
  },

  profile: {
    update(input: UpdateProfileInput): Promise<User> {
      return mutateJson<User>('/api/profile', {
        method: 'PATCH',
        body: input,
      });
    },
    changePassword(input: ChangePasswordInput): Promise<{ success: boolean }> {
      return mutateJson<{ success: boolean }>('/api/profile/change-password', {
        method: 'POST',
        body: input,
      });
    },
  },

  apartmentPayments: {
    list(): Promise<ApartmentPayment[]> {
      return fetchJson<ApartmentPayment[]>('/api/apartment-payments');
    },
    get(apartmentId: string): Promise<ApartmentPayment> {
      return fetchJson<ApartmentPayment>(
        `/api/apartments/${encodeURIComponent(apartmentId)}/payments`,
      );
    },
    create(input: CreateApartmentPaymentInput): Promise<ApartmentPayment> {
      return mutateJson<ApartmentPayment>('/api/apartment-payments', {
        method: 'POST',
        body: input,
      });
    },
    update(input: UpdateApartmentPaymentInput): Promise<ApartmentPayment> {
      const { apartmentId, ...data } = input;
      return mutateJson<ApartmentPayment>(
        `/api/apartment-payments/${encodeURIComponent(apartmentId)}`,
        {
          method: 'PATCH',
          body: data,
        },
      );
    },
    delete(apartmentId: string): Promise<{ success: boolean }> {
      return mutateJson<{ success: boolean }>(
        `/api/apartment-payments/${encodeURIComponent(apartmentId)}`,
        {
          method: 'DELETE',
        },
      );
    },
  },
};
