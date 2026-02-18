import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouterContext } from '@/test-utils';
import type { MarketplaceItem } from '@/types';
import { MarketplaceItemCard } from './marketplace-item-card';

const mockItem: MarketplaceItem = {
  id: 'test-1',
  title: 'Testituote',
  description: 'Tämä on testikuvaus tuotteelle.',
  price: 25,
  category: 'huonekalu',
  condition: 'hyva',
  status: 'available',
  seller: { name: 'Testi Myyjä', apartment: 'A 1' },
  publishedAt: '2026-02-10',
  createdBy: null,
};

const freeItem: MarketplaceItem = {
  ...mockItem,
  id: 'test-2',
  title: 'Ilmainen tuote',
  price: 0,
};

const soldItem: MarketplaceItem = {
  ...mockItem,
  id: 'test-3',
  title: 'Myyty tuote',
  status: 'sold',
};

const reservedItem: MarketplaceItem = {
  ...mockItem,
  id: 'test-4',
  title: 'Varattu tuote',
  status: 'reserved',
};

describe('MarketplaceItemCard', () => {
  it('renders item title', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={mockItem} />);
    expect(screen.getByText('Testituote')).toBeInTheDocument();
  });

  it('renders price', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={mockItem} />);
    expect(screen.getByText('25 €')).toBeInTheDocument();
  });

  it('renders free label when price is 0', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={freeItem} />);
    expect(screen.getByText('Ilmainen')).toBeInTheDocument();
  });

  it('renders category badge', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={mockItem} />);
    expect(screen.getByText('Huonekalu')).toBeInTheDocument();
  });

  it('renders condition badge', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={mockItem} />);
    expect(screen.getByText('Hyvä')).toBeInTheDocument();
  });

  it('renders seller name', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={mockItem} />);
    expect(screen.getByText('Testi Myyjä')).toBeInTheDocument();
  });

  it('renders formatted date', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={mockItem} />);
    expect(screen.getByText(/10\.2\.2026/)).toBeInTheDocument();
  });

  it('shows sold status badge', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={soldItem} />);
    expect(screen.getByText('Myyty')).toBeInTheDocument();
  });

  it('shows reserved status badge', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={reservedItem} />);
    expect(screen.getByText('Varattu')).toBeInTheDocument();
  });

  it('does not show status badge for available items', async () => {
    await renderWithRouterContext(<MarketplaceItemCard item={mockItem} />);
    expect(screen.queryByText('Myynnissä')).not.toBeInTheDocument();
  });
});
