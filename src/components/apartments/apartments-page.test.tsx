import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { ApartmentsPage } from './apartments-page';

describe('ApartmentsPage', () => {
  it('renders page header', () => {
    renderWithProviders(<ApartmentsPage />);
    expect(screen.getByText('Huoneistot')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderWithProviders(<ApartmentsPage />);
    expect(screen.getByPlaceholderText('Hae huoneistoa tai asukasta...')).toBeInTheDocument();
  });

  it('renders staircase filter buttons', () => {
    renderWithProviders(<ApartmentsPage />);
    expect(screen.getByText('Kaikki')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('shows total count of 24 apartments', () => {
    renderWithProviders(<ApartmentsPage />);
    expect(screen.getByText('24 yhteensä')).toBeInTheDocument();
  });

  it('renders all 24 apartments', () => {
    renderWithProviders(<ApartmentsPage />);
    expect(screen.getByText('A 1')).toBeInTheDocument();
    expect(screen.getByText('C 24')).toBeInTheDocument();
  });

  it('filters by staircase', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await user.click(screen.getByText('B'));
    expect(screen.getByText('8 yhteensä')).toBeInTheDocument();
    expect(screen.getByText('B 9')).toBeInTheDocument();
    expect(screen.queryByText('A 1')).not.toBeInTheDocument();
  });

  it('filters by search text', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await user.type(screen.getByPlaceholderText('Hae huoneistoa tai asukasta...'), 'Virtanen');
    expect(screen.getByText('Aino Virtanen')).toBeInTheDocument();
    expect(screen.getByText('Pekka Virtanen')).toBeInTheDocument();
    expect(screen.getByText('2 yhteensä')).toBeInTheDocument();
  });

  it('shows empty state when no results', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await user.type(screen.getByPlaceholderText('Hae huoneistoa tai asukasta...'), 'zzzzzzz');
    expect(screen.getByText('Ei hakutuloksia')).toBeInTheDocument();
  });

  it('renders view tabs', () => {
    renderWithProviders(<ApartmentsPage />);
    expect(screen.getByText('Luettelo')).toBeInTheDocument();
    expect(screen.getByText('Vastikkeet')).toBeInTheDocument();
  });

  it('switches to payment view', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await user.click(screen.getByText('Vastikkeet'));
    expect(screen.getAllByText('Maksettu').length).toBeGreaterThan(0);
  });

  it('payment view shows monthly charges', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await user.click(screen.getByText('Vastikkeet'));
    expect(screen.getAllByText(/€/).length).toBeGreaterThan(0);
  });

  it('payment summary shows counts', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ApartmentsPage />);

    await user.click(screen.getByText('Vastikkeet'));
    // Summary bar should show paid/pending/overdue counts
    expect(screen.getByText('Rästit yhteensä')).toBeInTheDocument();
  });
});
