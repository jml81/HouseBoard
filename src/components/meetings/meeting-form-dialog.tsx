import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { Meeting, MeetingType, MeetingStatus } from '@/types';
import { useCreateMeeting, useUpdateMeeting, useUploadMeetingDocument } from '@/hooks/use-meetings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MEETING_TYPES: MeetingType[] = [
  'yhtiokokous',
  'ylimaarainen-yhtiokokous',
  'hallituksen-kokous',
];

const MEETING_STATUSES: MeetingStatus[] = ['upcoming', 'completed'];

interface MeetingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: Meeting;
}

export function MeetingFormDialog({
  open,
  onOpenChange,
  meeting,
}: MeetingFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const isEdit = Boolean(meeting);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('meetings.editTitle') : t('meetings.createTitle')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('meetings.editDescription') : t('meetings.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && <MeetingFormBody meeting={meeting} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

interface FormErrors {
  title?: string;
  type?: string;
  status?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

interface MeetingFormBodyProps {
  meeting?: Meeting;
  onOpenChange: (open: boolean) => void;
}

function MeetingFormBody({ meeting, onOpenChange }: MeetingFormBodyProps): React.JSX.Element {
  const { t } = useTranslation();
  const createMeeting = useCreateMeeting();
  const updateMeeting = useUpdateMeeting();
  const uploadDocument = useUploadMeetingDocument();
  const isEdit = Boolean(meeting);

  const [title, setTitle] = useState(meeting?.title ?? '');
  const [type, setType] = useState<MeetingType>(meeting?.type ?? 'hallituksen-kokous');
  const [status, setStatus] = useState<MeetingStatus>(meeting?.status ?? 'upcoming');
  const [date, setDate] = useState(meeting?.date ?? '');
  const [startTime, setStartTime] = useState(meeting?.startTime ?? '');
  const [endTime, setEndTime] = useState(meeting?.endTime ?? '');
  const [location, setLocation] = useState(meeting?.location ?? '');
  const [description, setDescription] = useState(meeting?.description ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!title.trim()) {
      errors.title = t('meetings.validationTitleRequired');
    }
    if (!type) {
      errors.type = t('meetings.validationTypeRequired');
    }
    if (!date) {
      errors.date = t('meetings.validationDateRequired');
    }
    if (!startTime) {
      errors.startTime = t('meetings.validationStartTimeRequired');
    }
    if (!endTime) {
      errors.endTime = t('meetings.validationEndTimeRequired');
    }
    if (startTime && endTime && endTime <= startTime) {
      errors.endTime = t('meetings.validationEndAfterStart');
    }
    if (!location.trim()) {
      errors.location = t('meetings.validationLocationRequired');
    }
    if (!description.trim()) {
      errors.description = t('meetings.validationDescriptionRequired');
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (isEdit && meeting) {
        await updateMeeting.mutateAsync({
          id: meeting.id,
          title: title.trim(),
          type,
          status,
          date,
          startTime,
          endTime,
          location: location.trim(),
          description: description.trim(),
        });
        toast.success(t('meetings.updateSuccess'));
      } else {
        const created = await createMeeting.mutateAsync({
          title: title.trim(),
          type,
          status,
          date,
          startTime,
          endTime,
          location: location.trim(),
          description: description.trim(),
        });
        toast.success(t('meetings.createSuccess'));

        if (file) {
          try {
            await uploadDocument.mutateAsync({ meetingId: created.id, file });
            toast.success(t('meetings.documentUploadSuccess'));
          } catch {
            toast.error(t('meetings.documentUploadError'));
          }
        }
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? t('meetings.updateError') : t('meetings.createError'));
    }
  }

  const isPending = createMeeting.isPending || updateMeeting.isPending || uploadDocument.isPending;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meeting-title">{t('meetings.formTitle')}</Label>
          <Input id="meeting-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="meeting-type">{t('meetings.formType')}</Label>
            <Select value={type} onValueChange={(v) => setType(v as MeetingType)}>
              <SelectTrigger id="meeting-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {MEETING_TYPES.map((mt) => (
                  <SelectItem key={mt} value={mt}>
                    {t(`meetingTypes.${mt}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.type && <p className="text-sm text-destructive">{formErrors.type}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-status">{t('meetings.formStatus')}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as MeetingStatus)}>
              <SelectTrigger id="meeting-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {MEETING_STATUSES.map((ms) => (
                  <SelectItem key={ms} value={ms}>
                    {t(`meetings.${ms}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.status && <p className="text-sm text-destructive">{formErrors.status}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-date">{t('meetings.formDate')}</Label>
          <Input
            id="meeting-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="max-w-xs"
          />
          {formErrors.date && <p className="text-sm text-destructive">{formErrors.date}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-start-time">{t('meetings.formStartTime')}</Label>
            <Input
              id="meeting-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            {formErrors.startTime && (
              <p className="text-sm text-destructive">{formErrors.startTime}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-end-time">{t('meetings.formEndTime')}</Label>
            <Input
              id="meeting-end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            {formErrors.endTime && <p className="text-sm text-destructive">{formErrors.endTime}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-location">{t('meetings.formLocation')}</Label>
          <Input
            id="meeting-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {formErrors.location && <p className="text-sm text-destructive">{formErrors.location}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-description">{t('meetings.formDescription')}</Label>
          <Textarea
            id="meeting-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          {formErrors.description && (
            <p className="text-sm text-destructive">{formErrors.description}</p>
          )}
        </div>
        {!isEdit && (
          <div className="space-y-2">
            <Label htmlFor="meeting-file">{t('meetings.formDocument')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="meeting-file"
                type="file"
                accept=".pdf,.docx,.xlsx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
              {uploadDocument.isPending && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  <Upload className="mr-1 inline size-3" />
                  {t('meetings.uploadDocument')}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t('meetings.formDocumentHint')}</p>
          </div>
        )}
      </div>
      <DialogFooter className="mt-6">
        <Button
          type="submit"
          className="bg-hbplus-accent hover:bg-hbplus-accent/90"
          disabled={isPending}
        >
          {isEdit ? t('meetings.update') : t('meetings.submit')}
        </Button>
      </DialogFooter>
    </form>
  );
}
