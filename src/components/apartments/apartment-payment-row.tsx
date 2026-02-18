import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Apartment, ApartmentPayment } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteApartmentPayment } from '@/hooks/use-apartments';
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
import { formatDate } from '@/lib/date-utils';
import { PaymentStatusBadge } from './payment-status-badge';
import { PaymentFormDialog } from './payment-form-dialog';

interface ApartmentPaymentRowProps {
  apartment: Apartment;
  payment: ApartmentPayment;
}

export function ApartmentPaymentRow({
  apartment,
  payment,
}: ApartmentPaymentRowProps): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const deletePayment = useDeleteApartmentPayment();
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    try {
      await deletePayment.mutateAsync(payment.apartmentId);
      toast.success(t('apartments.payments.deleteSuccess'));
      setDeleteOpen(false);
    } catch {
      toast.error(t('apartments.payments.deleteError'));
    }
  }

  return (
    <div className="rounded-lg border">
      <button
        type="button"
        className="flex w-full items-center gap-4 p-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-14 shrink-0">
          <p className="font-bold">{apartment.number}</p>
        </div>
        <Badge variant="outline" className="shrink-0">
          {apartment.type}
        </Badge>
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate">{apartment.resident}</p>
        </div>
        <p className="shrink-0 text-sm font-medium">
          {payment.monthlyCharge} &euro;{t('apartments.payments.perMonth')}
        </p>
        <PaymentStatusBadge status={payment.paymentStatus} />
        {payment.arrears > 0 && (
          <Badge variant="destructive" className="shrink-0">
            {payment.arrears} &euro;
          </Badge>
        )}
      </button>
      {expanded && (
        <div className="border-t bg-muted/50 px-3 py-3">
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div>
              <p className="text-muted-foreground">{t('apartments.payments.hoitovastike')}</p>
              <p className="font-medium">{payment.chargeBreakdown.hoitovastike} &euro;</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('apartments.payments.rahoitusvastike')}</p>
              <p className="font-medium">{payment.chargeBreakdown.rahoitusvastike} &euro;</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('apartments.payments.vesimaksu')}</p>
              <p className="font-medium">{payment.chargeBreakdown.vesimaksu} &euro;</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('apartments.payments.lastPayment')}</p>
              <p className="font-medium">{formatDate(payment.lastPaymentDate)}</p>
            </div>
          </div>
          {isManager && (
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                {t('apartments.payments.editPayment')}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                {t('apartments.payments.deletePayment')}
              </Button>
            </div>
          )}
        </div>
      )}

      <PaymentFormDialog open={editOpen} onOpenChange={setEditOpen} payment={payment} />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('apartments.payments.deletePayment')}</DialogTitle>
            <DialogDescription>{t('apartments.payments.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                void handleDelete();
              }}
              disabled={deletePayment.isPending}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
