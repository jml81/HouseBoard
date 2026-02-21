import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterContext, setTestAuth } from '@/test-utils';
import type { MarketplaceItem } from '@/types';
import { MarketplaceItemDetail } from './marketplace-item-detail';

const mockItem: MarketplaceItem = {
  id: 'test-1',
  title: 'Testituote',
  description: 'Tämä on yksityiskohtainen kuvaus testituotteelle.',
  price: 50,
  category: 'elektroniikka',
  condition: 'hyva',
  status: 'available',
  seller: { name: 'Testi', apartment: 'B 5' },
  publishedAt: '2026-02-12',
  createdBy: 'other-user',
  imageUrl: null,
};

const freeItem: MarketplaceItem = {
  ...mockItem,
  id: 'test-2',
  price: 0,
};

// Item owned by the default auth user (u1)
const ownedItem: MarketplaceItem = {
  ...mockItem,
  id: 'test-3',
  seller: { name: 'Aino', apartment: 'A 12' },
  createdBy: 'u1',
};

const soldItem: MarketplaceItem = {
  ...ownedItem,
  id: 'test-4',
  status: 'sold',
};

const reservedItem: MarketplaceItem = {
  ...ownedItem,
  id: 'test-5',
  status: 'reserved',
};

function mockFetch(): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

describe('MarketplaceItemDetail', () => {
  beforeEach(() => {
    mockFetch();
    // Reset auth store to default (non-manager)
    setTestAuth();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders item title', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.getByText('Testituote')).toBeInTheDocument();
  });

  it('renders back link', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.getByText('Takaisin kirpputorille')).toBeInTheDocument();
  });

  it('renders price', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.getByText('50 €')).toBeInTheDocument();
  });

  it('renders free label when price is 0', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={freeItem} />);
    expect(screen.getByText('Ilmainen')).toBeInTheDocument();
  });

  it('renders category and condition badges', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.getByText('Elektroniikka')).toBeInTheDocument();
    expect(screen.getByText('Hyvä')).toBeInTheDocument();
  });

  it('renders seller info', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.getByText(/Myyjä.*Testi/)).toBeInTheDocument();
    expect(screen.getByText(/B 5/)).toBeInTheDocument();
  });

  it('renders full description', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(
      screen.getByText('Tämä on yksityiskohtainen kuvaus testituotteelle.'),
    ).toBeInTheDocument();
  });

  it('renders contact button for non-owner', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.getByText('Ota yhteyttä')).toBeInTheDocument();
  });

  it('does not show status or delete buttons for non-owner', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.queryByText('Merkitse myydyksi')).not.toBeInTheDocument();
    expect(screen.queryByText('Poista tuote')).not.toBeInTheDocument();
  });

  it('shows status and delete buttons for item owner', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={ownedItem} />);
    expect(screen.getByText('Merkitse myydyksi')).toBeInTheDocument();
    expect(screen.getByText('Merkitse varatuksi')).toBeInTheDocument();
    expect(screen.getByText('Poista tuote')).toBeInTheDocument();
  });

  it('shows status and delete buttons for manager', async () => {
    setTestAuth({ isManager: true });
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.getByText('Merkitse myydyksi')).toBeInTheDocument();
    expect(screen.getByText('Poista tuote')).toBeInTheDocument();
  });

  it('shows mark available for sold item', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={soldItem} />);
    expect(screen.getByText('Merkitse myyntiin')).toBeInTheDocument();
    expect(screen.queryByText('Merkitse myydyksi')).not.toBeInTheDocument();
  });

  it('shows mark sold and mark available for reserved item', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={reservedItem} />);
    expect(screen.getByText('Merkitse myydyksi')).toBeInTheDocument();
    expect(screen.getByText('Merkitse myyntiin')).toBeInTheDocument();
    expect(screen.queryByText('Merkitse varatuksi')).not.toBeInTheDocument();
  });

  it('calls API when status button is clicked', async () => {
    const user = userEvent.setup();
    // Mock returns updated item
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ...ownedItem, status: 'sold' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    await renderWithRouterContext(<MarketplaceItemDetail item={ownedItem} />);
    await user.click(screen.getByText('Merkitse myydyksi'));

    await waitFor(() => {
      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
      const patchCall = calls.find(
        (call: unknown[]) => (call[1] as RequestInit | undefined)?.method === 'PATCH',
      );
      expect(patchCall).toBeDefined();
    });
  });

  it('opens delete confirmation dialog', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceItemDetail item={ownedItem} />);

    await user.click(screen.getByText('Poista tuote'));

    expect(
      screen.getByText('Haluatko varmasti poistaa tämän tuotteen? Toimintoa ei voi perua.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Peruuta')).toBeInTheDocument();
    expect(screen.getByText('Poista')).toBeInTheDocument();
  });

  it('cancels delete when cancel is clicked', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceItemDetail item={ownedItem} />);

    await user.click(screen.getByText('Poista tuote'));
    await user.click(screen.getByText('Peruuta'));

    expect(
      screen.queryByText('Haluatko varmasti poistaa tämän tuotteen? Toimintoa ei voi perua.'),
    ).not.toBeInTheDocument();
  });

  it('renders large image when imageUrl is present', async () => {
    const itemWithImage = { ...mockItem, imageUrl: '/api/files/marketplace/test.jpg' };
    await renderWithRouterContext(<MarketplaceItemDetail item={itemWithImage} />);
    const img = screen.getByAltText('Testituote');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/api/files/marketplace/test.jpg');
  });

  it('renders category icon fallback when no image', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.queryByAltText('Testituote')).not.toBeInTheDocument();
  });
});
