import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Apartment, ApartmentPayment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date-utils';
import { PaymentStatusBadge } from './payment-status-badge';

interface ApartmentPaymentRowProps {
  apartment: Apartment;
  payment: ApartmentPayment;
}

export function ApartmentPaymentRow({
  apartment,
  payment,
}: ApartmentPaymentRowProps): React.JSX.Element {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

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
        </div>
      )}
    </div>
  );
}
