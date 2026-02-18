import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Booking, BookingCategory } from '@/types';
import { ApiError } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { useCreateBooking, useUpdateBooking } from '@/hooks/use-bookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BOOKING_CATEGORIES: BookingCategory[] = ['sauna', 'pesutupa', 'kerhohuone', 'talkoot'];

const CATEGORY_DEFAULTS: Record<BookingCategory, { title: string; location: string }> = {
  sauna: { title: 'Saunavuoro', location: 'Taloyhtiön sauna' },
  pesutupa: { title: 'Pesutupavuoro', location: 'Taloyhtiön pesutupa' },
  kerhohuone: { title: 'Kerhohuonevaraus', location: 'Kerhohuone' },
  talkoot: { title: 'Talkoot', location: 'Piha-alue' },
};

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking;
}

export function BookingFormDialog({
  open,
  onOpenChange,
  booking,
}: BookingFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const isEdit = Boolean(booking);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('booking.editTitle') : t('booking.createTitle')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('booking.editDescription') : t('booking.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && <BookingFormBody booking={booking} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

interface FormErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
}

interface BookingFormBodyProps {
  booking?: Booking;
  onOpenChange: (open: boolean) => void;
}

function BookingFormBody({ booking, onOpenChange }: BookingFormBodyProps): React.JSX.Element {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();
  const isEdit = Boolean(booking);

  const initialCategory = booking?.category ?? 'sauna';
  const [category, setCategory] = useState<BookingCategory>(initialCategory);
  const [date, setDate] = useState(booking?.date ?? '');
  const [startTime, setStartTime] = useState(booking?.startTime ?? '');
  const [endTime, setEndTime] = useState(booking?.endTime ?? '');
  const [title, setTitle] = useState(booking?.title ?? CATEGORY_DEFAULTS[initialCategory].title);
  const [location, setLocation] = useState(
    booking?.location ?? CATEGORY_DEFAULTS[initialCategory].location,
  );
  const [titleTouched, setTitleTouched] = useState(Boolean(booking));
  const [locationTouched, setLocationTouched] = useState(Boolean(booking));
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function handleCategoryChange(newCategory: BookingCategory): void {
    setCategory(newCategory);
    if (!titleTouched) {
      setTitle(CATEGORY_DEFAULTS[newCategory].title);
    }
    if (!locationTouched) {
      setLocation(CATEGORY_DEFAULTS[newCategory].location);
    }
  }

  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!date) {
      errors.date = t('booking.validationDateRequired');
    } else {
      const today = new Date().toISOString().slice(0, 10);
      if (date < today) {
        errors.date = t('booking.validationDatePast');
      }
    }
    if (!startTime) {
      errors.startTime = t('booking.validationStartTimeRequired');
    }
    if (!endTime) {
      errors.endTime = t('booking.validationEndTimeRequired');
    }
    if (startTime && endTime && endTime <= startTime) {
      errors.endTime = t('booking.validationEndAfterStart');
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
      if (isEdit && booking) {
        await updateBooking.mutateAsync({
          id: booking.id,
          category,
          date,
          startTime,
          endTime,
          title: title.trim(),
          location: location.trim(),
        });
        toast.success(t('booking.updateSuccess'));
      } else {
        await createBooking.mutateAsync({
          category,
          date,
          startTime,
          endTime,
          title: title.trim() || undefined,
          location: location.trim() || undefined,
          bookerName: user.name,
          apartment: user.apartment,
        });
        toast.success(t('booking.createSuccess'));
      }
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error(t('booking.overlapError'));
      } else {
        toast.error(isEdit ? t('booking.updateError') : t('booking.createError'));
      }
    }
  }

  const isPending = createBooking.isPending || updateBooking.isPending;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t('booking.category')}</Label>
          <Select
            value={category}
            onValueChange={(v) => handleCategoryChange(v as BookingCategory)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {t(`categories.${c}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-date">{t('booking.date')}</Label>
          <Input
            id="booking-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {formErrors.date && <p className="text-sm text-destructive">{formErrors.date}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="booking-start-time">{t('booking.startTime')}</Label>
            <Input
              id="booking-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            {formErrors.startTime && (
              <p className="text-sm text-destructive">{formErrors.startTime}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-end-time">{t('booking.endTime')}</Label>
            <Input
              id="booking-end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            {formErrors.endTime && <p className="text-sm text-destructive">{formErrors.endTime}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-title">{t('booking.title')}</Label>
          <Input
            id="booking-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleTouched(true);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-location">{t('booking.location')}</Label>
          <Input
            id="booking-location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setLocationTouched(true);
            }}
          />
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button type="submit" className="bg-hb-accent hover:bg-hb-accent/90" disabled={isPending}>
          {isEdit ? t('booking.update') : t('booking.submit')}
        </Button>
      </DialogFooter>
    </form>
  );
}
