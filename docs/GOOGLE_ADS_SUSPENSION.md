# Omni paid Google Ads 396-986-7500: the suspension, and what actually unblocks it

Prepared 17 September 2026. Every fact below is sourced. Nothing here is
estimated, and the places where a number is missing are marked as missing
rather than filled with a guess.

## What the record says

| Item | Value | Source |
|---|---|---|
| Account | Omni paid, customer ID 396-986-7500 | Chad, 8 Sep 2026 |
| Payments profile | 2092-7452-5761 | Chad, 8 Sep 2026 |
| Suspended | again, on 7 September 2026 | Chad, 8 Sep 2026 |
| Amount shown past due | R2,985.42 | Chad, 8 Sep 2026 |
| Foundation Ad Grant, to stay separate | 768-770-9743 | Chad, 8 Sep 2026 |
| Conversion tag | AW-11266714886 | `src/lib/googleAds.ts` |
| Currency | ZAR | `docs/ADS_SETUP_RUNBOOK.md` |
| Site | https://omniwellnessmedia.co.za, live 14 Sep 2026 | this repo |

Source for the first five rows: Chad Cupido, from omniwellnessmedia@gmail.com,
8 September 2026 17:30, subject "Omni paid Google Ads 396-986-7500:
reconciliation needed before reactivation", to Tumelo, copying Feroza and
Zenith.

The word "again" matters. There was a "Google Ads Reactivation" item in the
7 May 2026 operations update, so this account has been through this before.

## First: this is probably not an appeal

An appeal is the instrument for a **policy** suspension. A balance of
R2,985.42 shown as past due points at a **billing** suspension, which is a
different thing with a different remedy. Filing a policy appeal against an
unpaid balance answers a question Google did not ask, and Google's own
guidance is that filing repeated or misdirected appeals gets appeal
processing paused.

**Tell them apart in thirty seconds.** Open the account and read the red
banner at the top.

- It names money, a balance, a declined card or a payment method → billing.
  Go to Route A.
- It names a policy, for example Suspicious payments, Circumventing
  systems, Unacceptable business practices, Misrepresentation, or
  Compromised site → policy. Go to Route B.

The suspension email says the same thing and is more precise: Google's
notification email identifies every violation the account was suspended
for. That email went to the account's own address. Find it before doing
anything else, because everything below depends on which of the two this
is, and right now nobody has quoted it.

## Before either route: the authorisation position

Chad's 8 September email closes with this, verbatim:

> No payment, reactivation, campaign or budget change, or action on the
> Foundation Ad Grant account is authorised at this stage. Once we have the
> evidence above, we can make a responsible go or no-go decision.

As of 17 September that email is unread in Tumelo's inbox and there is no
reply to it in the mailbox. So the blocker on this account is not Google.
It is an unanswered request from the account owner, made nine days ago.

The reconciliation Chad asked for is set out in the last section of this
file, ready to fill in. Producing it is what turns this into a decision.
If the position has since changed in a meeting, note that in the thread so
the record shows it, and carry on.

One hard line either way: the Foundation Ad Grant account 768-770-9743 is a
separate entity's account. Nothing in this process touches it, references
it, or appears in the same submission as it.

## Route A: billing suspension, past due balance

Not an appeal. In order:

1. **Reconcile first** (the table below). Specifically settle whether the
   R2,985.42 is genuinely owed. Chad's point is that the R6,000 promotional
   offer required R6,000 of *eligible advertising spend to accrue within 60
   days of the code being entered*, and that a payment on its own did not
   earn the credit. If the balance assumes a credit that was never earned,
   or was earned and not applied, the number is wrong and paying it blind
   locks in the error.
2. **If the balance is correct**, the remedy is to pay it and, if asked,
   re-verify the payment method. Google may ask for payment method
   verification within 30 days. That is a request to satisfy, not to argue.
3. **If the balance is disputed**, do not appeal. Contact billing support
   from inside the account with the reconciliation attached. A draft of
   that message is below.
4. Only then decide go or no-go on reactivation.

### Draft: billing support message (fill the brackets, delete what does not apply)

> Account: Omni Wellness Media, customer ID 396-986-7500
> Payments profile: 2092-7452-5761
>
> Our account was suspended on 7 September 2026 with R2,985.42 shown as
> past due. We are asking you to review how that balance was calculated
> before we settle it.
>
> A promotional offer with a R6,000 credit was applied to this account on
> [DATE CODE ENTERED]. Our understanding of the terms is that the credit is
> earned once R6,000 of eligible advertising costs accrue within 60 days of
> the code being entered, and that a payment alone does not earn it. Our
> records show eligible spend of [AMOUNT] in that window, against a credit
> of [AMOUNT SHOWN AS APPLIED] on the account.
>
> Please confirm: the eligible spend accrued in the qualifying window, the
> credit amount earned, the credit amount applied, and how the current
> balance of R2,985.42 was arrived at. If the balance is correct after that
> review we will settle it immediately.
>
> [NAME], [ROLE], Omni Wellness Media

Do not send that until the bracketed figures come from the account, not
from memory.

