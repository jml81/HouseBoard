import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, MapPin, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Meeting } from '@/types';
import { formatDate, formatTime } from '@/lib/date-utils';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteMeeting } from '@/hooks/use-meetings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { MeetingDocumentList } from './meeting-document-list';
import { MeetingFormDialog } from './meeting-form-dialog';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const deleteMeeting = useDeleteMeeting();
  const [showDocuments, setShowDocuments] = useState(false);
  const isCompleted = meeting.status === 'completed';

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    try {
      await deleteMeeting.mutateAsync(meeting.id);
      toast.success(t('meetings.deleteSuccess'));
    } catch {
      toast.error(t('meetings.deleteError'));
    }
    setDeleteOpen(false);
  }

  return (
    <>
      <Card className={cn('gap-3', isCompleted && 'opacity-60')}>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{meeting.title}</CardTitle>
            <Badge variant="outline" className="bg-hbplus-accent-light text-hbplus-accent">
              {t(`meetingTypes.${meeting.type}`)}
            </Badge>
          </div>
          {isManager && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setEditOpen(true)}
                aria-label={t('meetings.editMeeting')}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                onClick={() => setDeleteOpen(true)}
                aria-label={t('meetings.deleteMeeting')}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
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

      <MeetingFormDialog open={editOpen} onOpenChange={setEditOpen} meeting={meeting} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('meetings.deleteMeeting')}</AlertDialogTitle>
            <AlertDialogDescription>{t('meetings.deleteConfirm')}</AlertDialogDescription>
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
