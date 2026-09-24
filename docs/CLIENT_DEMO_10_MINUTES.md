# Ten minute demo: a client from name to paid

Six accounts, one screen each, in the order the money moves. Everything
below works on the live admin today.

## Before you start, one minute

Admin, Sales, Pipeline, then **Import a list**. Paste the six rows from
`omni-clients.csv`, name the list `omni-clients`, press Import. They land
in New.

That is the demo's first beat on its own: a list of clients becomes a
worked board in one paste, and it tells you it skipped anything already
there rather than doubling it up.

If the seed migration has been run instead, they are already on the board
across several stages and you can skip this step.

## The run, eight minutes

**1. The board.** Sales, Pipeline. Six cards. Filter by the `omni-clients`
list. Say what the columns are: New, In conversation, Findings sent,
Quoted, Won. Drag Landmark Foundation from New to In conversation. The
card moves and the record moves with it, in whichever table owns that
lead.

**2. The client card.** Clients and partners, Clients. Open Beauty Without
Cruelty. Everything the system knows about them on one card: every
enquiry, every stage change, orders, bookings, and a note box that writes
to the same timeline. This is the answer to "what is going on with this
account" without asking three people.

**3. The quote.** Back to Pipeline, open a card, **Build quote**. Every
service on the rate card as a tick box with its published price already
in. Tick Social media management. It does the arithmetic the terms
dictate: fifty percent deposit, balance before handover, valid fourteen
days. Issue it. The lead moves to Quoted and the printable quotation
opens with the Capitec details and the quote number as the payment
reference.

**4. The money.** Money, Quotes and payments. The quote you just issued is
sitting under deposits awaited. Record a payment against it. That is the
loop closed: name, conversation, quotation, payment, all on one record.

**5. What we sell.** Clients and partners, Services. This is where the
service a client buys is described. Five offers currently show a price and
no list of what is included, and this screen opens on exactly those. Show
the preview pane: what you type is how the offer page reads. Price is
locked here on purpose and needs a developer, so nobody can move a number
by accident.

**6. Where the next clients come from.** Marketing, Channels shows which
of the things we do actually produced leads. Marketing, Google Ads writes
a campaign per service from the rate card and downloads one file for the
whole card. Note the account is suspended, so that one is built and
waiting.

## Say this about the data, early

The names and the service lines are real. **No email address, contact
person or phone number has been filled in**, because none was on file and
a guessed address on a client record is worse than a blank one. The stages
are a starting point so the board shows the flow, not a record of where
each account actually stands. Both get corrected in the drawer in about a
minute each.

Saying that first is better than being asked.

## If someone asks what is not done

- Three database migrations are waiting to be run, so Save on the Services
  screen, live walk-in sync between phones, and Save on Google Ads are off
  until they are. Nothing on the public site is affected.
- The Google Ads account is suspended over a past due balance, and the
  reconciliation Chad asked for is the blocker, not Google.
- Five services still need their inclusions written, which is twenty
  minutes from whoever knows what they include.
