import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { HousingEvent } from '@/types';
import { useCreateEvent, useUpdateEvent } from '@/hooks/use-events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: HousingEvent;
}

export function EventFormDialog({
  open,
  onOpenChange,
  event,
}: EventFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const isEdit = Boolean(event);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('events.editTitle') : t('events.createTitle')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('events.editDescription') : t('events.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && <EventFormBody event={event} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

interface FormErrors {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  organizer?: string;
}

interface EventFormBodyProps {
  event?: HousingEvent;
  onOpenChange: (open: boolean) => void;
}

function EventFormBody({ event, onOpenChange }: EventFormBodyProps): React.JSX.Element {
  const { t } = useTranslation();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const isEdit = Boolean(event);

  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [date, setDate] = useState(event?.date ?? '');
  const [startTime, setStartTime] = useState(event?.startTime ?? '');
  const [endTime, setEndTime] = useState(event?.endTime ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [organizer, setOrganizer] = useState(event?.organizer ?? '');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!title.trim()) {
      errors.title = t('events.validationTitleRequired');
    }
    if (!description.trim()) {
      errors.description = t('events.validationDescriptionRequired');
    }
    if (!date) {
      errors.date = t('events.validationDateRequired');
    }
    if (!startTime) {
      errors.startTime = t('events.validationStartTimeRequired');
    }
    if (!endTime) {
      errors.endTime = t('events.validationEndTimeRequired');
    }
    if (startTime && endTime && endTime <= startTime) {
      errors.endTime = t('events.validationEndAfterStart');
    }
    if (!location.trim()) {
      errors.location = t('events.validationLocationRequired');
    }
    if (!organizer.trim()) {
      errors.organizer = t('events.validationOrganizerRequired');
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
      if (isEdit && event) {
        await updateEvent.mutateAsync({
          id: event.id,
          title: title.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          location: location.trim(),
          organizer: organizer.trim(),
        });
        toast.success(t('events.updateSuccess'));
      } else {
        await createEvent.mutateAsync({
          title: title.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          location: location.trim(),
          organizer: organizer.trim(),
        });
        toast.success(t('events.createSuccess'));
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? t('events.updateError') : t('events.createError'));
    }
  }

  const isPending = createEvent.isPending || updateEvent.isPending;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="event-title">{t('events.formTitle')}</Label>
          <Input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-description">{t('events.formDescription')}</Label>
          <Textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          {formErrors.description && (
            <p className="text-sm text-destructive">{formErrors.description}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event-date">{t('events.formDate')}</Label>
            <Input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {formErrors.date && <p className="text-sm text-destructive">{formErrors.date}</p>}
          </div>
          <div />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event-start-time">{t('events.formStartTime')}</Label>
            <Input
              id="event-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            {formErrors.startTime && (
              <p className="text-sm text-destructive">{formErrors.startTime}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-end-time">{t('events.formEndTime')}</Label>
            <Input
              id="event-end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            {formErrors.endTime && <p className="text-sm text-destructive">{formErrors.endTime}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-location">{t('events.formLocation')}</Label>
          <Input
            id="event-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {formErrors.location && <p className="text-sm text-destructive">{formErrors.location}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-organizer">{t('events.formOrganizer')}</Label>
          <Input
            id="event-organizer"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
          />
          {formErrors.organizer && (
            <p className="text-sm text-destructive">{formErrors.organizer}</p>
          )}
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button type="submit" className="bg-hb-accent hover:bg-hb-accent/90" disabled={isPending}>
          {isEdit ? t('events.update') : t('events.submit')}
        </Button>
      </DialogFooter>
    </form>
  );
}
