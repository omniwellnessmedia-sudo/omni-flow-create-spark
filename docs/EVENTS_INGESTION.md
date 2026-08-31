# Getting events into the calendar

How listings reach the calendar, which sources are built, and why the obvious
one is not.

No em dashes in this file.

## The short version

There is no social media scraper, and I do not recommend building one. The
sources that are built or specified below get most of the same coverage without
the legal exposure, and one of them gets better data than scraping ever would.

## Why not scrape Facebook, Instagram and TikTok

The request was reasonable and the reasoning behind it is right: a lot of small
wellness communities do advertise on those platforms and nowhere else. But
scraping them fails on four separate grounds, any one of which is enough.

**It breaks the platform terms.** Automated collection is prohibited by all
three. Meta and TikTok both enforce this, and the account used for scraping is
what gets banned. If that is a business account you also advertise from, the
loss is much larger than the feature.

**The content is not ours to republish.** An event description and its poster
are the organiser's copyright. Collecting them is one act; publishing them on
our site is a separate and more serious one. A copyright complaint against the
site is a real risk, and it lands on the domain we depend on.

**POPIA applies.** Organiser names, contact details and photographs are
personal information. Collecting personal information without a lawful basis
and processing it for our own commercial purpose is exactly what the Act
regulates. Consent is the cleanest basis available to us, and scraping is the
one method that guarantees we do not have it.

**It reintroduces the problem we just fixed.** The calendar this module
replaces carried six invented events, one describing a food drive run in
partnership with a real foundation, which never happened. An unattended
scraper publishing unverified third party content is the same failure with more
automation behind it: listings nobody checked, attributed to organisations that
never agreed. The database now refuses to publish an unverified event
specifically so that cannot recur.

## What is built instead

### 1. Organiser submission, live now

`/events/submit` writes to `event_submissions`. The organiser gives us their
own words, their own contact details and an explicit confirmation that they are
entitled to have the event listed. A person then reviews it in
`/admin/events`.

This is better data than scraping produces, not merely safer. A scraped post
gives you a caption and a guess at the date. A submission gives you a
structured date, venue, price, booking link and a named contact who wants the
listing to succeed and will correct it if it is wrong.

Approving a submission creates a **draft**, not a listing. It still has to be
checked and published. Two steps on purpose: the submitter has an interest in
it going live, and we are the ones vouching for it.

### 2. Registered feeds, schema in place

`event_sources` holds sources we have permission to read, with the permission
recorded the same way consent is recorded everywhere else in this codebase.
Three kinds are allowed:

- **`ics`** An organiser's own calendar feed. Most booking and calendar
  software publishes one. Stable, structured, and offered by the organiser for
  exactly this purpose.
- **`jsonld`** `schema.org/Event` markup on the organiser's own website. This
  is data a site publishes deliberately for machines to read, which is a
  materially different act from scraping a rendered page, and it is how search
  engines get event data.
- **`api`** A ticketing partner API we hold credentials for. Quicket,
  Eventbrite and Meetup all publish one. This is the route to the Quicket
  coverage that was asked about, and it comes with terms we can actually meet.

The fetcher itself is not written. The schema, the permission fields, the
deduplication key (`events.source_ref` is unique per source, so a re-fetch
updates instead of duplicating) and the provenance display are all in place, so
the fetcher is a contained piece of work whenever a real source is signed up.
It should run as a scheduled Netlify function and write **drafts**, never
published rows.

### 3. Our own events

Entered directly in `/admin/events`.

## Rules any future fetcher must follow

1. Write drafts. A fetcher must never set `status = 'published'`. The database
   also refuses to publish anything with a null `verified_at`, so this is
   enforced and not merely intended.
2. Set `source`, `source_url` and `source_ref` on every row. Provenance is
   shown to the reader on the event page.
3. Deduplicate on `source_ref`. The unique index will reject a duplicate rather
   than let one through.
4. Store a link, not a copy, wherever possible. Prefer sending the reader to
   the organiser's own page over reproducing their description in full.
5. Record the permission in `event_sources` before activating a source. The
   `is_active` default is false for this reason.
6. Never ingest an image by hotlinking it. The site had an image retry bug that
   turned broken images into an unbounded request loop; hotlinked third party
   images are the most likely thing to break.

## What to do about the platform-only organisers

The honest answer is that reaching them is outreach, not engineering. The
submission form is the mechanism; getting it in front of them is the work.

The one thing that would actually move it is making the listing worth having.
An organiser will fill in a form if the calendar sends them attendees. That
argues for putting effort into the calendar being genuinely useful and well
ranked before worrying about ingestion volume, because an empty audience makes
every acquisition route hard.

See `docs/EVENTS_REVENUE.md` for how the listing pays for itself once it does.
