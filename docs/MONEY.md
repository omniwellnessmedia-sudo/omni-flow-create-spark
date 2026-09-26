# Money: from quotation to receipt

Everything a client can be sent about money prints through one template
and is read back from one ledger. Nothing here needs a database change.

## The documents

| Document | Number | Where it comes from | Reference the client pays with |
|---|---|---|---|
| Quotation | `Q-260926-A1B2` | Build quote on a lead | its own number |
| Proposal | `P-260926-A1B2` | Build proposal on a lead | its own number |
| Deposit invoice | `INV-260926-A1B2-D` | Money, Invoice deposit | the quotation number |
| Balance invoice | `INV-260926-A1B2-B` | Money, Invoice balance | the quotation number |
| Invoice in full | `INV-260926-A1B2-F` | Money, Invoice in full | the quotation number |
| Receipt | `RCT-260927-1A2B` | Money, Receipt beside a payment | none, it is a receipt |

The day and the four character tail are the same across a job, so a bank
statement line reads as one job without a lookup.

## The flow

1. **Quote or propose** from the lead. The lead moves to Quoted.
2. **Invoice deposit** on Money, Quotes and payments. The deposit invoice
   is fifty percent, due on receipt, and opens for printing. The button
   only appears once, then it becomes Invoice balance.
3. **Record payment** when the money lands. The amount is prefilled with
   whatever is due next. A Receipt link appears beside the payment.
4. **Invoice balance** before handover. Due in seven days.
5. **Download ledger** for the accountant: invoices as debits, payments as
   credits, referenced to the quotation, one CSV.

Payments are recorded against the quotation and cover invoices oldest
first, so a deposit invoice is paid before a rand goes to the balance
invoice. An invoice past its due date reads Overdue on the screen and
counts in the "Invoiced, unpaid" tile.

## The template

`src/components/documents/DocumentShell.tsx`. Header with the document's
name and number, the two parties, the body, bank details with the
reference, the published terms, a footer with the legal name. Quotation,
invoice and receipt are that sheet with different words at the top. The
proposal keeps its own cover but uses the same pay and terms blocks.

A change to the company or the bank account reaches every document at
once. A test fails the build if the account number is typed anywhere
except `src/data/bankDetails.ts`.

## The company

`src/data/companyDetails.ts`. The legal name is the one on the bank
account. The trading name, location, website and email are the ones
already published. Two fields are empty because nobody has supplied them:

- **Registration number.** Fill it in and it appears on every document.
- **VAT number.** Fill it in and every invoice becomes a tax invoice with
  a VAT line at 15 percent on top of the rate card price. Until then no
  document adds VAT and none calls itself a tax invoice, and the published
  term "VAT treatment confirmed on quotation" stands.

Whether the rate card is meant to be VAT inclusive or exclusive is a
decision for Chad and the accountant. The code adds VAT on top, which is
the conservative reading; if the card is inclusive, say so and the maths
moves.

## What Accounting still owns

Orders, affiliate commissions, payouts, the entity portfolio and the Xero
export. Service work from the pipeline lives on Money and reaches the
accountant through Download ledger.
