import { useTranslation } from 'react-i18next';
import type { BookingCategory } from '@/types';
import { BOOKING_CATEGORY_COLORS } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories: BookingCategory[] = ['sauna', 'pesutupa', 'kerhohuone', 'talkoot'];

interface CategoryFilterProps {
  selected: BookingCategory | null;
  onSelect: (category: BookingCategory | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect(null)}
        className={cn(selected === null && 'bg-hb-accent hover:bg-hb-accent/90')}
      >
        {t('common.all')}
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(selected === category ? null : category)}
          className={cn('gap-1.5', selected === category && 'bg-hb-accent hover:bg-hb-accent/90')}
        >
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: BOOKING_CATEGORY_COLORS[category] }}
          />
          {t(`categories.${category}`)}
        </Button>
      ))}
    </div>
  );
}
