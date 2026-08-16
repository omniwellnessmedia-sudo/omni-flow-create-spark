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

---

## 4. Search strings for future sweeps

Our verification method is full-text sweeping. A sweep only works if it uses
the character form the source actually stores. Recorded 16 August 2026 after a
codepoint inspection of the repo.

**The rendered page shows a subscript and that is correct typographically. It
stays. This section exists so a sweep does not report a false clean.**

Three different forms of carbon dioxide are stored in this repo:

| Where | Stored as | Codepoint |
| --- | --- | --- |
| `src/pages/events/StunningPigs.tsx` (the petition page, 2 occurrences) | `CO₂` Unicode subscript two | U+2082 |
| `src/pages/PrivacyPolicy.tsx` | `CO<sub>2</sub>` HTML markup | n/a, markup |
| This record and all source documents | `CO2` plain digit two | U+0032 |

**A sweep for the plain string `CO2` will not match the petition page.** It is
stored as `CO₂`.

Use this regular expression, which catches all three forms plus the common
HTML entities:

```
CO(2|₂|<sub>\s*2\s*</sub>|&#8322;|&#x2082;|&sub2;)
```

Case insensitive. If a future sweep for carbon dioxide claims returns no hits
on the petition page, the sweep string is wrong, not the page.

The same trap applies to any character that has a typographic variant. Before
concluding a sweep is clean, check the source form, not the rendered form.

---

## 5. Open gates as at 16 August 2026

1. Whether Beauty Without Cruelty adopts the same ask wording or runs its own
   ask. Owner: Chad Cupido.
2. Whether Beauty Without Cruelty agrees in writing to be named as a recipient
   of Omni-collected petition signatures. Owner: Chad Cupido.
3. The responsible party for signatures collected on the BWC page. Owner: Chad
   Cupido and BWC.
4. Whether G.A.R.D. agrees to be named as a data recipient. Nobody has asked
   them yet. Owner: unassigned.

Also unresolved: the petition recipient, the signature target, and what happens
once the target is reached.

**Until these close, the petition page runs passively. No campaign, paid
promotion or email drives traffic to it.**
