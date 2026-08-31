# How the events calendar earns

What the comparable businesses actually do, what we can copy, and in what
order. The arithmetic lives in `src/config/eventPricing.ts` and is tested.

No em dashes in this file.

## How the businesses you named make money

### Hyperli, and Groupon before it

A voucher marketplace. The merchant discounts steeply, Hyperli sells the
voucher, **collects the cash up front**, and remits to the merchant later,
keeping a commission commonly between a fifth and a half of the voucher price.

Two things are easy to miss. First, the deep discount is the merchant's
marketing cost, so the platform is selling access to an audience, not a
service. Second, the platform holds the money between sale and redemption,
which is float, and keeps the value of vouchers never redeemed, which the trade
calls breakage and which is meaningful profit.

It is lucrative and it is heavy. You are holding other people's money. You
carry refunds, redemption disputes, merchants who close before vouchers are
redeemed, and consumer protection obligations. The CPA gives South African
consumers strong refund rights that land on the platform first.

### WikiDeals

Not that at all. An **aggregator**. It holds no stock, processes no payments and
takes no delivery risk. It earns an affiliate commission when someone clicks
through and buys at the retailer, plus paid placement and display advertising.

Revenue per transaction is far lower. Operational risk is close to zero. It is
a traffic business: the only real asset is the audience.

### Quicket

Between the two, for ticketing. A booking fee per ticket, either added to what
the attendee pays or absorbed by the organiser out of the ticket price. The
platform does hold money briefly and does carry refunds, but it never owns
inventory and never sets the price.

## What we should do, in order

Ordered by how much has to be true before the line can earn anything.

### 1. Promoted listings. Start here.

An organiser pays for placement above standard listings.

No payment processing, no refunds, no liability for whether the event happens.
This is the WikiDeals shape and it is the only line that can earn on day one,
because it needs an audience and nothing else.

Built and working: `events.listing_tier` and `events.featured_until`, set from
`/admin/events`. A promotion **lapses on its own** when the date passes, in
both the database reader and the client, so a paid placement cannot run
forever because nobody remembered to switch it off. Promoted cards are labelled
"Featured" on the calendar, because a reader is entitled to know that position
was bought rather than earned.

Not built: taking payment for a promotion. Invoice it manually at first. The
volume will not justify automation for a long time, and a manual invoice tells
you what organisers will actually pay, which is worth more than the automation.

### 2. Booking fee on tickets sold through us.

The Quicket shape, and we already hold the hard parts: per session capacity, an
oversell-safe reservation proven against concurrent buyers, and a payment
route.

`calculateFees()` in `src/config/eventPricing.ts` implements it. Defaults are 5
per cent plus R2.50 per ticket, capped at R50, and every number is overridable
per event through `events.fee_bps` and `events.fee_payer`.

Three details that matter:

- **Who pays is a real choice, not a display option.** With `attendee` the fee
  sits on top and the organiser receives full face value. With `organiser` the
  attendee pays the advertised price and the fee comes out of the proceeds.
  Getting it backwards either overcharges an attendee or underpays an
  organiser, so it is computed in one place and tested both ways.
- **The cap exists for retreats.** A percentage with no ceiling turns a R9,000
  retreat ticket into a fee no organiser will agree to.
- **Free events are never charged**, whatever the configuration says.

Not built: the generic booking flow. Seat reservation and payment currently
only exist wired into the bespoke screening page. This is the single largest
remaining piece of work in the module and it is what unlocks this line.

### 3. Referral on events ticketed elsewhere.

Where an organiser sells through Quicket or Eventbrite and that platform runs a
referral programme, earn a commission on the outbound click. Near zero effort
because the listing exists anyway. Small and unreliable, so treat it as
incidental rather than a plan.

The site already has the machinery for this: `src/config/programmes.ts` builds
attributed outbound links and there are tests pinning the shape, after a period
where every Viator click on the site was unattributable and therefore unpaid.
Any events referral must go through that module, not be hand built at the call
site, which is exactly how the previous leak happened.

### 4. Vouchers. Deliberately not built.

The Hyperli shape. It requires holding client money, a redemption ledger, a
refund policy, merchant settlement and CPA compliance. Adding it before the
first three earn anything means taking on the heaviest obligations in the list
for the least certain return.

Revisit when there is a repeat audience and organisers asking for it. Not
before.

## What actually gates all of this

Every line above is a share of something. Promoted listings are a share of
attention, booking fees a share of transactions, referrals a share of clicks.
None of them produce revenue without an audience.

The calendar currently has one real event. The constraint is not the
monetisation logic, which is built and tested; it is having events worth
visiting for and people visiting. That is why the ingestion work is about
making a listing worth having rather than about volume, and it is why I would
spend the next effort on the booking flow and on getting real events listed
rather than on adding a fifth revenue line.

## One thing to decide early

Whether the booking fee is visible to the attendee as a separate line or
absorbed into the ticket price. Quicket shows it, which organisers like because
their price looks unchanged, and attendees dislike because the total moves at
checkout.

`fee_payer` supports both per event, so it does not need deciding globally. But
it should be consistent within a season, because the one thing that reliably
loses a booking is a total that changes between the listing and the payment
screen.
