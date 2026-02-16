import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ApartmentPayment } from '@/types';

interface PaymentSummaryBarProps {
  payments: ApartmentPayment[];
}

export function PaymentSummaryBar({ payments }: PaymentSummaryBarProps): React.JSX.Element {
  const { t } = useTranslation();

  const summary = useMemo(() => {
    const paid = payments.filter((p) => p.paymentStatus === 'paid').length;
    const pending = payments.filter((p) => p.paymentStatus === 'pending').length;
    const overdue = payments.filter((p) => p.paymentStatus === 'overdue').length;
    const totalArrears = payments.reduce((sum, p) => sum + p.arrears, 0);
    return { paid, pending, overdue, totalArrears };
  }, [payments]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-lg border bg-green-50 p-3">
        <p className="text-sm text-muted-foreground">{t('apartments.payments.paidCount')}</p>
        <p className="text-2xl font-bold text-green-700">{summary.paid}</p>
      </div>
      <div className="rounded-lg border bg-amber-50 p-3">
        <p className="text-sm text-muted-foreground">{t('apartments.payments.pendingCount')}</p>
        <p className="text-2xl font-bold text-amber-700">{summary.pending}</p>
      </div>
      <div className="rounded-lg border bg-red-50 p-3">
        <p className="text-sm text-muted-foreground">{t('apartments.payments.overdueCount')}</p>
        <p className="text-2xl font-bold text-red-700">{summary.overdue}</p>
      </div>
      <div className="rounded-lg border p-3">
        <p className="text-sm text-muted-foreground">{t('apartments.payments.totalArrears')}</p>
        <p className="text-2xl font-bold">{summary.totalArrears} &euro;</p>
      </div>
    </div>
  );
}
