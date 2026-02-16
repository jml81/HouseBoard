import { useTranslation } from 'react-i18next';
import type { Material } from '@/types';
import { EmptyState } from '@/components/common/empty-state';
import { MaterialItem } from './material-item';

interface MaterialListProps {
  materials: Material[];
}

export function MaterialList({ materials }: MaterialListProps): React.JSX.Element {
  const { t } = useTranslation();

  if (materials.length === 0) {
    return <EmptyState title={t('materials.noMaterials')} />;
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => (
        <MaterialItem key={material.id} material={material} />
      ))}
    </div>
  );
}
