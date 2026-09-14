/**
 * Where money goes.
 *
 * Confirmed by the company on 14 September 2026 as the account for client
 * payments. It is the same account the retreat page has published since
 * before this file existed; that page now reads from here so the two can
 * never disagree.
 *
 * The account name is the registered entity, not the trading name. That is
 * correct and deliberate: a bank matches the name on the account, and a
 * client who types "Omni Wellness Media" into a beneficiary field gets a
 * name mismatch warning that stops the payment.
 *
 * No em dashes in this file.
 */

export const BANK_DETAILS = {
  bank: 'Capitec Business',
  accountName: 'OMNI MEDIA PRODUCTIONS PTY LTD',
  accountNumber: '1051893445',
  branchCode: '450105',
} as const;

/** The reference a client must use, so a payment can be matched without asking. */
export const paymentReference = (quoteNumber: string): string => quoteNumber;