## Route B: policy suspension

Only if the banner names a policy. Read these two things first, because
they change how carefully this has to be written:

- Google reinstates accounts "only in compelling circumstances, such as in
  the case of a mistake", so the appeal has to be thorough, accurate and
  honest, and it gets roughly one good shot.
- Some policies, among them Circumventing systems, Unacceptable business
  practices and Misrepresentation, are treated as egregious: suspension on
  detection without warning, and no further advertising.

**Where the form is.** In the account, use the Contact Us link inside the
suspension notification at the top of the screen. That link opens the
appeal form already attached to this suspension, which is why it is better
than any general contact route. The suspension email carries the same link.

**Fix the cause before appealing.** An appeal that says "we have reviewed
and corrected X" beats one that says "we did nothing wrong", unless nothing
was in fact wrong. Two things on the Omni site are worth checking against
the policy Google names, because both were real and both are recent:

- The storefront carried an unvetted third party affiliate product feed. A
  curation gate now holds products back until a person features them, and
  on 15 September that gate was found to have been throwing on every
  shopper read, so the catalogue was showing nothing. See
  `src/config/catalogueGate.ts`. If Google's reviewer saw an unvetted or
  broken storefront, that is relevant to a Misrepresentation or
  Unacceptable business practices finding.
- The site advertises services at published prices. Confirm every price a
  visitor can reach still matches `src/data/publicRateCard.ts`, and that
  the business name, contact details and terms pages resolve.

### Draft: policy appeal (fill the brackets, cut anything not true)

> Account: Omni Wellness Media, customer ID 396-986-7500
> Suspension notice dated: [DATE ON THE NOTICE]
> Policy named in the notice: [QUOTE THE POLICY NAME EXACTLY]
>
> What we are. Omni Wellness Media is a media and marketing company based
> in Muizenberg, Cape Town, South Africa, operating at
> omniwellnessmedia.co.za. We sell media production, web development and
> marketing services to small businesses and wellness practitioners, at
> prices published on our own site. We advertise only our own services, on
> our own domain, in our own name.
>
> What we understand the finding to be. [ONE OR TWO SENTENCES, IN YOUR OWN
> WORDS, SAYING WHAT GOOGLE FOUND. IF YOU DO NOT UNDERSTAND IT, SAY SO
> PLAINLY AND ASK WHICH AD, ASSET OR PAGE IT REFERS TO.]
>
> What we found when we checked. [WHAT YOU ACTUALLY FOUND. IF YOU FOUND THE
> PROBLEM, NAME IT. IF YOU FOUND NOTHING, SAY THAT YOU REVIEWED X, Y AND Z
> AND DESCRIBE WHAT YOU CHECKED.]
>
> What we have changed. [ONLY CHANGES ALREADY MADE AND LIVE. DATES. DO NOT
> LIST INTENTIONS.]
>
> Why we believe the account can run safely now. [THE CONTROLS THAT EXIST
> NOW, NOT PROMISES.]
>
> We are not asking for any exception to the policy. If our reading of it
> is wrong, please tell us which ad, asset or landing page is at issue and
> we will correct it.
>
> [NAME], [ROLE], Omni Wellness Media, [PHONE], [EMAIL]

Rules for filling that in, which matter more than the wording:

- Every sentence must be true and checkable. A single overstatement in an
  appeal is worse than a weak appeal.
- Do not promise future behaviour. Describe what is already done.
- Do not mention the Foundation, the Ad Grant account, or any other entity.
- One appeal. Wait for the outcome. Re-appeal only if it is rejected and
  you have something new, not the same text again.

## The reconciliation Chad asked for, ready to fill

From the account, not from memory. Chad's list, verbatim in substance.

**Billing**

| Field | Value | Where |
|---|---|---|
| Current balance | | Billing, Summary |
| Amount past due | R2,985.42 as reported 7 Sep, confirm | Billing, Summary |
| Invoice number and date | | Billing, Documents |
| Last payment amount and date | | Billing, Transactions |
| Payment method on file, status | | Billing, Payment methods |
| Any payment hold or verification request | | Billing, and the banner |

**The R6,000 promotion**

| Field | Value | Where |
|---|---|---|
| Date the code was entered | | Billing, Promotions |
| Offer terms as shown | | Billing, Promotions |
| Eligible spend accrued within 60 days of entry | | Billing, Transactions |
| Credit earned | | Billing, Promotions |
| Credit applied | | Billing, Transactions |
| Expiry date | | Billing, Promotions |

**Campaigns**

One row each: campaign name, type, start and end dates, daily budget, total
spend, current status, and who enabled or changed it and when. Campaigns,
then Change history for the last column.

**Conversions**

One row each: action name, category, status, conversions recorded, and
whether it is primary or secondary. Goals, Summary.

**Account health**

| Field | Value | Where |
|---|---|---|
| Advertiser verification status | | Admin, then Account settings |
| Policy issues listed against the account | | the suspension banner and email |
| Exact wording of the suspension notice | | banner and email, quote it |

The last row is the one that decides Route A or Route B, so get it first.
