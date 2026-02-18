import type {
  Announcement,
  AnnouncementCategory,
  Building,
  Booking,
  BookingCategory,
  HousingEvent,
  EventStatus,
  Material,
  MaterialCategory,
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
} from '@/types';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.status.toString()}`);
  }
  return response.json() as Promise<T>;
}

async function mutateJson<T>(url: string, options: { method: string; body?: unknown }): Promise<T> {
  const init: RequestInit = {
    method: options.method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.status.toString()}`);
  }
  return response.json() as Promise<T>;
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

export const apiClient = {
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
  },

  events: {
    list(status?: EventStatus): Promise<HousingEvent[]> {
      const url = status ? `/api/events?status=${encodeURIComponent(status)}` : '/api/events';
      return fetchJson<HousingEvent[]>(url);
    },
    get(id: string): Promise<HousingEvent> {
      return fetchJson<HousingEvent>(`/api/events/${encodeURIComponent(id)}`);
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

  apartmentPayments: {
    list(): Promise<ApartmentPayment[]> {
      return fetchJson<ApartmentPayment[]>('/api/apartment-payments');
    },
    get(apartmentId: string): Promise<ApartmentPayment> {
      return fetchJson<ApartmentPayment>(
        `/api/apartments/${encodeURIComponent(apartmentId)}/payments`,
      );
    },
  },
};
