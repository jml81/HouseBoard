import { useTranslation } from 'react-i18next';
import type { AnnouncementCategory } from '@/types';
import { Badge } from '@/components/ui/badge';

const CATEGORY_COLORS: Record<AnnouncementCategory, string> = {
  yleinen: 'bg-gray-100 text-gray-700',
  huolto: 'bg-amber-100 text-amber-700',
  remontti: 'bg-orange-100 text-orange-700',
  'vesi-sahko': 'bg-blue-100 text-blue-700',
};

interface CategoryBadgeProps {
  category: AnnouncementCategory;
}

export function AnnouncementCategoryBadge({ category }: CategoryBadgeProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Badge variant="outline" className={CATEGORY_COLORS[category]}>
      {t(`categories.${category}`)}
    </Badge>
  );
}
