import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, MapPin, User, Heart, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { HousingEvent } from '@/types';
import { formatDate, formatTime } from '@/lib/date-utils';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteEvent } from '@/hooks/use-events';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { EventFormDialog } from './event-form-dialog';

interface EventCardProps {
  event: HousingEvent;
}

export function EventCard({ event }: EventCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const deleteEvent = useDeleteEvent();
  const isPast = event.status === 'past';

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    try {
      await deleteEvent.mutateAsync(event.id);
      toast.success(t('events.deleteSuccess'));
    } catch {
      toast.error(t('events.deleteError'));
    }
    setDeleteOpen(false);
  }

  return (
    <>
      <Card className={cn('gap-3', isPast && 'opacity-60')}>
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle className="text-base">{event.title}</CardTitle>
          {isManager && !isPast && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setEditOpen(true)}
                aria-label={t('events.editEvent')}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                onClick={() => setDeleteOpen(true)}
                aria-label={t('events.deleteEvent')}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
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

      <EventFormDialog open={editOpen} onOpenChange={setEditOpen} event={event} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('events.deleteEvent')}</AlertDialogTitle>
            <AlertDialogDescription>{t('events.deleteConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                void handleDelete();
              }}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
