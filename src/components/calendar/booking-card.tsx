import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, User, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Booking } from '@/types';
import { BOOKING_CATEGORY_COLORS } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteBooking } from '@/hooks/use-bookings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatTime } from '@/lib/date-utils';
import { BookingFormDialog } from './booking-form-dialog';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps): React.JSX.Element {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const isManager = useAuthStore((s) => s.isManager);
  const deleteBooking = useDeleteBooking();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isOwner = booking.createdBy !== null && user?.id === booking.createdBy;
  const canManage = isOwner || isManager;

  async function handleDelete(): Promise<void> {
    try {
      await deleteBooking.mutateAsync(booking.id);
      toast.success(t('booking.deleteSuccess'));
      setDeleteDialogOpen(false);
    } catch {
      toast.error(t('booking.deleteError'));
    }
  }

  return (
    <>
      <div className="flex gap-3 rounded-lg border p-3">
        <span
          className="mt-1 size-3 shrink-0 rounded-full"
          style={{ backgroundColor: BOOKING_CATEGORY_COLORS[booking.category] }}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{booking.title}</p>
            <Badge variant="outline" className="text-xs">
              {t(`categories.${booking.category}`)}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatTime(booking.startTime)}-{formatTime(booking.endTime)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {booking.location}
            </span>
            <span className="flex items-center gap-1">
              <User className="size-3.5" />
              {booking.bookerName} ({booking.apartment})
            </span>
          </div>
          {canManage && (
            <div className="flex gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() => setEditDialogOpen(true)}
              >
                <Pencil className="size-3" />
                {t('booking.editBooking')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-destructive hover:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="size-3" />
                {t('booking.deleteBooking')}
              </Button>
            </div>
          )}
        </div>
      </div>

      <BookingFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} booking={booking} />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('booking.deleteBooking')}</DialogTitle>
            <DialogDescription>{t('booking.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteBooking.isPending}
              onClick={() => {
                void handleDelete();
              }}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
