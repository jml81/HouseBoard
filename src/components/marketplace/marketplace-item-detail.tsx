import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CalendarDays, User, Home, MessageCircle } from 'lucide-react';
import type { MarketplaceItem } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MarketplaceCategoryBadge } from './category-badge';
import { CategoryIcon } from './category-icon';

interface MarketplaceItemDetailProps {
  item: MarketplaceItem;
}

export function MarketplaceItemDetail({ item }: MarketplaceItemDetailProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <Button variant="ghost" size="sm" className="mb-4 gap-1" asChild>
        <Link to="/kirpputori">
          <ArrowLeft className="size-4" />
          {t('marketplace.backToList')}
        </Link>
      </Button>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted">
            <CategoryIcon category={item.category} className="size-8" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-hb-primary">{item.title}</h1>
            <div className="mt-1 text-2xl font-bold text-hb-accent">
              {item.price === 0 ? t('marketplace.free') : `${item.price} €`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MarketplaceCategoryBadge category={item.category} />
          <Badge variant="outline">{t(`itemConditions.${item.condition}`)}</Badge>
          {item.status !== 'available' && (
            <Badge variant={item.status === 'sold' ? 'destructive' : 'secondary'}>
              {t(`itemStatuses.${item.status}`)}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4" />
            {t('marketplace.publishedAt')}: {formatDate(item.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <User className="size-4" />
            {t('marketplace.seller')}: {item.seller.name}
          </span>
          <span className="flex items-center gap-1">
            <Home className="size-4" />
            {t('marketplace.apartment')}: {item.seller.apartment}
          </span>
        </div>

        <Separator />

        <div className="whitespace-pre-line text-sm leading-relaxed">{item.description}</div>

        <Button className="gap-2 bg-hb-accent hover:bg-hb-accent/90">
          <MessageCircle className="size-4" />
          {t('marketplace.contact')}
        </Button>
      </div>
    </div>
  );
}
