import type { ApartmentType } from './apartment';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface ChargeBreakdown {
  hoitovastike: number;
  rahoitusvastike: number;
  vesimaksu: number;
}

export interface ApartmentPayment {
  apartmentId: string;
  monthlyCharge: number;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string;
  arrears: number;
  chargeBreakdown: ChargeBreakdown;
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  overdue: 'bg-red-100 text-red-700',
};

export const MONTHLY_CHARGES: Record<ApartmentType, number> = {
  '1h+k': 180,
  '2h+k': 240,
  '3h+k': 310,
  '4h+k': 380,
};
