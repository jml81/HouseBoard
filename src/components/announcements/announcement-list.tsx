import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import type { AnnouncementCategory } from '@/types';
import { useAnnouncements } from '@/hooks/use-announcements';
import { useAuthStore } from '@/stores/auth-store';
import { PageHeader } from '@/components/common/page-header';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnnouncementCard } from './announcement-card';
import { AnnouncementFormDialog } from './announcement-form-dialog';

const categories: AnnouncementCategory[] = ['yleinen', 'huolto', 'remontti', 'vesi-sahko'];

export function AnnouncementList(): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | undefined>(
    undefined,
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: announcements, isLoading, error } = useAnnouncements(selectedCategory);

  return (
    <div>
      <PageHeader
        titleKey="announcements.title"
        descriptionKey="announcements.description"
        actions={
          isManager ? (
            <Button
              size="sm"
              className="gap-1 bg-hb-accent hover:bg-hb-accent/90"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="size-4" />
              {t('announcements.createNew')}
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === undefined ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(undefined)}
            className={cn(selectedCategory === undefined && 'bg-hb-accent hover:bg-hb-accent/90')}
          >
            {t('common.all')}
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setSelectedCategory(selectedCategory === category ? undefined : category)
              }
              className={cn(selectedCategory === category && 'bg-hb-accent hover:bg-hb-accent/90')}
            >
              {t(`categories.${category}`)}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : error ? (
          <p className="py-12 text-center text-sm text-destructive">{t('common.error')}</p>
        ) : (
          <div className="space-y-4">
            {announcements?.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}
      </div>

      <AnnouncementFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
