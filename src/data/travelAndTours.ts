/**
 * Travel and Tours Cape Town: the sister company that runs and sells the
 * tours listed on this site.
 *
 * Tours are not booked or paid for on omniwellnessmedia.co.za. Every tour
 * page hands the visitor to Travel and Tours to book, and copies Omni on
 * an email enquiry. One place to change the address if it moves.
 *
 * The website address comes from the provider profile seeded in
 * supabase/migrations/20250702072218 and the enquiry address from the
 * booking sidebar that preceded this file. Neither could be verified live
 * from the build environment; confirm before a campaign points at them.
 *
 * No em dashes in this file.
 */
export const TRAVEL_AND_TOURS = {
  name: 'Travel and Tours Cape Town',
  shortName: 'Travel and Tours',
  website: 'https://www.travelandtourscapetown.com',
  email: 'traveltourscapetown@gmail.com',
  /** Omni is copied on every tour enquiry so the conversation is visible on the Pipeline. */
  cc: 'omniwellnessmedia@gmail.com',
} as const;

export const tourEnquiryMailto = (tourTitle: string, name?: string): string => {
  const subject = `Enquiry: ${tourTitle}`;
  const body = `Hi Travel and Tours Cape Town,\n\nI would like to book or find out more about ${tourTitle}.\n\nPreferred dates:\nNumber of people:\n\nThanks,\n${name?.trim() || ''}`;
  return `mailto:${TRAVEL_AND_TOURS.email}?cc=${TRAVEL_AND_TOURS.cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
