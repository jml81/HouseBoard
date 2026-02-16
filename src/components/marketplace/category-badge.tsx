import { useTranslation } from 'react-i18next';
import type { MarketplaceCategory } from '@/types';
import { Badge } from '@/components/ui/badge';

const CATEGORY_COLORS: Record<MarketplaceCategory, string> = {
  huonekalu: 'bg-amber-100 text-amber-700',
  elektroniikka: 'bg-blue-100 text-blue-700',
  vaatteet: 'bg-pink-100 text-pink-700',
  urheilu: 'bg-green-100 text-green-700',
  kirjat: 'bg-purple-100 text-purple-700',
  muu: 'bg-gray-100 text-gray-700',
};

interface MarketplaceCategoryBadgeProps {
  category: MarketplaceCategory;
}

export function MarketplaceCategoryBadge({
  category,
}: MarketplaceCategoryBadgeProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Badge variant="outline" className={CATEGORY_COLORS[category]}>
      {t(`marketplaceCategories.${category}`)}
    </Badge>
  );
}
