import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { MaterialsPage } from './materials-page';

const mockMaterials = [
  {
    id: 'm1',
    name: 'Järjestyssäännöt',
    category: 'saannot',
    fileType: 'pdf',
    fileSize: '245 KB',
    updatedAt: '2025-09-15',
    description: 'Järjestyssäännöt.',
  },
  {
    id: 'm2',
    name: 'Yhtiöjärjestys',
    category: 'saannot',
    fileType: 'pdf',
    fileSize: '380 KB',
    updatedAt: '2024-03-20',
    description: 'Yhtiöjärjestys.',
  },
  {
    id: 'm3',
    name: 'Toimintakertomus 2025',
    category: 'kokoukset',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    updatedAt: '2026-02-10',
    description: 'Toimintakertomus.',
  },
  {
    id: 'm4',
    name: 'Tilinpäätös 2025',
    category: 'talous',
    fileType: 'pdf',
    fileSize: '890 KB',
    updatedAt: '2026-02-10',
    description: 'Tilinpäätös.',
  },
  {
    id: 'm5',
    name: 'Talousarvio 2026',
    category: 'talous',
    fileType: 'xlsx',
    fileSize: '156 KB',
    updatedAt: '2026-01-15',
    description: 'Talousarvio.',
  },
];

describe('MaterialsPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockMaterials), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

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

  it('renders all materials by default', async () => {
    renderWithProviders(<MaterialsPage />);
    expect(await screen.findByText('Järjestyssäännöt')).toBeInTheDocument();
    expect(screen.getByText('Yhtiöjärjestys')).toBeInTheDocument();
    expect(screen.getByText('Toimintakertomus 2025')).toBeInTheDocument();
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MaterialsPage />);

    await screen.findByText('Järjestyssäännöt');
    const buttons = screen.getAllByRole('button');
    const talousButton = buttons.find((b) => b.textContent === 'Talous');
    expect(talousButton).toBeDefined();
    await user.click(talousButton!);

    expect(screen.getByText('Tilinpäätös 2025')).toBeInTheDocument();
    expect(screen.getByText('Talousarvio 2026')).toBeInTheDocument();
    expect(screen.queryByText('Järjestyssäännöt')).not.toBeInTheDocument();
  });

  it('renders file metadata', async () => {
    renderWithProviders(<MaterialsPage />);
    await screen.findByText('Järjestyssäännöt');
    const metadataElements = screen.getAllByText(/PDF/);
    expect(metadataElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders download buttons', async () => {
    renderWithProviders(<MaterialsPage />);
    await screen.findByText('Järjestyssäännöt');
    const downloadButtons = screen.getAllByTitle('Lataa');
    expect(downloadButtons.length).toBeGreaterThanOrEqual(1);
  });
});
