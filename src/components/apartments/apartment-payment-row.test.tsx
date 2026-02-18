import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';
import { ApartmentPaymentRow } from './apartment-payment-row';
import type { Apartment, ApartmentPayment } from '@/types';

const mockApartment: Apartment = {
  id: 'apt-a1',
  number: 'A 1',
  staircase: 'A',
  floor: 1,
  type: '2h+k',
  area: 45.5,
  shares: '1-455',
  resident: 'Kari Mäkinen',
};

const mockPaymentPaid: ApartmentPayment = {
  apartmentId: 'apt-a1',
  monthlyCharge: 240,
  paymentStatus: 'paid',
  lastPaymentDate: '2026-02-01',
  arrears: 0,
  chargeBreakdown: { hoitovastike: 156, rahoitusvastike: 60, vesimaksu: 24 },
};

const mockPaymentOverdue: ApartmentPayment = {
  apartmentId: 'apt-a4',
  monthlyCharge: 240,
  paymentStatus: 'overdue',
  lastPaymentDate: '2025-12-02',
  arrears: 480,
  chargeBreakdown: { hoitovastike: 156, rahoitusvastike: 60, vesimaksu: 24 },
};

describe('ApartmentPaymentRow', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    useAuthStore.setState({ isManager: false });
  });

  it('renders apartment number and resident', () => {
    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );
    expect(screen.getByText('A 1')).toBeInTheDocument();
    expect(screen.getByText('Kari Mäkinen')).toBeInTheDocument();
  });

  it('renders monthly charge', () => {
    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );
    expect(screen.getByText(/240/)).toBeInTheDocument();
  });

  it('renders correct status badge for paid', () => {
    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );
    expect(screen.getByText('Maksettu')).toBeInTheDocument();
  });

  it('shows arrears when overdue', () => {
    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentOverdue} />,
    );
    expect(screen.getByText(/480/)).toBeInTheDocument();
  });

  it('does not show arrears badge when paid', () => {
    const { container } = renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );
    const destructiveBadges = container.querySelectorAll('[data-variant="destructive"]');
    expect(destructiveBadges).toHaveLength(0);
  });

  it('expands to show breakdown on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );

    expect(screen.queryByText('Hoitovastike')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Hoitovastike')).toBeInTheDocument();
    expect(screen.getByText('Rahoitusvastike')).toBeInTheDocument();
    expect(screen.getByText('Vesimaksu')).toBeInTheDocument();
    expect(screen.getByText(/156/)).toBeInTheDocument();
  });

  it('does not show edit/delete buttons when not manager', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({ isManager: false });

    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );

    await user.click(screen.getByRole('button'));

    expect(screen.queryByText('Muokkaa vastiketietoja')).not.toBeInTheDocument();
    expect(screen.queryByText('Poista vastiketiedot')).not.toBeInTheDocument();
  });

  it('shows edit/delete buttons when manager and expanded', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({ isManager: true });

    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Muokkaa vastiketietoja')).toBeInTheDocument();
    expect(screen.getByText('Poista vastiketiedot')).toBeInTheDocument();
  });

  it('opens edit dialog on edit button click', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({ isManager: true });

    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Muokkaa vastiketietoja'));

    expect(screen.getByText('Muokkaa huoneiston vastiketietoja')).toBeInTheDocument();
  });

  it('opens delete confirmation dialog on delete button click', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({ isManager: true });

    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Poista vastiketiedot'));

    expect(
      screen.getByText('Haluatko varmasti poistaa tämän huoneiston vastiketiedot?'),
    ).toBeInTheDocument();
  });

  it('calls delete mutation when confirming delete', async () => {
    const user = userEvent.setup();
    useAuthStore.setState({ isManager: true });

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    renderWithProviders(
      <ApartmentPaymentRow apartment={mockApartment} payment={mockPaymentPaid} />,
    );

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Poista vastiketiedot'));
    await user.click(screen.getByRole('button', { name: 'Poista' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/apartment-payments/apt-a1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
