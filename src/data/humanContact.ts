/**
 * The people a client can phone, and when.
 *
 * WHY THIS EXISTS. The WhatsApp buttons pointed at a broadcast channel
 * nobody could reply through, so a person who wanted to talk to us had no
 * way to do it except a form. Until a real WhatsApp number is in place, a
 * phone number is the honest version of that offer, and arguably the
 * better one.
 *
 * EVERY FACT HERE IS ALREADY PUBLISHED. The number and the office hours
 * are the ones on /contact. Nothing on this page is a new commitment, and
 * nothing here was invented.
 *
 * ADDING SOMEONE. Set their phone and they appear. An entry with an empty
 * phone renders nothing at all, which is deliberate: a name beside a blank
 * space, or worse a dead tel: link, is a broken promise to somebody
 * holding a phone.
 *
 * No em dashes in this file.
 */

export interface HumanContact {
  name: string;
  /** What they handle, in the caller's terms rather than an org chart title. */
  role: string;
  /** Published number. Empty means not published yet, so the entry is skipped. */
  phone: string;
}

export const HUMAN_CONTACTS: HumanContact[] = [
  {
    name: 'Chad Cupido',
    role: 'Founding Director',
    // Already published on /contact.
    phone: '+27 74 831 5961',
  },
  {
    name: 'Feroza Begg',
    role: 'Enquiries',
    // Not published anywhere yet. Fill this in and she appears on every
    // service page, the detail pages and the enquiry form, with no other
    // change needed. Left empty on purpose rather than guessed.
    phone: '',
  },
];

/** The hours already stated on /contact. */
export const OFFICE_HOURS = 'Monday to Friday, 9am to 5pm SAST';

/** Only the people we can actually put a working number against. */
export const publishedContacts = (): HumanContact[] =>
  HUMAN_CONTACTS.filter((c) => c.phone.trim().length > 0);

/** A dialable href. Strips the spacing that makes a number readable. */
export const telHref = (phone: string): string =>
  `tel:${phone.replace(/[^\d+]/g, '')}`;
