import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { PaymentFormDialog } from './payment-form-dialog';
import type { Apartment, ApartmentPayment } from '@/types';

const mockApartments: Apartment[] = [
  {
    id: 'apt-a1',
    number: 'A 1',
    staircase: 'A',
    floor: 1,
    type: '2h+k',
    area: 45.5,
    shares: '1-455',
    resident: 'Kari Mäkinen',
  },
  {
    id: 'apt-a2',
    number: 'A 2',
    staircase: 'A',
    floor: 1,
    type: '3h+k',
    area: 65.0,
    shares: '456-1105',
    resident: 'Liisa Virtanen',
  },
];

const mockPayment: ApartmentPayment = {
  apartmentId: 'apt-a1',
  monthlyCharge: 240,
  paymentStatus: 'paid',
  lastPaymentDate: '2026-02-01',
  arrears: 0,
  chargeBreakdown: { hoitovastike: 156, rahoitusvastike: 60, vesimaksu: 24 },
};

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
};

describe('PaymentFormDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create dialog title when no payment prop', () => {
    renderWithProviders(
      <PaymentFormDialog
        {...defaultProps}
        apartments={mockApartments}
        existingPaymentIds={new Set()}
      />,
    );
    expect(screen.getByText('Lisää vastiketiedot')).toBeInTheDocument();
  });

  it('renders edit dialog title when payment prop is provided', () => {
    renderWithProviders(<PaymentFormDialog {...defaultProps} payment={mockPayment} />);
    expect(screen.getByText('Muokkaa vastiketietoja')).toBeInTheDocument();
  });

  it('shows apartment selector in create mode', () => {
    renderWithProviders(
      <PaymentFormDialog
        {...defaultProps}
        apartments={mockApartments}
        existingPaymentIds={new Set()}
      />,
    );
    expect(screen.getByText('Huoneisto')).toBeInTheDocument();
  });

  it('does not show apartment selector in edit mode', () => {
    renderWithProviders(<PaymentFormDialog {...defaultProps} payment={mockPayment} />);
    // The label "Huoneisto" should only appear as formApartment label in create mode
    // In edit mode, the apartments.payments.formApartment text should not render
    const labels = screen.queryAllByText('Huoneisto');
    // Should not find the form label (only in create mode)
    expect(labels).toHaveLength(0);
  });

  it('pre-fills form fields in edit mode', () => {
    renderWithProviders(<PaymentFormDialog {...defaultProps} payment={mockPayment} />);
    expect(screen.getByLabelText('Viimeisin maksupäivä')).toHaveValue('2026-02-01');
    expect(screen.getByLabelText('Rästit (€)')).toHaveValue(0);
    expect(screen.getByLabelText('Hoitovastike (€)')).toHaveValue(156);
    expect(screen.getByLabelText('Rahoitusvastike (€)')).toHaveValue(60);
    expect(screen.getByLabelText('Vesimaksu (€)')).toHaveValue(24);
  });

  it('calculates monthly total dynamically', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PaymentFormDialog
        {...defaultProps}
        apartments={mockApartments}
        existingPaymentIds={new Set()}
      />,
    );

    const hoitovastike = screen.getByLabelText('Hoitovastike (€)');
    await user.clear(hoitovastike);
    await user.paste('100');

    const rahoitusvastike = screen.getByLabelText('Rahoitusvastike (€)');
    await user.clear(rahoitusvastike);
    await user.paste('50');

    const vesimaksu = screen.getByLabelText('Vesimaksu (€)');
    await user.clear(vesimaksu);
    await user.paste('25');

    expect(screen.getByText(/175/)).toBeInTheDocument();
  });

  it('shows validation error when date is missing in create mode', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({}), { status: 201 })),
    );

    renderWithProviders(
      <PaymentFormDialog
        {...defaultProps}
        apartments={mockApartments}
        existingPaymentIds={new Set()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Lisää' }));

    expect(screen.getByText('Viimeisin maksupäivä on pakollinen')).toBeInTheDocument();
  });

  it('shows submit button with "Lisää" text in create mode', () => {
    renderWithProviders(
      <PaymentFormDialog
        {...defaultProps}
        apartments={mockApartments}
        existingPaymentIds={new Set()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Lisää' })).toBeInTheDocument();
  });

  it('shows submit button with "Tallenna" text in edit mode', () => {
    renderWithProviders(<PaymentFormDialog {...defaultProps} payment={mockPayment} />);
    expect(screen.getByRole('button', { name: 'Tallenna' })).toBeInTheDocument();
  });

  it('shows apartment required validation when submitting without apartment in create mode', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({}), { status: 201 })),
    );

    renderWithProviders(
      <PaymentFormDialog
        {...defaultProps}
        apartments={mockApartments}
        existingPaymentIds={new Set()}
      />,
    );

    // Fill date but not apartment
    const dateInput = screen.getByLabelText('Viimeisin maksupäivä');
    await user.clear(dateInput);
    await user.paste('2026-02-01');

    await user.click(screen.getByRole('button', { name: 'Lisää' }));

    expect(screen.getByText('Huoneisto on pakollinen')).toBeInTheDocument();
  });

  it('calls update mutation on submit in edit mode', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(mockPayment), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    renderWithProviders(<PaymentFormDialog {...defaultProps} payment={mockPayment} />);

    await user.click(screen.getByRole('button', { name: 'Tallenna' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/apartment-payments/apt-a1',
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });

  it('renders create form with apartment selector when apartments have existing payments', () => {
    renderWithProviders(
      <PaymentFormDialog
        {...defaultProps}
        apartments={mockApartments}
        existingPaymentIds={new Set(['apt-a1'])}
      />,
    );

    // Dialog should render with apartment selector visible
    expect(screen.getByText('Huoneisto')).toBeInTheDocument();
    // Form should render normally even with filtered apartments
    expect(screen.getByLabelText('Viimeisin maksupäivä')).toBeInTheDocument();
  });

  it('does not render form body when dialog is closed', () => {
    renderWithProviders(
      <PaymentFormDialog
        open={false}
        onOpenChange={vi.fn()}
        apartments={mockApartments}
        existingPaymentIds={new Set()}
      />,
    );
    expect(screen.queryByText('Viimeisin maksupäivä')).not.toBeInTheDocument();
  });
});
