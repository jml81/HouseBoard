import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { ApartmentsPage } from './apartments-page';

const mockApartments = [
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
    id: 'apt-a8',
    number: 'A 8',
    staircase: 'A',
    floor: 4,
    type: '2h+k',
    area: 46.0,
    shares: '3756-4215',
    resident: 'Aino Virtanen',
  },
  {
    id: 'apt-b1',
    number: 'B 9',
    staircase: 'B',
    floor: 1,
    type: '2h+k',
    area: 47.0,
    shares: '4216-4685',
    resident: 'Pekka Virtanen',
  },
  {
    id: 'apt-c8',
    number: 'C 24',
    staircase: 'C',
    floor: 4,
    type: '2h+k',
    area: 47.0,
    shares: '12271-12740',
    resident: 'Sirpa Mattila',
  },
];

const mockPayments = [
  {
    apartmentId: 'apt-a1',
    monthlyCharge: 240,
    paymentStatus: 'paid',
    lastPaymentDate: '2026-02-01',
    arrears: 0,
    chargeBreakdown: { hoitovastike: 156, rahoitusvastike: 60, vesimaksu: 24 },
  },
  {
    apartmentId: 'apt-a8',
    monthlyCharge: 240,
    paymentStatus: 'paid',
    lastPaymentDate: '2026-02-02',
    arrears: 0,
    chargeBreakdown: { hoitovastike: 156, rahoitusvastike: 60, vesimaksu: 24 },
  },
  {
    apartmentId: 'apt-b1',
    monthlyCharge: 240,
    paymentStatus: 'paid',
    lastPaymentDate: '2026-02-01',
    arrears: 0,
    chargeBreakdown: { hoitovastike: 156, rahoitusvastike: 60, vesimaksu: 24 },
  },
  {
    apartmentId: 'apt-c8',
    monthlyCharge: 240,
    paymentStatus: 'overdue',
    lastPaymentDate: '2025-12-05',
    arrears: 480,
    chargeBreakdown: { hoitovastike: 156, rahoitusvastike: 60, vesimaksu: 24 },
  },
];

function okJson(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('ApartmentsPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/api/apartment-payments')) return Promise.resolve(okJson(mockPayments));
        if (url.includes('/api/apartments')) return Promise.resolve(okJson(mockApartments));
        return Promise.resolve(okJson([]));
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders page header', () => {
    renderWithProviders(<ApartmentsPage />);
    expect(screen.getByText('Huoneistot')).toBeInTheDocument();
  });

  it('renders search input', async () => {
    renderWithProviders(<ApartmentsPage />);
    expect(
      await screen.findByPlaceholderText('Hae huoneistoa tai asukasta...'),
    ).toBeInTheDocument();
  });

  it('renders staircase filter buttons', async () => {
    renderWithProviders(<ApartmentsPage />);
    await screen.findByText('A 1');
    expect(screen.getByText('Kaikki')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('shows total count of apartments', async () => {
    renderWithProviders(<ApartmentsPage />);
    expect(await screen.findByText('4 yhteensä')).toBeInTheDocument();
  });

  it('renders apartments', async () => {
    renderWithProviders(<ApartmentsPage />);
    expect(await screen.findByText('A 1')).toBeInTheDocument();
    expect(screen.getByText('C 24')).toBeInTheDocument();
  });

  it('filters by staircase', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await screen.findByText('A 1');
    await user.click(screen.getByText('B'));
    expect(screen.getByText('1 yhteensä')).toBeInTheDocument();
    expect(screen.getByText('B 9')).toBeInTheDocument();
    expect(screen.queryByText('A 1')).not.toBeInTheDocument();
  });

  it('filters by search text', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await screen.findByText('A 1');
    await user.type(screen.getByPlaceholderText('Hae huoneistoa tai asukasta...'), 'Virtanen');
    expect(screen.getByText('Aino Virtanen')).toBeInTheDocument();
    expect(screen.getByText('Pekka Virtanen')).toBeInTheDocument();
    expect(screen.getByText('2 yhteensä')).toBeInTheDocument();
  });

  it('shows empty state when no results', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await screen.findByText('A 1');
    await user.type(screen.getByPlaceholderText('Hae huoneistoa tai asukasta...'), 'zzzzzzz');
    expect(screen.getByText('Ei hakutuloksia')).toBeInTheDocument();
  });

  it('renders view tabs', async () => {
    renderWithProviders(<ApartmentsPage />);
    await screen.findByText('A 1');
    expect(screen.getByText('Luettelo')).toBeInTheDocument();
    expect(screen.getByText('Vastikkeet')).toBeInTheDocument();
  });

  it('switches to payment view', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await screen.findByText('A 1');
    await user.click(screen.getByText('Vastikkeet'));
    expect(screen.getAllByText('Maksettu').length).toBeGreaterThan(0);
  });

  it('payment view shows monthly charges', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await screen.findByText('A 1');
    await user.click(screen.getByText('Vastikkeet'));
    expect(screen.getAllByText(/€/).length).toBeGreaterThan(0);
  });

  it('payment summary shows counts', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await screen.findByText('A 1');
    await user.click(screen.getByText('Vastikkeet'));
    expect(screen.getByText('Rästit yhteensä')).toBeInTheDocument();
  });
});
