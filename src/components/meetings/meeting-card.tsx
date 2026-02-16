import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import type { Meeting } from '@/types';
import { formatDate, formatTime } from '@/lib/date-utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MeetingDocumentList } from './meeting-document-list';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const [showDocuments, setShowDocuments] = useState(false);
  const isCompleted = meeting.status === 'completed';

  return (
    <Card className={cn('gap-3', isCompleted && 'opacity-60')}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{meeting.title}</CardTitle>
          <Badge variant="outline" className="bg-hbplus-accent-light text-hbplus-accent">
            {t(`meetingTypes.${meeting.type}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{meeting.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4" />
            {formatDate(meeting.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {formatTime(meeting.startTime)}-{formatTime(meeting.endTime)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {meeting.location}
          </span>
        </div>

        {meeting.documents.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocuments(!showDocuments)}
              className="gap-1 px-0 text-hbplus-accent hover:text-hbplus-accent/80"
            >
              {showDocuments ? (
                <>
                  <ChevronUp className="size-4" />
                  {t('meetings.hideDocuments')}
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  {t('meetings.showDocuments')} ({meeting.documents.length})
                </>
              )}
            </Button>
            {showDocuments && (
              <div className="mt-2">
                <MeetingDocumentList documents={meeting.documents} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
