import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
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
});
