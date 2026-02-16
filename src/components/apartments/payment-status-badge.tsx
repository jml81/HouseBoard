import { useTranslation } from 'react-i18next';
import type { PaymentStatus } from '@/types';
import { PAYMENT_STATUS_COLORS } from '@/types';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const STATUS_KEYS: Record<PaymentStatus, string> = {
  paid: 'apartments.payments.paid',
  pending: 'apartments.payments.pending',
  overdue: 'apartments.payments.overdue',
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Badge variant="outline" className={PAYMENT_STATUS_COLORS[status]}>
      {t(STATUS_KEYS[status])}
    </Badge>
  );
}
