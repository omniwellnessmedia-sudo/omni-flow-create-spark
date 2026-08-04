# Partner tracking links — Celebrating Women Who Protect Life

Give each partner **their own link** below when they post about the event.
Anyone clicking it lands straight on the Quicket booking page, and the tag on
the end tells our analytics which partner sent them — so we can see (and show
partners) what their post actually drove.

Every link points at the same place. Only the `utm_source` tag differs.

## The links

**Creator partner** *(placeholder slug — rename when the partnership is confirmed, see below)*

```
https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/?utm_source=creator-partner&utm_medium=partner&utm_campaign=stunning-pigs-2026
```

**Beauty Without Cruelty**

```
https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/?utm_source=bwc&utm_medium=partner&utm_campaign=stunning-pigs-2026
```

**G.A.R.D.**

```
https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/?utm_source=gard&utm_medium=partner&utm_campaign=stunning-pigs-2026
```

**The Masque Theatre**

```
https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/?utm_source=masque&utm_medium=partner&utm_campaign=stunning-pigs-2026
```

**Vegan Streetfood**

```
https://www.quicket.co.za/events/386047-celebrating-women-who-protect-life-featuring-the-cape-town-premiere-of-stunning/?utm_source=vegan-streetfood&utm_medium=partner&utm_campaign=stunning-pigs-2026
```

## Adding a new partner yourself

Copy any link above and change **only** the `utm_source=` value to the new
partner's slug. Nothing else changes — ever.

Slug rules, so the reports stay clean:

- lowercase, hyphens instead of spaces (`vegan-streetfood`, not `Vegan Streetfood`)
- pick one slug per partner and never vary it — `bwc` and `beauty-without-cruelty`
  would show up as two different partners in the reports
- add the partner and their link to this file, so this list stays the register

The scheme, for reference:

| Tag | Value | Meaning |
|---|---|---|
| `utm_source` | partner slug | who shared the link |
| `utm_medium` | `partner` (always) | it came from a partner, not an ad |
| `utm_campaign` | `stunning-pigs-2026` (always) | which campaign |

## Things to know

- **`utm_medium=partner` is reserved for partners.** Paid ads keep their own
  tagging (Google Ads tags itself automatically). Don't reuse these links in
  ad campaigns or the partner reports become meaningless.
- **These links skip our event page on purpose** — a partner's audience is
  already warm, so they go straight to tickets. Anything we publish ourselves
  should keep linking to `omniwellnessmedia.co.za/events/stunning-pigs`.
- **Attribution depends on our GA4 tag being on the Quicket listing**
  (property `G-X9DQ4DEHNB`; The Masque approved adding it on 29 Jul). Until
  Quicket confirms the tag is live, clicks on these links still work fine —
  they just won't appear in our GA4 reports, only in Quicket's own stats.
- The link keeps working if extra tags are added after it, but don't shorten
  or rewrap these through third-party shorteners that strip query strings —
  test the final link once before a partner posts it.
