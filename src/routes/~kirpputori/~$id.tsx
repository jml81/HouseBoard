import { createFileRoute } from '@tanstack/react-router';
import { marketplaceItems } from '@/data';
import { MarketplaceItemDetail } from '@/components/marketplace/marketplace-item-detail';
import { EmptyState } from '@/components/common/empty-state';

export const Route = createFileRoute('/kirpputori/$id')({
  component: MarketplaceItemRoute,
});

function MarketplaceItemRoute(): React.JSX.Element {
  const { id } = Route.useParams();
  const item = marketplaceItems.find((i) => i.id === id);

  if (!item) {
    return <EmptyState title="Tuotetta ei löytynyt" />;
  }

  return <MarketplaceItemDetail item={item} />;
}
