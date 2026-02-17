import { useTranslation } from 'react-i18next';
import { useEvents } from '@/hooks/use-events';
import { PageHeader } from '@/components/common/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EventList } from './event-list';

export function EventsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: events = [] } = useEvents();

  return (
    <div>
      <PageHeader titleKey="events.title" descriptionKey="events.description" />

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
    </div>
  );
}
