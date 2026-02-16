import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { MarketplaceItem } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketplaceCategoryBadge } from './category-badge';
import { CategoryIcon } from './category-icon';

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
}

export function MarketplaceItemCard({ item }: MarketplaceItemCardProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <CategoryIcon category={item.category} className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <Link to="/kirpputori/$id" params={{ id: item.id }} className="hover:text-hb-accent">
              {item.title}
            </Link>
            <div className="mt-1 text-lg font-bold text-hb-accent">
              {item.price === 0 ? t('marketplace.free') : `${item.price} €`}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <MarketplaceCategoryBadge category={item.category} />
          <Badge variant="outline">{t(`itemConditions.${item.condition}`)}</Badge>
          {item.status !== 'available' && (
            <Badge variant={item.status === 'sold' ? 'destructive' : 'secondary'}>
              {t(`itemStatuses.${item.status}`)}
            </Badge>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{item.seller.name}</span>
          <span>&middot;</span>
          <span>{formatDate(item.publishedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
