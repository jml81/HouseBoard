import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import type { BoardMember } from '@/types';
import { BoardMemberFormDialog } from './board-member-form-dialog';

const mockMember: BoardMember = {
  id: 'bm1',
  name: 'Liisa Virtanen',
  role: 'puheenjohtaja',
  apartment: 'A 1',
  email: 'liisa@taloyhtiö.fi',
  phone: '040 555 1234',
  termStart: '2025-01-01',
  termEnd: '2026-12-31',
};

function renderDialog(props?: { member?: BoardMember }): {
  onOpenChange: ReturnType<typeof vi.fn>;
} {
  const onOpenChange = vi.fn();
  renderWithProviders(
    <BoardMemberFormDialog open={true} onOpenChange={onOpenChange} member={props?.member} />,
  );
  return { onOpenChange };
}

describe('BoardMemberFormDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create mode with default values', () => {
    renderDialog();
    expect(screen.getByText('Uusi hallituksen jäsen')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('');
    expect(screen.getByLabelText('Huoneisto')).toHaveValue('');
    expect(screen.getByLabelText('Sähköposti')).toHaveValue('');
    expect(screen.getByLabelText('Puhelin')).toHaveValue('');
  });

  it('renders edit mode with pre-filled fields', () => {
    renderDialog({ member: mockMember });
    expect(screen.getByText('Muokkaa jäsentä')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('Liisa Virtanen');
    expect(screen.getByLabelText('Huoneisto')).toHaveValue('A 1');
    expect(screen.getByLabelText('Sähköposti')).toHaveValue('liisa@taloyhtiö.fi');
    expect(screen.getByLabelText('Puhelin')).toHaveValue('040 555 1234');
    expect(screen.getByLabelText('Toimikausi alkaa')).toHaveValue('2025-01-01');
    expect(screen.getByLabelText('Toimikausi päättyy')).toHaveValue('2026-12-31');
  });

  it('shows submit button text for create mode', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Lisää jäsen' })).toBeInTheDocument();
  });

  it('shows save button text for edit mode', () => {
    renderDialog({ member: mockMember });
    expect(screen.getByRole('button', { name: 'Tallenna' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Lisää jäsen' }));

    expect(await screen.findByText('Nimi on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Huoneisto on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Sähköposti on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Puhelin on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Toimikauden alkupäivä on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Toimikauden loppupäivä on pakollinen')).toBeInTheDocument();
  });

  it('shows term end validation error when end <= start', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByLabelText('Nimi'));
    await user.paste('Test');
    await user.click(screen.getByLabelText('Huoneisto'));
    await user.paste('A 1');
    await user.click(screen.getByLabelText('Sähköposti'));
    await user.paste('test@test.fi');
    await user.click(screen.getByLabelText('Puhelin'));
    await user.paste('040 111 2222');

    fireEvent.change(screen.getByLabelText('Toimikausi alkaa'), {
      target: { value: '2026-12-31' },
    });
    fireEvent.change(screen.getByLabelText('Toimikausi päättyy'), {
      target: { value: '2025-01-01' },
    });

    await user.click(screen.getByRole('button', { name: 'Lisää jäsen' }));

    expect(
      await screen.findByText('Toimikauden lopun pitää olla alun jälkeen'),
    ).toBeInTheDocument();
  });

  it('calls API on valid create submission', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 'new-1',
            name: 'Uusi Jäsen',
            role: 'jasen',
            apartment: 'B 5',
            email: 'uusi@test.fi',
            phone: '040 111 2222',
            termStart: '2026-01-01',
            termEnd: '2027-12-31',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    const { onOpenChange } = renderDialog();

    await user.click(screen.getByLabelText('Nimi'));
    await user.paste('Uusi Jäsen');
    await user.click(screen.getByLabelText('Huoneisto'));
    await user.paste('B 5');
    await user.click(screen.getByLabelText('Sähköposti'));
    await user.paste('uusi@test.fi');
    await user.click(screen.getByLabelText('Puhelin'));
    await user.paste('040 111 2222');

    fireEvent.change(screen.getByLabelText('Toimikausi alkaa'), {
      target: { value: '2026-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Toimikausi päättyy'), {
      target: { value: '2027-12-31' },
    });

    await user.click(screen.getByRole('button', { name: 'Lisää jäsen' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/board-members',
        expect.objectContaining({ method: 'POST' }),
      );
    });

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('does not render form body when closed', () => {
    renderWithProviders(<BoardMemberFormDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByLabelText('Nimi')).not.toBeInTheDocument();
  });
});
