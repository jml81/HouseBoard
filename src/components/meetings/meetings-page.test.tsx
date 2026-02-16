import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { MeetingsPage } from './meetings-page';

describe('MeetingsPage', () => {
  it('renders page header', () => {
    renderWithProviders(<MeetingsPage />);
    expect(screen.getByText('Kokoukset')).toBeInTheDocument();
  });

  it('renders upcoming/past tabs', () => {
    renderWithProviders(<MeetingsPage />);
    expect(screen.getByText('Tulevat')).toBeInTheDocument();
    expect(screen.getByText('Menneet')).toBeInTheDocument();
  });

  it('renders upcoming meetings by default', () => {
    renderWithProviders(<MeetingsPage />);
    expect(screen.getByText('Varsinainen yhtiökokous 2026')).toBeInTheDocument();
    expect(screen.getByText('Hallituksen kokous 3/2026')).toBeInTheDocument();
  });

  it('renders meeting type badges', () => {
    renderWithProviders(<MeetingsPage />);
    expect(screen.getByText('Yhtiökokous')).toBeInTheDocument();
    expect(screen.getByText('Hallituksen kokous')).toBeInTheDocument();
  });

  it('shows past meetings when tab is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingsPage />);

    await user.click(screen.getByText('Menneet'));
    expect(screen.getByText('Hallituksen kokous 2/2026')).toBeInTheDocument();
    expect(screen.getByText('Varsinainen yhtiökokous 2025')).toBeInTheDocument();
  });

  it('toggles document list on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingsPage />);

    const showButton = screen.getAllByText(/Näytä asiakirjat/)[0]!;
    await user.click(showButton);
    expect(screen.getByText('Kokouskutsu')).toBeInTheDocument();
    expect(screen.getByText('Tilinpäätös 2025')).toBeInTheDocument();
  });
});
