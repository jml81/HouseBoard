export type MarketplaceCategory =
  | 'huonekalu'
  | 'elektroniikka'
  | 'vaatteet'
  | 'urheilu'
  | 'kirjat'
  | 'muu';

export type ItemCondition = 'uusi' | 'hyva' | 'kohtalainen' | 'tyydyttava';

export type ItemStatus = 'available' | 'sold' | 'reserved';

export interface MarketplaceSeller {
  name: string;
  apartment: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: MarketplaceCategory;
  condition: ItemCondition;
  status: ItemStatus;
  seller: MarketplaceSeller;
  publishedAt: string; // ISO date string
}
