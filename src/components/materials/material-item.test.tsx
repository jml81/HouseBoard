import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Material } from '@/types';
import { MaterialItem } from './material-item';

const mockMaterial: Material = {
  id: 'm1',
  name: 'Järjestyssäännöt',
  category: 'saannot',
  fileType: 'pdf',
  fileSize: '245 KB',
  updatedAt: '2025-09-15',
  description: 'Taloyhtiön järjestyssäännöt.',
  createdBy: 'u2',
};

describe('MaterialItem', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    useAuthStore.setState({
      isAuthenticated: false,
      isManager: false,
      user: null,
      token: null,
    });
  });

  it('renders material details', () => {
    renderWithProviders(<MaterialItem material={mockMaterial} />);
    expect(screen.getByText('Järjestyssäännöt')).toBeInTheDocument();
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
    expect(screen.getByText(/245 KB/)).toBeInTheDocument();
  });

  it('shows edit/delete buttons for manager', async () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<MaterialItem material={mockMaterial} />);
    expect(await screen.findByLabelText('Muokkaa')).toBeInTheDocument();
    expect(screen.getByLabelText('Poista materiaali')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for resident', () => {
    setTestAuth({ isManager: false });
    renderWithProviders(<MaterialItem material={mockMaterial} />);
    expect(screen.queryByLabelText('Muokkaa')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Poista materiaali')).not.toBeInTheDocument();
  });

  it('opens edit dialog when edit button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<MaterialItem material={mockMaterial} />);

    await user.click(await screen.findByLabelText('Muokkaa'));
    expect(await screen.findByText('Muokkaa materiaalia')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('Järjestyssäännöt');
  });

  it('opens delete confirmation dialog when delete button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<MaterialItem material={mockMaterial} />);

    await user.click(await screen.findByLabelText('Poista materiaali'));
    expect(
      await screen.findByText(
        'Haluatko varmasti poistaa tämän materiaalin? Toimintoa ei voi perua.',
      ),
    ).toBeInTheDocument();
  });

  it('calls delete API when confirming deletion', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderWithProviders(<MaterialItem material={mockMaterial} />);

    await user.click(await screen.findByLabelText('Poista materiaali'));
    await screen.findByText('Haluatko varmasti poistaa tämän materiaalin? Toimintoa ei voi perua.');
    await user.click(screen.getByRole('button', { name: 'Poista' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/materials/m1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  it('renders download button', () => {
    renderWithProviders(<MaterialItem material={mockMaterial} />);
    expect(screen.getByTitle('Lataa')).toBeInTheDocument();
  });
});
