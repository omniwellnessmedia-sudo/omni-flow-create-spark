# Petition ask wording and data disclosure: project record

Two governed decisions, both taken 16 August 2026. Where any page, plan, deck
or draft conflicts with this file, this file wins.

No em dashes in this record, per the standing rule.

---

## 1. The Omni petition ask

**Changed from:**

> commit to achievable, more humane alternatives

**Changed to:**

> commit to identifying and adopting more humane alternatives

**Full reference sentence, as it now reads on the page:**

> Our petition asks South African regulators and industry to review
> high-concentration CO2 gas stunning and commit to identifying and adopting
> more humane alternatives.

**Reason.** The earlier wording asserted that alternatives exist, are more
humane, and are achievable. That is the same claim previously flagged for
sourcing as "alternatives in commercial use elsewhere". The new wording asks
without asserting and requires no external source.

**Confirmed by** Tumelo Ncube, with Chad Cupido, Executive Officer, Beauty
Without Cruelty South Africa, present.

**Status.** This is the reference version of the Omni ask. Do not soften it
further. Do not restore the earlier wording in any later pass, by any process,
for any reason.

**Implemented at** `src/pages/events/StunningPigs.tsx`, petition section.

---

## 2. Data disclosure on the signature form

**Live wording, above the form and before any input field:**

> Your signature is held by Omni Wellness Media. It has not been shared with
> any third party. This petition is being prepared for submission and your
> signature may be shared with campaign partner organisations for that
> purpose. We will confirm the recipient and submission date to signatories.
> We do not sell or trade your details and we do not use them for anything
> else unless you have opted in to updates.

**Two earlier positions, both wrong, both now removed.**

| Removed wording | Why it was wrong |
| --- | --- |
| "We do not share them." | True on the day, and it would have created a breach the moment a signature went to a partner. Sharing with campaign partners is the intended purpose of this petition, and POPIA requires intended recipients to be disclosed at the point of collection, not at the point of sharing. Every signature collected under that wording would have needed re-consenting before it could be shared. |
| "shared with campaign partners Beauty Without Cruelty and G.A.R.D., who present them to regulators and industry" | Nothing has been shared with anyone, so it was factually untrue. It also named two organisations as data recipients when neither has agreed in writing to be named as one, which commits them to something they have not accepted. |

**Standing rules for this block.**

- Name no partner organisation until that organisation has agreed in writing
  to be named as a data recipient.
- Name no final recipient and state no signature target until each is decided.
- Do not describe the petition as national, launched or live.
- The block stays above the form, at body size, never as fine print.
- The "Keep me posted" checkbox stays default unchecked. An enquiry or a
  signature is not consent. Only the ticked box is.

**Implemented at** `src/pages/events/wwpl/PetitionForm.tsx`.

---

## 3. Holding state on signatures collected to date

Recorded 15 August 2026. This is a record, not a feature. No holding state,
flag or UI has been built for it.

Every petition signature collected to date is in a holding state. It cannot be
presented, counted publicly, reported to any third party, or merged with any
BWC-sourced signature until two things are settled in writing:

1. The ask-wording decision, meaning whether both pages carry identical asks.
2. The data ownership question between Omni Wellness Media and Beauty Without
   Cruelty.

Omni Wellness Media, Beauty Without Cruelty and any foundation entity are
never commingled. Each output states which entity is speaking and in what
capacity.
