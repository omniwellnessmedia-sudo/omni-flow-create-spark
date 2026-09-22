/**
 * Travel and Tours Cape Town: the sister company that runs and sells the
 * tours listed on this site.
 *
 * Tours are not booked or paid for on omniwellnessmedia.co.za. Every tour
 * page hands the visitor to Travel and Tours to book, and copies Omni on
 * an email enquiry. One place to change the address if it moves.
 *
 * THE ADDRESS. The site went live on 21 September 2026, announced by
 * Tumelo to the team as travelandtourscapetown.com, so the apex is what
 * is recorded here. The earlier value carried a www prefix, taken from the
 * provider profile seeded in supabase/migrations/20250702072218, which
 * nobody had confirmed resolves. Apex and www usually redirect to each
 * other, but "usually" is not good enough for the only button on five tour
 * pages, so this uses the spelling that was actually announced live. The
 * enquiry address comes from the booking sidebar that preceded this file.
 * Neither can be reached from the build environment to check.
 *
 * No em dashes in this file.
 */
export const TRAVEL_AND_TOURS = {
  name: 'Travel and Tours Cape Town',
  shortName: 'Travel and Tours',
  website: 'https://travelandtourscapetown.com',
  email: 'traveltourscapetown@gmail.com',
  /** Omni is copied on every tour enquiry so the conversation is visible on the Pipeline. */
  cc: 'omniwellnessmedia@gmail.com',
} as const;

export const tourEnquiryMailto = (tourTitle: string, name?: string): string => {
  const subject = `Enquiry: ${tourTitle}`;
  const body = `Hi Travel and Tours Cape Town,\n\nI would like to book or find out more about ${tourTitle}.\n\nPreferred dates:\nNumber of people:\n\nThanks,\n${name?.trim() || ''}`;
  return `mailto:${TRAVEL_AND_TOURS.email}?cc=${TRAVEL_AND_TOURS.cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
