import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouterContext } from '@/test-utils';
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
  seller: { name: 'Testi Myyjä', apartment: 'B 5' },
  publishedAt: '2026-02-12',
};

const freeItem: MarketplaceItem = {
  ...mockItem,
  id: 'test-2',
  price: 0,
};

describe('MarketplaceItemDetail', () => {
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
    expect(screen.getByText(/Testi Myyjä/)).toBeInTheDocument();
    expect(screen.getByText(/B 5/)).toBeInTheDocument();
  });

  it('renders full description', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(
      screen.getByText('Tämä on yksityiskohtainen kuvaus testituotteelle.'),
    ).toBeInTheDocument();
  });

  it('renders contact button', async () => {
    await renderWithRouterContext(<MarketplaceItemDetail item={mockItem} />);
    expect(screen.getByText('Ota yhteyttä')).toBeInTheDocument();
  });
});
