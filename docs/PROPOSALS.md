# Proposals: a lead to a yes in three minutes

Open a lead on the Pipeline, press **Build proposal**, and you get a
branded document with what we noticed, what we propose, how it runs, what
it costs, and how to say yes. Print it to PDF or send the link. The cover
email is one click.

## The three minutes

1. **Theme.** Guessed from the lead's sector, campaign or brief. Seven of
   them: local business, non-profit, hospitality, professional practice,
   retail and makers, events and screenings, ongoing growth. Each sets the
   colour, the opening paragraph, the three prompts and the offers ticked
   by default. Change it with one click if the guess is wrong.
2. **What we noticed.** Three boxes. The placeholders are questions, so
   you are answering rather than composing. Write what you saw: "Your
   Google profile has no opening hours." Not what will happen. Blank
   boxes are left out of the document.
3. **Offers.** The rate card, with the theme's usual pair already ticked.
   Fixed prices are read only. A "from" price can be confirmed upward.
4. **Issue.** The lead moves to Quoted, the document opens in a new tab,
   and **Copy cover email** puts a ready message on the clipboard with the
   price, the deposit, the link and the valid-until date.

## What it will not let you do

- **Type a price.** Every rand comes from `src/data/publicRateCard.ts`
  through the same maths as a quotation. A proposal cannot say a number
  the website does not.
- **Promise a result.** Title, findings and notes are checked against the
  same forbidden list as the ad copy and the service content. "Guarantee",
  "cheapest", "number one", "100%" and the rest stop the issue button.
- **Use an em dash.**

## Where it goes

The lead's activity log, as `proposal_issued`, the same way a quotation is
stored. The money inside it is a real quotation carrying the proposal
number, so:

- **Money, Quotes and payments** shows a priced proposal as awaiting its
  deposit.
- A deposit paid with the proposal number as reference matches it.
- The client card shows "Proposal P-260926-XXXX issued: A plan for ..."
  on the timeline.

A proposal with findings and no offers is a findings document. It moves
the lead to Findings sent, not Quoted, and does not appear as money owed.

## The document

`/admin/proposal/:leadType/:leadId/:number`, admin only. It reads the
proposal back by number, so what prints is exactly what was issued.
Inclusions come from the rate card with any published service content on
top, through the same merge as the public offer page, so the proposal and
the website never describe an offer differently.

It prints to A4 from the browser. On a phone it reads as a page.

## Changing the words

Themes live in `src/lib/proposals.ts`. Each carries Omni's own words about
a kind of business and nothing else: no statistics, no client names, no
claims about outcomes. The test suite checks every theme for that, so a
theme that promises something fails the build.
