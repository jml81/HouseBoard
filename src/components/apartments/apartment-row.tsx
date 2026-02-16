import { useTranslation } from 'react-i18next';
import type { Apartment } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ApartmentRowProps {
  apartment: Apartment;
}

export function ApartmentRow({ apartment }: ApartmentRowProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <div className="w-14 shrink-0">
        <p className="font-bold">{apartment.number}</p>
      </div>
      <Badge variant="outline" className="shrink-0">
        {apartment.type}
      </Badge>
      <div className="hidden min-w-0 flex-1 text-sm text-muted-foreground sm:flex sm:gap-4">
        <span>{apartment.area} m²</span>
        <span>
          {t('apartments.shares')}: {apartment.shares}
        </span>
      </div>
      <div className="min-w-0 flex-1 text-right text-sm sm:flex-none sm:text-left">
        <p className="truncate">{apartment.resident}</p>
      </div>
    </div>
  );
}
