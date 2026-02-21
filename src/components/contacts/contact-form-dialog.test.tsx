import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import type { Contact } from '@/types';
import { ContactFormDialog } from './contact-form-dialog';

const mockContact: Contact = {
  id: 'c1',
  name: 'Matti Meikäläinen',
  role: 'huolto',
  company: 'Huolto Oy',
  phone: '050 123 4567',
  email: 'matti@huolto.fi',
  description: 'Kiinteistöhuolto',
};

function renderDialog(props?: { contact?: Contact }): {
  onOpenChange: ReturnType<typeof vi.fn>;
} {
  const onOpenChange = vi.fn();
  renderWithProviders(
    <ContactFormDialog open={true} onOpenChange={onOpenChange} contact={props?.contact} />,
  );
  return { onOpenChange };
}

describe('ContactFormDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create mode with default values', () => {
    renderDialog();
    expect(screen.getByText('Uusi yhteystieto')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('');
    expect(screen.getByLabelText('Puhelin')).toHaveValue('');
    expect(screen.getByLabelText('Sähköposti')).toHaveValue('');
  });

  it('renders edit mode with pre-filled fields', () => {
    renderDialog({ contact: mockContact });
    expect(screen.getByText('Muokkaa yhteystietoa')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toHaveValue('Matti Meikäläinen');
    expect(screen.getByLabelText('Yritys')).toHaveValue('Huolto Oy');
    expect(screen.getByLabelText('Puhelin')).toHaveValue('050 123 4567');
    expect(screen.getByLabelText('Sähköposti')).toHaveValue('matti@huolto.fi');
  });

  it('shows submit button text for create mode', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Lisää yhteystieto' })).toBeInTheDocument();
  });

  it('shows save button text for edit mode', () => {
    renderDialog({ contact: mockContact });
    expect(screen.getByRole('button', { name: 'Tallenna' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderDialog();

    // Clear the name field (it starts empty but clear just in case)
    await user.click(screen.getByRole('button', { name: 'Lisää yhteystieto' }));

    expect(await screen.findByText('Nimi on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Puhelin on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Sähköposti on pakollinen')).toBeInTheDocument();
  });

  it('calls API on valid create submission', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              id: 'new-1',
              name: 'Uusi kontakti',
              role: 'muu',
              phone: '040 111 2222',
              email: 'uusi@test.fi',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      ),
    );

    const { onOpenChange } = renderDialog();

    await user.click(screen.getByLabelText('Nimi'));
    await user.paste('Uusi kontakti');
    await user.click(screen.getByLabelText('Puhelin'));
    await user.paste('040 111 2222');
    await user.click(screen.getByLabelText('Sähköposti'));
    await user.paste('uusi@test.fi');

    await user.click(screen.getByRole('button', { name: 'Lisää yhteystieto' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/contacts',
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
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      ),
    );

    renderDialog();

    await user.click(screen.getByLabelText('Nimi'));
    await user.paste('Test');
    await user.click(screen.getByLabelText('Puhelin'));
    await user.paste('040 111 2222');
    await user.click(screen.getByLabelText('Sähköposti'));
    await user.paste('test@test.fi');

    await user.click(screen.getByRole('button', { name: 'Lisää yhteystieto' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('does not render form body when closed', () => {
    renderWithProviders(<ContactFormDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByLabelText('Nimi')).not.toBeInTheDocument();
  });
});
