import { screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithRouter, setTestAuth } from '@/test-utils';

describe('Sidebar', () => {
  beforeEach(() => {
    setTestAuth();
  });

  it('renders HouseBoard navigation links', async () => {
    renderWithRouter('/kalenteri');

    // Wait for render and get the desktop sidebar (hidden on mobile with md:flex)
    await waitFor(() => {
      expect(screen.getAllByText('Kalenteri').length).toBeGreaterThanOrEqual(1);
    });

    const sidebar = screen.getByRole('complementary');
    expect(within(sidebar).getByText('Kalenteri')).toBeInTheDocument();
    expect(within(sidebar).getByText('Tiedotteet')).toBeInTheDocument();
    expect(within(sidebar).getByText('Tapahtumat')).toBeInTheDocument();
    expect(within(sidebar).getByText('Materiaalit')).toBeInTheDocument();
    expect(within(sidebar).getByText('Kirpputori')).toBeInTheDocument();
  });

  it('hides HouseBoard+ when not manager', async () => {
    renderWithRouter('/kalenteri');

    await waitFor(() => {
      expect(screen.getByRole('complementary')).toBeInTheDocument();
    });

    const sidebar = screen.getByRole('complementary');
    expect(within(sidebar).queryByText('HouseBoard+')).not.toBeInTheDocument();
    expect(within(sidebar).queryByText('Kokoukset')).not.toBeInTheDocument();
  });

  it('renders HouseBoard+ navigation links when manager', async () => {
    setTestAuth({ isManager: true });
    renderWithRouter('/kalenteri');

    await waitFor(() => {
      expect(screen.getByRole('complementary')).toBeInTheDocument();
    });

    const sidebar = screen.getByRole('complementary');
    expect(within(sidebar).getByText('Kokoukset')).toBeInTheDocument();
    expect(within(sidebar).getByText('Hallitus')).toBeInTheDocument();
    expect(within(sidebar).getByText('Huoneistot')).toBeInTheDocument();
    expect(within(sidebar).getByText('Yhteystiedot')).toBeInTheDocument();
  });

  it('renders section headers when manager', async () => {
    setTestAuth({ isManager: true });
    renderWithRouter('/kalenteri');

    await waitFor(() => {
      expect(screen.getByRole('complementary')).toBeInTheDocument();
    });

    const sidebar = screen.getByRole('complementary');
    expect(within(sidebar).getByText('HouseBoard')).toBeInTheDocument();
    expect(within(sidebar).getByText('HouseBoard+')).toBeInTheDocument();
  });
});
