import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import { UsersPage } from './users-page';

const mockUsers = [
  {
    id: 'u1',
    email: 'asukas@talo.fi',
    name: 'Aino Virtanen',
    apartment: 'A 12',
    role: 'resident',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'u2',
    email: 'isannoitsija@talo.fi',
    name: 'Mikko Lahtinen',
    apartment: 'A 4',
    role: 'manager',
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'u3',
    email: 'locked@talo.fi',
    name: 'Locked User',
    apartment: 'B 1',
    role: 'resident',
    status: 'locked',
    createdAt: '2026-02-01T00:00:00Z',
  },
];

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

describe('UsersPage', () => {
  beforeEach(() => {
    setTestAuth({ isManager: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders user list', async () => {
    mockFetch(mockUsers);

    renderWithProviders(<UsersPage />);

    await waitFor(() => {
      // Both mobile card + desktop table layouts render in jsdom (no CSS media queries)
      expect(screen.getAllByText('Aino Virtanen').length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByText('Mikko Lahtinen').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Locked User').length).toBeGreaterThanOrEqual(1);
  });

  it('renders role badges', async () => {
    mockFetch(mockUsers);

    renderWithProviders(<UsersPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Aino Virtanen').length).toBeGreaterThanOrEqual(1);
    });

    // 2 residents x 2 layouts (mobile+desktop) = 4, 1 manager x 2 = 2
    expect(screen.getAllByText('Asukas').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Isännöitsijä').length).toBeGreaterThanOrEqual(1);
  });

  it('renders status badges', async () => {
    mockFetch(mockUsers);

    renderWithProviders(<UsersPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Locked User').length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getAllByText('Aktiivinen').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Lukittu').length).toBeGreaterThanOrEqual(1);
  });

  it('has create user button', async () => {
    mockFetch(mockUsers);

    renderWithProviders(<UsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Uusi käyttäjä')).toBeInTheDocument();
    });
  });

  it('opens create dialog when button clicked', async () => {
    mockFetch(mockUsers);

    renderWithProviders(<UsersPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Uusi käyttäjä')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Uusi käyttäjä'));

    expect(screen.getByText('Luo uusi käyttäjätili')).toBeInTheDocument();
  });

  it('opens delete confirmation dialog', async () => {
    mockFetch(mockUsers);

    renderWithProviders(<UsersPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getAllByText('Aino Virtanen').length).toBeGreaterThanOrEqual(1);
    });

    // Both mobile + desktop layouts have delete buttons; pick the first enabled one (Aino)
    const deleteButtons = screen.getAllByLabelText('Poista käyttäjä');
    await user.click(deleteButtons[0]!);

    expect(screen.getByText('Haluatko varmasti poistaa tämän käyttäjän?')).toBeInTheDocument();
  });
});
