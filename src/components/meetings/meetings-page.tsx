import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useMeetings } from '@/hooks/use-meetings';
import { useAuthStore } from '@/stores/auth-store';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MeetingCard } from './meeting-card';
import { MeetingFormDialog } from './meeting-form-dialog';

export function MeetingsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: meetings = [] } = useMeetings();
  const isManager = useAuthStore((s) => s.isManager);
  const [createOpen, setCreateOpen] = useState(false);

  const upcomingMeetings = meetings.filter((m) => m.status === 'upcoming');
  const pastMeetings = meetings.filter((m) => m.status === 'completed');

  return (
    <div>
      <PageHeader
        titleKey="meetings.title"
        descriptionKey="meetings.description"
        actions={
          isManager ? (
            <Button
              className="bg-hbplus-accent hover:bg-hbplus-accent/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-1 size-4" />
              {t('meetings.createNew')}
            </Button>
          ) : undefined
        }
      />

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

      <MeetingFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
