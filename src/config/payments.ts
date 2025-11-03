export type PaymentGateway = 'payoneer' | 'wise' | 'capitech';
export type PaymentCurrency = 'USD' | 'EUR' | 'ZAR';

export interface PaymentRoute {
  currency: PaymentCurrency;
  source: 'affiliate_commission';
  gateway: PaymentGateway;
  conversion_fee_percent: number;
  processing_time_days: number;
  minimum_payout: number;
}

export const PAYMENT_ROUTES: PaymentRoute[] = [
  {
    currency: 'USD',
    source: 'affiliate_commission',
    gateway: 'payoneer',
    conversion_fee_percent: 2.0,
    processing_time_days: 3,
    minimum_payout: 100
  },
  {
    currency: 'EUR',
    source: 'affiliate_commission',
    gateway: 'payoneer',
    conversion_fee_percent: 2.0,
    processing_time_days: 3,
    minimum_payout: 100
  },
  {
    currency: 'ZAR',
    source: 'affiliate_commission',
    gateway: 'capitech',
    conversion_fee_percent: 0,
    processing_time_days: 1,
    minimum_payout: 500
  }
];

export const getPaymentRoute = (currency: PaymentCurrency): PaymentRoute | undefined => {
  return PAYMENT_ROUTES.find(route => route.currency === currency);
};

export const canProcessPayout = (amount: number, currency: PaymentCurrency): boolean => {
  const route = getPaymentRoute(currency);
  return route ? amount >= route.minimum_payout : false;
};

export const calculatePayoutFee = (amount: number, currency: PaymentCurrency): number => {
  const route = getPaymentRoute(currency);
  return route ? (amount * route.conversion_fee_percent) / 100 : 0;
};

export const calculateNetPayout = (amount: number, currency: PaymentCurrency): number => {
  const fee = calculatePayoutFee(amount, currency);
  return amount - fee;
};
