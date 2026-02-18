import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Apartment, ApartmentPayment, PaymentStatus } from '@/types';
import { useCreateApartmentPayment, useUpdateApartmentPayment } from '@/hooks/use-apartments';
import { ApiError } from '@/lib/api-client';
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

const PAYMENT_STATUSES: PaymentStatus[] = ['paid', 'pending', 'overdue'];

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: ApartmentPayment;
  apartments?: Apartment[];
  existingPaymentIds?: Set<string>;
}

export function PaymentFormDialog({
  open,
  onOpenChange,
  payment,
  apartments,
  existingPaymentIds,
}: PaymentFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const isEdit = Boolean(payment);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('apartments.payments.editTitle') : t('apartments.payments.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('apartments.payments.editDescription')
              : t('apartments.payments.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && (
          <PaymentFormBody
            payment={payment}
            apartments={apartments}
            existingPaymentIds={existingPaymentIds}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface FormErrors {
  apartmentId?: string;
  lastPaymentDate?: string;
}

interface PaymentFormBodyProps {
  payment?: ApartmentPayment;
  apartments?: Apartment[];
  existingPaymentIds?: Set<string>;
  onOpenChange: (open: boolean) => void;
}

function PaymentFormBody({
  payment,
  apartments,
  existingPaymentIds,
  onOpenChange,
}: PaymentFormBodyProps): React.JSX.Element {
  const { t } = useTranslation();
  const createPayment = useCreateApartmentPayment();
  const updatePayment = useUpdateApartmentPayment();
  const isEdit = Boolean(payment);

  const [apartmentId, setApartmentId] = useState(payment?.apartmentId ?? '');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    payment?.paymentStatus ?? 'paid',
  );
  const [lastPaymentDate, setLastPaymentDate] = useState(payment?.lastPaymentDate ?? '');
  const [arrears, setArrears] = useState(payment?.arrears ?? 0);
  const [hoitovastike, setHoitovastike] = useState(payment?.chargeBreakdown.hoitovastike ?? 0);
  const [rahoitusvastike, setRahoitusvastike] = useState(
    payment?.chargeBreakdown.rahoitusvastike ?? 0,
  );
  const [vesimaksu, setVesimaksu] = useState(payment?.chargeBreakdown.vesimaksu ?? 0);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const monthlyTotal = hoitovastike + rahoitusvastike + vesimaksu;

  const availableApartments = apartments?.filter((a) => !existingPaymentIds?.has(a.id));

  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!isEdit && !apartmentId) {
      errors.apartmentId = t('apartments.payments.validationApartmentRequired');
    }
    if (!lastPaymentDate) {
      errors.lastPaymentDate = t('apartments.payments.validationDateRequired');
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
      if (isEdit && payment) {
        await updatePayment.mutateAsync({
          apartmentId: payment.apartmentId,
          paymentStatus,
          lastPaymentDate,
          arrears,
          hoitovastike,
          rahoitusvastike,
          vesimaksu,
        });
        toast.success(t('apartments.payments.updateSuccess'));
      } else {
        await createPayment.mutateAsync({
          apartmentId,
          paymentStatus,
          lastPaymentDate,
          arrears,
          hoitovastike,
          rahoitusvastike,
          vesimaksu,
        });
        toast.success(t('apartments.payments.createSuccess'));
      }
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error(t('apartments.payments.duplicateError'));
      } else {
        toast.error(
          isEdit ? t('apartments.payments.updateError') : t('apartments.payments.createError'),
        );
      }
    }
  }

  const isPending = createPayment.isPending || updatePayment.isPending;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className="space-y-4">
        {!isEdit && (
          <div className="space-y-2">
            <Label>{t('apartments.payments.formApartment')}</Label>
            <Select value={apartmentId} onValueChange={setApartmentId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableApartments?.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.number} — {a.resident}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.apartmentId && (
              <p className="text-sm text-destructive">{formErrors.apartmentId}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>{t('apartments.payments.formPaymentStatus')}</Label>
          <Select value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`apartments.payments.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-date">{t('apartments.payments.formLastPaymentDate')}</Label>
          <Input
            id="payment-date"
            type="date"
            value={lastPaymentDate}
            onChange={(e) => setLastPaymentDate(e.target.value)}
          />
          {formErrors.lastPaymentDate && (
            <p className="text-sm text-destructive">{formErrors.lastPaymentDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-arrears">{t('apartments.payments.formArrears')}</Label>
          <Input
            id="payment-arrears"
            type="number"
            min="0"
            value={arrears}
            onChange={(e) => setArrears(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="payment-hoitovastike">
              {t('apartments.payments.formHoitovastike')}
            </Label>
            <Input
              id="payment-hoitovastike"
              type="number"
              min="0"
              value={hoitovastike}
              onChange={(e) => setHoitovastike(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-rahoitusvastike">
              {t('apartments.payments.formRahoitusvastike')}
            </Label>
            <Input
              id="payment-rahoitusvastike"
              type="number"
              min="0"
              value={rahoitusvastike}
              onChange={(e) => setRahoitusvastike(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-vesimaksu">{t('apartments.payments.formVesimaksu')}</Label>
            <Input
              id="payment-vesimaksu"
              type="number"
              min="0"
              value={vesimaksu}
              onChange={(e) => setVesimaksu(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm text-muted-foreground">
            {t('apartments.payments.formMonthlyTotal')}
          </p>
          <p className="text-lg font-bold">
            {monthlyTotal} &euro;{t('apartments.payments.perMonth')}
          </p>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button
          type="submit"
          className="bg-hbplus-accent hover:bg-hbplus-accent/90"
          disabled={isPending}
        >
          {isEdit ? t('apartments.payments.update') : t('apartments.payments.submit')}
        </Button>
      </DialogFooter>
    </form>
  );
}
