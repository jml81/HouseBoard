import { useTranslation } from 'react-i18next';
import { meetings } from '@/data';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MeetingCard } from './meeting-card';

export function MeetingsPage(): React.JSX.Element {
  const { t } = useTranslation();

  const upcomingMeetings = meetings.filter((m) => m.status === 'upcoming');
  const pastMeetings = meetings.filter((m) => m.status === 'completed');

  return (
    <div>
      <PageHeader titleKey="meetings.title" descriptionKey="meetings.description" />

      <div className="p-6">
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">{t('meetings.upcoming')}</TabsTrigger>
            <TabsTrigger value="past">{t('meetings.past')}</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingMeetings.length === 0 ? (
              <EmptyState title={t('meetings.noUpcoming')} />
            ) : (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastMeetings.length === 0 ? (
              <EmptyState title={t('meetings.noPast')} />
            ) : (
              <div className="space-y-4">
                {pastMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
