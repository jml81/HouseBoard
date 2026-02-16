import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { MaterialsPage } from './materials-page';

describe('MaterialsPage', () => {
  it('renders page header', () => {
    renderWithProviders(<MaterialsPage />);
    expect(screen.getByText('Materiaalit')).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    renderWithProviders(<MaterialsPage />);
    const buttons = screen.getAllByRole('button');
    const filterLabels = buttons.map((b) => b.textContent);
    expect(filterLabels).toContain('Kaikki');
    expect(filterLabels).toContain('Säännöt');
    expect(filterLabels).toContain('Talous');
    expect(filterLabels).toContain('Kunnossapito');
    expect(filterLabels).toContain('Muut');
  });

  it('renders all materials by default', () => {
    renderWithProviders(<MaterialsPage />);
    expect(screen.getByText('Järjestyssäännöt')).toBeInTheDocument();
    expect(screen.getByText('Yhtiöjärjestys')).toBeInTheDocument();
    expect(screen.getByText('Toimintakertomus 2025')).toBeInTheDocument();
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MaterialsPage />);

    const buttons = screen.getAllByRole('button');
    const talousButton = buttons.find((b) => b.textContent === 'Talous');
    expect(talousButton).toBeDefined();
    await user.click(talousButton!);

    expect(screen.getByText('Tilinpäätös 2025')).toBeInTheDocument();
    expect(screen.getByText('Talousarvio 2026')).toBeInTheDocument();
    expect(screen.queryByText('Järjestyssäännöt')).not.toBeInTheDocument();
  });

  it('renders file metadata', () => {
    renderWithProviders(<MaterialsPage />);
    // Verify material items show file type and size in their metadata
    const metadataElements = screen.getAllByText(/PDF/);
    expect(metadataElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders download buttons', () => {
    renderWithProviders(<MaterialsPage />);
    const downloadButtons = screen.getAllByTitle('Lataa');
    expect(downloadButtons.length).toBeGreaterThanOrEqual(1);
  });
});
