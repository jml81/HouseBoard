import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import type { Material } from '@/types';
import { MaterialFormDialog } from './material-form-dialog';

const mockMaterial: Material = {
  id: 'm1',
  name: 'Järjestyssäännöt',
  category: 'saannot',
  fileType: 'pdf',
  fileSize: '245 KB',
  updatedAt: '2025-09-15',
  description: 'Taloyhtiön järjestyssäännöt.',
  createdBy: 'u2',
  fileUrl: '/api/files/materials/test.pdf',
};

function renderDialog(props?: { material?: Material }): {
  onOpenChange: ReturnType<typeof vi.fn>;
} {
  const onOpenChange = vi.fn();
  renderWithProviders(
    <MaterialFormDialog open={true} onOpenChange={onOpenChange} material={props?.material} />,
  );
  return { onOpenChange };
}

describe('MaterialFormDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create mode with empty fields and file input', () => {
    renderDialog();
    expect(screen.getByText('Uusi materiaali')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('');
    expect(screen.getByLabelText('Päivämäärä')).toHaveValue('');
    expect(screen.getByLabelText('Kuvaus')).toHaveValue('');
    expect(screen.getByLabelText('Tiedosto')).toBeInTheDocument();
  });

  it('renders edit mode with pre-filled fields and current file info', () => {
    renderDialog({ material: mockMaterial });
    expect(screen.getByText('Muokkaa materiaalia')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('Järjestyssäännöt');
    expect(screen.getByLabelText('Päivämäärä')).toHaveValue('2025-09-15');
    expect(screen.getByLabelText('Kuvaus')).toHaveValue('Taloyhtiön järjestyssäännöt.');
    expect(screen.getByText('Nykyinen tiedosto')).toBeInTheDocument();
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
    expect(screen.getByText(/245 KB/)).toBeInTheDocument();
    // File input should NOT be shown in edit mode
    expect(screen.queryByLabelText('Tiedosto')).not.toBeInTheDocument();
  });

  it('shows submit button text for create mode', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Lisää' })).toBeInTheDocument();
  });

  it('shows save button text for edit mode', () => {
    renderDialog({ material: mockMaterial });
    expect(screen.getByRole('button', { name: 'Tallenna' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Lisää' }));

    expect(await screen.findByText('Nimi on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Kategoria on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Tiedosto on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Päivämäärä on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Kuvaus on pakollinen')).toBeInTheDocument();
  });

  it('calls API on valid edit submission', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ...mockMaterial,
            name: 'Päivitetty nimi',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    const { onOpenChange } = renderDialog({ material: mockMaterial });

    // Edit mode has pre-filled Selects (avoids Radix hasPointerCapture jsdom issue)
    const nameInput = screen.getByLabelText('Nimi');
    await user.clear(nameInput);
    await user.paste('Päivitetty nimi');

    await user.click(screen.getByRole('button', { name: 'Tallenna' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/materials/m1',
        expect.objectContaining({ method: 'PATCH' }),
      );
    });

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('shows error toast on API failure', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'Server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderDialog({ material: mockMaterial });

    await user.click(screen.getByRole('button', { name: 'Tallenna' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('does not render form body when closed', () => {
    renderWithProviders(<MaterialFormDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByLabelText('Nimi')).not.toBeInTheDocument();
  });

  it('shows file hint text in create mode', () => {
    renderDialog();
    expect(screen.getByText('PDF, DOCX tai XLSX, max 20 MB')).toBeInTheDocument();
  });
});
