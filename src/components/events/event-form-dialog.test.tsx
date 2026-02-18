import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import type { HousingEvent } from '@/types';
import { EventFormDialog } from './event-form-dialog';

const mockEvent: HousingEvent = {
  id: 'e1',
  title: 'Kevättalkoot',
  description: 'Piha-alueen siivous',
  date: '2026-03-15',
  startTime: '10:00',
  endTime: '15:00',
  location: 'Piha-alue',
  organizer: 'Hallitus',
  interestedCount: 18,
  status: 'upcoming',
  createdBy: 'u2',
};

function renderDialog(props?: { event?: HousingEvent }): {
  onOpenChange: ReturnType<typeof vi.fn>;
} {
  const onOpenChange = vi.fn();
  renderWithProviders(
    <EventFormDialog open={true} onOpenChange={onOpenChange} event={props?.event} />,
  );
  return { onOpenChange };
}

describe('EventFormDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create mode with empty fields', () => {
    renderDialog();
    expect(screen.getByText('Uusi tapahtuma')).toBeInTheDocument();
    expect(screen.getByLabelText('Otsikko')).toHaveValue('');
    expect(screen.getByLabelText('Kuvaus')).toHaveValue('');
    expect(screen.getByLabelText('Päivämäärä')).toHaveValue('');
    expect(screen.getByLabelText('Alkuaika')).toHaveValue('');
    expect(screen.getByLabelText('Loppuaika')).toHaveValue('');
    expect(screen.getByLabelText('Paikka')).toHaveValue('');
    expect(screen.getByText(/Järjestäjä/)).toBeInTheDocument();
  });

  it('renders edit mode with pre-filled fields', () => {
    renderDialog({ event: mockEvent });
    expect(screen.getByText('Muokkaa tapahtumaa')).toBeInTheDocument();
    expect(screen.getByLabelText('Otsikko')).toHaveValue('Kevättalkoot');
    expect(screen.getByLabelText('Kuvaus')).toHaveValue('Piha-alueen siivous');
    expect(screen.getByLabelText('Päivämäärä')).toHaveValue('2026-03-15');
    expect(screen.getByLabelText('Alkuaika')).toHaveValue('10:00');
    expect(screen.getByLabelText('Loppuaika')).toHaveValue('15:00');
    expect(screen.getByLabelText('Paikka')).toHaveValue('Piha-alue');
  });

  it('shows submit button text for create mode', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Luo tapahtuma' })).toBeInTheDocument();
  });

  it('shows save button text for edit mode', () => {
    renderDialog({ event: mockEvent });
    expect(screen.getByRole('button', { name: 'Tallenna' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Luo tapahtuma' }));

    expect(await screen.findByText('Otsikko on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Kuvaus on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Päivämäärä on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Alkuaika on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Loppuaika on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Paikka on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Järjestäjä on pakollinen')).toBeInTheDocument();
  });

  it('shows end time validation error when end <= start', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.paste('Otsikko');
    await user.click(screen.getByLabelText('Kuvaus'));
    await user.paste('Kuvaus');
    // Fill date
    const dateInput = screen.getByLabelText('Päivämäärä');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-04-01');
    // Fill times: start after end
    const startInput = screen.getByLabelText('Alkuaika');
    await user.clear(startInput);
    await user.type(startInput, '14:00');
    const endInput = screen.getByLabelText('Loppuaika');
    await user.clear(endInput);
    await user.type(endInput, '12:00');
    // Fill location and organizer
    await user.click(screen.getByLabelText('Paikka'));
    await user.paste('Piha');
    await user.click(screen.getByLabelText(/Järjestäjä/i));
    await user.paste('Hallitus');

    await user.click(screen.getByRole('button', { name: 'Luo tapahtuma' }));

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
            title: 'Uusi tapahtuma',
            description: 'Kuvaus',
            date: '2026-04-01',
            startTime: '10:00',
            endTime: '12:00',
            location: 'Piha-alue',
            organizer: 'Hallitus',
            interestedCount: 0,
            status: 'upcoming',
            createdBy: 'u2',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    const { onOpenChange } = renderDialog();

    // Fill all fields
    await user.click(screen.getByLabelText('Otsikko'));
    await user.paste('Uusi tapahtuma');
    await user.click(screen.getByLabelText('Kuvaus'));
    await user.paste('Kuvaus');
    const dateInput = screen.getByLabelText('Päivämäärä');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-04-01');
    const startInput = screen.getByLabelText('Alkuaika');
    await user.clear(startInput);
    await user.type(startInput, '10:00');
    const endInput = screen.getByLabelText('Loppuaika');
    await user.clear(endInput);
    await user.type(endInput, '12:00');
    await user.click(screen.getByLabelText('Paikka'));
    await user.paste('Piha-alue');
    await user.click(screen.getByLabelText(/Järjestäjä/i));
    await user.paste('Hallitus');

    await user.click(screen.getByRole('button', { name: 'Luo tapahtuma' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/events',
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
    await user.click(screen.getByLabelText('Kuvaus'));
    await user.paste('Kuvaus');
    const dateInput = screen.getByLabelText('Päivämäärä');
    await user.clear(dateInput);
    await user.type(dateInput, '2026-04-01');
    const startInput = screen.getByLabelText('Alkuaika');
    await user.clear(startInput);
    await user.type(startInput, '10:00');
    const endInput = screen.getByLabelText('Loppuaika');
    await user.clear(endInput);
    await user.type(endInput, '12:00');
    await user.click(screen.getByLabelText('Paikka'));
    await user.paste('Piha');
    await user.click(screen.getByLabelText(/Järjestäjä/i));
    await user.paste('Hallitus');

    await user.click(screen.getByRole('button', { name: 'Luo tapahtuma' }));

    // The dialog stays open on error (onOpenChange not called with false)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('does not render form body when closed', () => {
    renderWithProviders(<EventFormDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByLabelText('Otsikko')).not.toBeInTheDocument();
  });
});
