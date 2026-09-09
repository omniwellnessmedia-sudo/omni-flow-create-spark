# Design handoffs

Reference material from Claude Design. These are **references to build
from, not files to ship**. Nothing here is served to visitors.

## service-pack

The Omni service pack: spec, acceptance checklist, data and high fidelity
HTML references for /services, a service detail page, /enquire, /pricing
and /scorecard.

`data/services.json` is the useful part and is under test. See
`src/data/__tests__/handoffPrices.test.ts`, which pins every price in it
against `src/data/publicRateCard.ts`, the file the site actually reads.
Two files claiming to be the source of truth for a price is how a page
ends up advertising a figure nobody approved, so they are checked against
each other rather than one being trusted.

Two figures in the handoff are deliberately not published:

- Ten prepaid hours at R10,000 on executive-support. Withdrawn from the
  public page on 27 August 2026 because it implied R1,000 per hour and
  undercut the published hourly rate by a third. It returns only with
  written sign off on a block rate.
- Four downloadable kits at R199, R349, R499 and R799. None appears on the
  approved rate card.

### What is not committed

`service-pack/assets/` holds roughly 4MB of placeholder plate artwork that
the handoff itself says to replace with real photography. It is ignored
rather than carried in the repo. Recover it from the original zip if you
need it.

`data/media.json` lists Pixabay stock to download. The services hero uses
our own photograph from The Masque Theatre instead, which is truer to what
we sell and something we hold the rights to.

No em dashes in this file.
