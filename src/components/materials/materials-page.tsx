import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import type { MaterialCategory } from '@/types';
import { useMaterials } from '@/hooks/use-materials';
import { useAuthStore } from '@/stores/auth-store';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MaterialList } from './material-list';
import { MaterialFormDialog } from './material-form-dialog';

const categories: MaterialCategory[] = ['saannot', 'kokoukset', 'talous', 'kunnossapito', 'muut'];

export function MaterialsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | null>(null);
  const { data: materials = [] } = useMaterials();
  const isManager = useAuthStore((s) => s.isManager);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = selectedCategory
    ? materials.filter((m) => m.category === selectedCategory)
    : materials;

  return (
    <div>
      <PageHeader
        titleKey="materials.title"
        descriptionKey="materials.description"
        actions={
          isManager ? (
            <Button
              className="bg-hb-accent hover:bg-hb-accent/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-1 size-4" />
              {t('materials.createNew')}
            </Button>
          ) : undefined
        }
      />

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

      <MaterialFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
