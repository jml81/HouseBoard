import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils';
import { UserFormDialog } from './user-form-dialog';

function mockFetch(data: unknown): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

const mockUser = {
  id: 'u1',
  email: 'asukas@talo.fi',
  name: 'Aino Virtanen',
  apartment: 'A 12',
  role: 'resident' as const,
  status: 'active' as const,
  createdAt: '2026-01-01T00:00:00Z',
};

describe('UserFormDialog - create mode', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create form fields', () => {
    renderWithProviders(<UserFormDialog open={true} onOpenChange={vi.fn()} mode="create" />);

    expect(screen.getByText('Uusi käyttäjä')).toBeInTheDocument();
    expect(screen.getByLabelText('Nimi')).toBeInTheDocument();
    expect(screen.getByLabelText('Sähköposti')).toBeInTheDocument();
    expect(screen.getByLabelText('Huoneisto')).toBeInTheDocument();
    expect(screen.getByLabelText('Salasana')).toBeInTheDocument();
    expect(screen.getByLabelText('Vahvista salasana')).toBeInTheDocument();
  });

  it('shows password min length error', async () => {
    renderWithProviders(<UserFormDialog open={true} onOpenChange={vi.fn()} mode="create" />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Salasana'));
    await user.paste('short');

    expect(screen.getByText('Salasanan pitää olla vähintään 8 merkkiä')).toBeInTheDocument();
  });

  it('shows password mismatch error', async () => {
    renderWithProviders(<UserFormDialog open={true} onOpenChange={vi.fn()} mode="create" />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Salasana'));
    await user.paste('ValidPass123!');

    await user.click(screen.getByLabelText('Vahvista salasana'));
    await user.paste('Different!');

    expect(screen.getByText('Salasanat eivät täsmää')).toBeInTheDocument();
  });

  it('submits create form', async () => {
    const created = {
      ...mockUser,
      id: 'u-new',
      email: 'new@talo.fi',
      name: 'New User',
      apartment: 'B 1',
    };
    mockFetch(created);

    const onOpenChange = vi.fn();
    renderWithProviders(<UserFormDialog open={true} onOpenChange={onOpenChange} mode="create" />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText('Nimi'));
    await user.paste('New User');

    await user.click(screen.getByLabelText('Sähköposti'));
    await user.paste('new@talo.fi');

    await user.click(screen.getByLabelText('Huoneisto'));
    await user.paste('B 1');

    await user.click(screen.getByLabelText('Salasana'));
    await user.paste('ValidPass123!');

    await user.click(screen.getByLabelText('Vahvista salasana'));
    await user.paste('ValidPass123!');

    await user.click(screen.getByRole('button', { name: 'Luo' }));

    expect(fetch).toHaveBeenCalledWith('/api/users', expect.objectContaining({ method: 'POST' }));
  });
});

describe('UserFormDialog - edit mode', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders edit form with user data', () => {
    renderWithProviders(
      <UserFormDialog open={true} onOpenChange={vi.fn()} mode="edit" user={mockUser} />,
    );

    expect(screen.getByText('Muokkaa käyttäjää')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Aino Virtanen')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A 12')).toBeInTheDocument();
    // No email field in edit mode
    expect(screen.queryByLabelText('Sähköposti')).not.toBeInTheDocument();
    // No password fields in edit mode
    expect(screen.queryByLabelText('Salasana')).not.toBeInTheDocument();
  });

  it('submits edit form', async () => {
    const updated = { ...mockUser, name: 'Updated Name' };
    mockFetch(updated);

    const onOpenChange = vi.fn();
    renderWithProviders(
      <UserFormDialog open={true} onOpenChange={onOpenChange} mode="edit" user={mockUser} />,
    );
    const user = userEvent.setup();

    const nameInput = screen.getByDisplayValue('Aino Virtanen');
    await user.clear(nameInput);
    await user.paste('Updated Name');

    await user.click(screen.getByRole('button', { name: 'Tallenna' }));

    expect(fetch).toHaveBeenCalledWith(
      '/api/users/u1',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });
});
