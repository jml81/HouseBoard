import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MaterialCategory } from '@/types';
import { materials } from '@/data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MaterialList } from './material-list';

const categories: MaterialCategory[] = ['saannot', 'kokoukset', 'talous', 'kunnossapito', 'muut'];

export function MaterialsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | null>(null);

  const filtered = selectedCategory
    ? materials.filter((m) => m.category === selectedCategory)
    : materials;

  return (
    <div>
      <PageHeader titleKey="materials.title" descriptionKey="materials.description" />

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={cn(selectedCategory === null && 'bg-hb-accent hover:bg-hb-accent/90')}
          >
            {t('common.all')}
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={cn(selectedCategory === category && 'bg-hb-accent hover:bg-hb-accent/90')}
            >
              {t(`categories.${category}`)}
            </Button>
          ))}
        </div>

        <MaterialList materials={filtered} />
      </div>
    </div>
  );
}
