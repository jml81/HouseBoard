import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useEvents } from '@/hooks/use-events';
import { useAuthStore } from '@/stores/auth-store';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EventList } from './event-list';
import { EventFormDialog } from './event-form-dialog';

export function EventsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: events = [] } = useEvents();
  const isManager = useAuthStore((s) => s.isManager);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <PageHeader
        titleKey="events.title"
        descriptionKey="events.description"
        actions={
          isManager ? (
            <Button
              className="bg-hb-accent hover:bg-hb-accent/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-1 size-4" />
              {t('events.createNew')}
            </Button>
          ) : undefined
        }
      />

      <div className="p-6">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">{t('events.upcoming')}</TabsTrigger>
            <TabsTrigger value="past">{t('events.past')}</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <EventList events={events} status="upcoming" />
          </TabsContent>

          <TabsContent value="past">
            <EventList events={events} status="past" />
          </TabsContent>
        </Tabs>
      </div>

      <EventFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
