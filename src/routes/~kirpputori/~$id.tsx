import { createFileRoute } from '@tanstack/react-router';
import { useMarketplaceItem } from '@/hooks/use-marketplace-items';
import { MarketplaceItemDetail } from '@/components/marketplace/marketplace-item-detail';
import { EmptyState } from '@/components/common/empty-state';

export const Route = createFileRoute('/kirpputori/$id')({
  component: MarketplaceItemRoute,
});

function MarketplaceItemRoute(): React.JSX.Element {
  const { id } = Route.useParams();
  const { data: item, isLoading } = useMarketplaceItem(id);

  if (isLoading) {
    return <div className="p-6" />;
  }

  if (!item) {
    return <EmptyState title="Tuotetta ei löytynyt" />;
  }

  return <MarketplaceItemDetail item={item} />;
}
