/**
 * Who is issuing the document.
 *
 * Every quotation, proposal, invoice and receipt reads its "From" block
 * and its footer from here, so the legal name, the trading name and the
 * contact line cannot drift between documents.
 *
 * WHAT IS KNOWN AND WHAT IS NOT. The legal name is the one on the bank
 * account (src/data/bankDetails.ts), confirmed by the company on 14
 * September 2026. The email is the one published on /contact and in the
 * site footer. The registration number and the VAT number are NOT on
 * file in this repository, so they are empty, and an empty field renders
 * nothing: a document never shows a label beside a blank, and never shows
 * a number somebody guessed. Fill them in here and every document carries
 * them from the next build.
 *
 * VAT. Until a VAT number is set, no document adds VAT and none claims to
 * be a tax invoice; the published term "VAT treatment confirmed on
 * quotation" stands. Setting the VAT number switches the VAT row on at
 * VAT_RATE on top of the rate card price. Whether the card is meant to be
 * VAT inclusive or exclusive is a decision for Chad and the accountant,
 * not for this file, which is why the switch is a number to type and not
 * a default.
 *
 * No em dashes in this file.
 */

export const COMPANY = {
  legalName: 'OMNI MEDIA PRODUCTIONS PTY LTD',
  tradingName: 'Omni Wellness Media',
  location: 'Muizenberg, Cape Town',
  website: 'omniwellnessmedia.co.za',
  email: 'omniwellnessmedia@gmail.com',
  /** Company registration number. Not on file. Renders only when set. */
  registrationNumber: '',
  /** VAT registration number. Not on file. Renders only when set, and switches VAT on. */
  vatNumber: '',
} as const;

export const VAT_RATE_PERCENT = 15;

export const VAT_REGISTERED = COMPANY.vatNumber.trim().length > 0;
