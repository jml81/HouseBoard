import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { EventsPage } from './events-page';

describe('EventsPage', () => {
  it('renders page header', () => {
    renderWithProviders(<EventsPage />);
    expect(screen.getByText('Tapahtumat')).toBeInTheDocument();
  });

  it('renders upcoming/past tabs', () => {
    renderWithProviders(<EventsPage />);
    expect(screen.getByText('Tulevat')).toBeInTheDocument();
    expect(screen.getByText('Menneet')).toBeInTheDocument();
  });

  it('renders upcoming events by default', () => {
    renderWithProviders(<EventsPage />);
    expect(screen.getByText('Kevättalkoot')).toBeInTheDocument();
    expect(screen.getByText('Yhtiökokous')).toBeInTheDocument();
  });

  it('shows past events when tab is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventsPage />);

    await user.click(screen.getByText('Menneet'));
    expect(screen.getByText('Jouluglögihetki')).toBeInTheDocument();
    expect(screen.getByText('Syystalkoot')).toBeInTheDocument();
  });

  it('renders event details (location, organizer, interested count)', () => {
    renderWithProviders(<EventsPage />);
    expect(screen.getByText('Piha-alue')).toBeInTheDocument();
    expect(screen.getAllByText(/Hallitus/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/18 kiinnostunutta/)).toBeInTheDocument();
  });
});
