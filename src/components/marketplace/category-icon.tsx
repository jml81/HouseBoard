import { Armchair, Smartphone, Shirt, Dumbbell, BookOpen, Package } from 'lucide-react';
import type { MarketplaceCategory } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<MarketplaceCategory, React.ElementType> = {
  huonekalu: Armchair,
  elektroniikka: Smartphone,
  vaatteet: Shirt,
  urheilu: Dumbbell,
  kirjat: BookOpen,
  muu: Package,
};

const CATEGORY_ICON_COLORS: Record<MarketplaceCategory, string> = {
  huonekalu: 'text-amber-600',
  elektroniikka: 'text-blue-600',
  vaatteet: 'text-pink-600',
  urheilu: 'text-green-600',
  kirjat: 'text-purple-600',
  muu: 'text-gray-600',
};

interface CategoryIconProps {
  category: MarketplaceCategory;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps): React.JSX.Element {
  const Icon = CATEGORY_ICONS[category];

  return <Icon className={cn('size-5', CATEGORY_ICON_COLORS[category], className)} />;
}
