import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import type { Material } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileTypeIcon } from './file-type-icon';

interface MaterialItemProps {
  material: Material;
}

export function MaterialItem({ material }: MaterialItemProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <FileTypeIcon fileType={material.fileType} className="size-8 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{material.name}</p>
          <Badge variant="outline" className="text-xs">
            {t(`categories.${material.category}`)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {material.fileType.toUpperCase()} &middot; {material.fileSize} &middot;{' '}
          {t('materials.updated')}: {formatDate(material.updatedAt)}
        </p>
      </div>
      <Button variant="ghost" size="icon" title={t('materials.download')}>
        <Download className="size-5" />
      </Button>
    </div>
  );
}
