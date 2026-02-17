import { FolderOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMaterials } from '@/hooks/use-materials';
import { formatDateShort } from '@/lib/date-utils';
import { SummaryCard } from './summary-card';

export function RecentMaterialsCard(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: materials } = useMaterials();
  const recent = [...(materials ?? [])]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);

  return (
    <SummaryCard
      icon={<FolderOpen className="size-5 text-hb-accent" />}
      titleKey="dashboard.recentMaterials"
      linkTo="/materiaalit"
    >
      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('dashboard.noMaterials')}</p>
      ) : (
        <ul className="space-y-3">
          {recent.map((material) => (
            <li key={material.id} className="text-sm">
              <p className="font-medium">{material.name}</p>
              <p className="text-muted-foreground">
                {formatDateShort(material.updatedAt)} &middot; {material.fileSize}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SummaryCard>
  );
}
