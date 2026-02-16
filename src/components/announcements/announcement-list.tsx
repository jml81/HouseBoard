import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnnouncementCategory } from '@/types';
import { announcements } from '@/data';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnnouncementCard } from './announcement-card';

const categories: AnnouncementCategory[] = ['yleinen', 'huolto', 'remontti', 'vesi-sahko'];

export function AnnouncementList(): React.JSX.Element {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | null>(null);

  const filtered = selectedCategory
    ? announcements.filter((a) => a.category === selectedCategory)
    : announcements;

  return (
    <div>
      <PageHeader titleKey="announcements.title" descriptionKey="announcements.description" />

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

        <div className="space-y-4">
          {filtered.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </div>
    </div>
  );
}
