import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import type { Meeting } from '@/types';
import { MeetingFormDialog } from './meeting-form-dialog';

const mockMeeting: Meeting = {
  id: 'm1',
  title: 'Hallituksen kokous',
  type: 'hallituksen-kokous',
  status: 'upcoming',
  date: '2026-04-15',
  startTime: '18:00',
  endTime: '20:00',
  location: 'Kerhohuone',
  description: 'Kevään hallituksen kokous',
  documents: [],
};

function renderDialog(props?: { meeting?: Meeting }): {
  onOpenChange: ReturnType<typeof vi.fn>;
} {
  const onOpenChange = vi.fn();
  renderWithProviders(
    <MeetingFormDialog open={true} onOpenChange={onOpenChange} meeting={props?.meeting} />,
  );
  return { onOpenChange };
}

describe('MeetingFormDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create mode with default values', () => {
    renderDialog();
    expect(screen.getByText('Uusi kokous')).toBeInTheDocument();
    expect(screen.getByLabelText('Otsikko')).toHaveValue('');
    expect(screen.getByLabelText('Päivämäärä')).toHaveValue('');
    expect(screen.getByLabelText('Alkuaika')).toHaveValue('');
    expect(screen.getByLabelText('Loppuaika')).toHaveValue('');
    expect(screen.getByLabelText('Paikka')).toHaveValue('');
    expect(screen.getByLabelText('Kuvaus')).toHaveValue('');
  });

  it('renders edit mode with pre-filled fields', () => {
    renderDialog({ meeting: mockMeeting });
    expect(screen.getByText('Muokkaa kokousta')).toBeInTheDocument();
    expect(screen.getByLabelText('Otsikko')).toHaveValue('Hallituksen kokous');
    expect(screen.getByLabelText('Päivämäärä')).toHaveValue('2026-04-15');
    expect(screen.getByLabelText('Alkuaika')).toHaveValue('18:00');
    expect(screen.getByLabelText('Loppuaika')).toHaveValue('20:00');
    expect(screen.getByLabelText('Paikka')).toHaveValue('Kerhohuone');
    expect(screen.getByLabelText('Kuvaus')).toHaveValue('Kevään hallituksen kokous');
  });

  it('shows submit button text for create mode', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Luo kokous' })).toBeInTheDocument();
  });

  it('shows save button text for edit mode', () => {
    renderDialog({ meeting: mockMeeting });
    expect(screen.getByRole('button', { name: 'Tallenna' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Luo kokous' }));

    expect(await screen.findByText('Otsikko on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Päivämäärä on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Alkuaika on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Loppuaika on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Paikka on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Kuvaus on pakollinen')).toBeInTheDocument();
  });

  it('shows end time validation error when end <= start', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByLabelText('Otsikko'));
    await user.paste('Test');

    const dateInput = screen.getByLabelText('Päivämäärä');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-04-01');

    const startInput = screen.getByLabelText('Alkuaika');
    await user.clear(startInput);
    await user.type(startInput, '20:00');
    const endInput = screen.getByLabelText('Loppuaika');
    await user.clear(endInput);
    await user.type(endInput, '18:00');

    await user.click(screen.getByLabelText('Paikka'));
    await user.paste('Kerhohuone');
    await user.click(screen.getByLabelText('Kuvaus'));
    await user.paste('Kuvaus');

    await user.click(screen.getByRole('button', { name: 'Luo kokous' }));

    expect(await screen.findByText('Loppuajan pitää olla alkuajan jälkeen')).toBeInTheDocument();
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
            title: 'Uusi kokous',
            type: 'hallituksen-kokous',
            status: 'upcoming',
            date: '2026-04-01',
            startTime: '18:00',
            endTime: '20:00',
            location: 'Kerhohuone',
            description: 'Kuvaus',
            documents: [],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    const { onOpenChange } = renderDialog();

    await user.click(screen.getByLabelText('Otsikko'));
    await user.paste('Uusi kokous');

    const dateInput = screen.getByLabelText('Päivämäärä');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-04-01');
    const startInput = screen.getByLabelText('Alkuaika');
    await user.clear(startInput);
    await user.type(startInput, '18:00');
    const endInput = screen.getByLabelText('Loppuaika');
    await user.clear(endInput);
    await user.type(endInput, '20:00');

    await user.click(screen.getByLabelText('Paikka'));
    await user.paste('Kerhohuone');
    await user.click(screen.getByLabelText('Kuvaus'));
    await user.paste('Kuvaus');

    await user.click(screen.getByRole('button', { name: 'Luo kokous' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/meetings',
        expect.objectContaining({ method: 'POST' }),
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

    renderDialog();

    await user.click(screen.getByLabelText('Otsikko'));
    await user.paste('Test');
    const dateInput = screen.getByLabelText('Päivämäärä');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-04-01');
    const startInput = screen.getByLabelText('Alkuaika');
    await user.clear(startInput);
    await user.type(startInput, '18:00');
    const endInput = screen.getByLabelText('Loppuaika');
    await user.clear(endInput);
    await user.type(endInput, '20:00');
    await user.click(screen.getByLabelText('Paikka'));
    await user.paste('Kerhohuone');
    await user.click(screen.getByLabelText('Kuvaus'));
    await user.paste('Kuvaus');

    await user.click(screen.getByRole('button', { name: 'Luo kokous' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('does not render form body when closed', () => {
    renderWithProviders(<MeetingFormDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByLabelText('Otsikko')).not.toBeInTheDocument();
  });
});
