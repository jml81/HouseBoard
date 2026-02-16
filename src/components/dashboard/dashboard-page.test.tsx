import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouterContext } from '@/test-utils';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  it('renders welcome message', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(screen.getByText('Tervetuloa!')).toBeInTheDocument();
  });

  it('renders building name', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(screen.getByText('As Oy Mäntyrinne')).toBeInTheDocument();
  });

  it('renders all four summary cards', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(screen.getByText('Tulevat varaukset')).toBeInTheDocument();
    expect(screen.getByText('Viimeisimmät tiedotteet')).toBeInTheDocument();
    expect(screen.getByText('Tulevat tapahtumat')).toBeInTheDocument();
    expect(screen.getByText('Uusimmat materiaalit')).toBeInTheDocument();
  });

  it('renders show all links', async () => {
    await renderWithRouterContext(<DashboardPage />);
    const showAllLinks = screen.getAllByText('Näytä kaikki');
    expect(showAllLinks).toHaveLength(4);
  });

  it('renders upcoming bookings', async () => {
    await renderWithRouterContext(<DashboardPage />);
    // Multiple "Saunavuoro" entries in the mock data
    expect(screen.getAllByText('Saunavuoro').length).toBeGreaterThanOrEqual(1);
  });

  it('renders latest announcements', async () => {
    await renderWithRouterContext(<DashboardPage />);
    expect(screen.getByText('Kevätsiivous 15.3.2026')).toBeInTheDocument();
  });
});
