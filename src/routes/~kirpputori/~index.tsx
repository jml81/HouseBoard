import { createFileRoute } from '@tanstack/react-router';
import { MarketplaceList } from '@/components/marketplace/marketplace-list';

export const Route = createFileRoute('/kirpputori/')({
  component: MarketplaceList,
});
