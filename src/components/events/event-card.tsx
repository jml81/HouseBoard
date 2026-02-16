import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, MapPin, User, Heart } from 'lucide-react';
import type { HousingEvent } from '@/types';
import { formatDate, formatTime } from '@/lib/date-utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: HousingEvent;
}

export function EventCard({ event }: EventCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const isPast = event.status === 'past';

  return (
    <Card className={cn('gap-3', isPast && 'opacity-60')}>
      <CardHeader>
        <CardTitle className="text-base">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {formatTime(event.startTime)}-{formatTime(event.endTime)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <User className="size-4" />
            {t('events.organizer')}: {event.organizer}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="size-4" />
            {event.interestedCount} {t('events.interested')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
