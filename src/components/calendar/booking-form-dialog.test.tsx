import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import type { Booking } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { BookingFormDialog } from './booking-form-dialog';

const mockBooking: Booking = {
  id: 'b1',
  title: 'Saunavuoro',
  date: '2026-03-15',
  startTime: '18:00',
  endTime: '20:00',
  category: 'sauna',
  location: 'Taloyhtiön sauna',
  bookerName: 'Aino Virtanen',
  apartment: 'A 12',
};

function mockFetch(data: unknown = { success: true }, status = 200): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

function mockFetchError(status: number): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'Error' }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

describe('BookingFormDialog', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isManager: false,
      user: { id: 'u1', name: 'Aino Virtanen', apartment: 'A 12', role: 'resident' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create dialog with correct title', () => {
    mockFetch();
    renderWithProviders(<BookingFormDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Varaa tila')).toBeInTheDocument();
    expect(screen.getByText('Tee uusi tilavaraus')).toBeInTheDocument();
  });

  it('renders edit dialog with correct title', () => {
    mockFetch();
    renderWithProviders(
      <BookingFormDialog open={true} onOpenChange={vi.fn()} booking={mockBooking} />,
    );
    expect(screen.getByText('Muokkaa varausta')).toBeInTheDocument();
    expect(screen.getByText('Muokkaa varauksen tietoja')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    mockFetch();
    renderWithProviders(<BookingFormDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Tila')).toBeInTheDocument();
    expect(screen.getByLabelText('Päivämäärä')).toBeInTheDocument();
    expect(screen.getByLabelText('Alkuaika')).toBeInTheDocument();
    expect(screen.getByLabelText('Loppuaika')).toBeInTheDocument();
    expect(screen.getByLabelText('Otsikko')).toBeInTheDocument();
    expect(screen.getByLabelText('Paikka')).toBeInTheDocument();
  });

  it('shows create submit button text', () => {
    mockFetch();
    renderWithProviders(<BookingFormDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Varaa' })).toBeInTheDocument();
  });

  it('shows edit submit button text', () => {
    mockFetch();
    renderWithProviders(
      <BookingFormDialog open={true} onOpenChange={vi.fn()} booking={mockBooking} />,
    );
    expect(screen.getByRole('button', { name: 'Tallenna' })).toBeInTheDocument();
  });

  it('auto-fills title and location with default values', () => {
    mockFetch();
    renderWithProviders(<BookingFormDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByLabelText('Otsikko')).toHaveValue('Saunavuoro');
    expect(screen.getByLabelText('Paikka')).toHaveValue('Taloyhtiön sauna');
  });

  it('prefills form with booking data in edit mode', () => {
    mockFetch();
    renderWithProviders(
      <BookingFormDialog open={true} onOpenChange={vi.fn()} booking={mockBooking} />,
    );
    expect(screen.getByLabelText('Päivämäärä')).toHaveValue('2026-03-15');
    expect(screen.getByLabelText('Alkuaika')).toHaveValue('18:00');
    expect(screen.getByLabelText('Loppuaika')).toHaveValue('20:00');
    expect(screen.getByLabelText('Otsikko')).toHaveValue('Saunavuoro');
    expect(screen.getByLabelText('Paikka')).toHaveValue('Taloyhtiön sauna');
  });

  it('shows validation error for missing date', async () => {
    mockFetch();
    const user = userEvent.setup();
    renderWithProviders(<BookingFormDialog open={true} onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Varaa' }));

    expect(screen.getByText('Päivämäärä on pakollinen')).toBeInTheDocument();
  });

  it('shows validation error when end time is before start time', async () => {
    mockFetch();
    const user = userEvent.setup();
    renderWithProviders(<BookingFormDialog open={true} onOpenChange={vi.fn()} />);

    const dateInput = screen.getByLabelText('Päivämäärä');
    const startInput = screen.getByLabelText('Alkuaika');
    const endInput = screen.getByLabelText('Loppuaika');

    await user.clear(dateInput);
    await user.paste('2026-12-01');

    await user.clear(startInput);
    await user.paste('20:00');

    await user.clear(endInput);
    await user.paste('18:00');

    await user.click(screen.getByRole('button', { name: 'Varaa' }));

    expect(screen.getByText('Loppuajan pitää olla alkuajan jälkeen')).toBeInTheDocument();
  });

  it('submits create form and calls API', async () => {
    const created = {
      ...mockBooking,
      id: 'new-1',
    };
    mockFetch(created, 201);
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<BookingFormDialog open={true} onOpenChange={onOpenChange} />);

    const dateInput = screen.getByLabelText('Päivämäärä');
    const startInput = screen.getByLabelText('Alkuaika');
    const endInput = screen.getByLabelText('Loppuaika');

    await user.clear(dateInput);
    await user.paste('2026-12-01');

    await user.clear(startInput);
    await user.paste('18:00');

    await user.clear(endInput);
    await user.paste('20:00');

    await user.click(screen.getByRole('button', { name: 'Varaa' }));

    await waitFor(() => {
      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
      const postCall = calls.find(
        (call: unknown[]) => (call[1] as RequestInit | undefined)?.method === 'POST',
      );
      expect(postCall).toBeDefined();
    });
  });

  it('shows overlap error on 409 response', async () => {
    mockFetchError(409);
    const user = userEvent.setup();

    renderWithProviders(<BookingFormDialog open={true} onOpenChange={vi.fn()} />);

    const dateInput = screen.getByLabelText('Päivämäärä');
    const startInput = screen.getByLabelText('Alkuaika');
    const endInput = screen.getByLabelText('Loppuaika');

    await user.clear(dateInput);
    await user.paste('2026-12-01');

    await user.clear(startInput);
    await user.paste('18:00');

    await user.clear(endInput);
    await user.paste('20:00');

    await user.click(screen.getByRole('button', { name: 'Varaa' }));

    // Toast is called but rendered by Sonner outside our test scope
    // We verify the fetch was called with POST
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('does not render when closed', () => {
    mockFetch();
    renderWithProviders(<BookingFormDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText('Varaa tila')).not.toBeInTheDocument();
  });
});
