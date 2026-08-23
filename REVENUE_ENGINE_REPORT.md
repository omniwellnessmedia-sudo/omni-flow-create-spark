# Revenue Engine Report

Branch: `feat/revenue-engine`. Date: 23 August 2026. All work in small commits, no force pushes, no secrets committed. This report is item 7 of the brief plus the six findings the brief asked for.

## 1. Production determination

**Production is Netlify, deployed automatically from merges to `main` of this repository.** The brief's claim that production is AWS and not Netlify is not correct, and the stale project it pointed at is real but is not production.

Evidence:

- Every pull request on this repository carries the commit status `netlify/omniwellnessmedia/deploy-preview` with a target of the form `deploy-preview-<n>--omniwellnessmedia.netlify.app` (verified live on PR #50 via the GitHub API). The GitHub linked Netlify project is therefore named `omniwellnessmedia`.
- Ten merges to `main` during August 2026 (PRs #41 to #50) each produced a production deploy, and the deployed changes were confirmed visible on omniwellnessmedia.co.za by the team after each merge. The `/awards` certificate register, implemented by `netlify/functions/awards.mjs` in this repo, serves live on the production domain: only a Netlify deploy of this repo can be doing that.
- The Netlify project `omniwellnessmedia-v2` (id `810d9c31-db1b-4175-ac3b-99794a507344`, visible in the connected Netlify account) had its last deploy on **26 March 2026**: a manual upload with no commit ref, no branch, no functions and one redirect rule, against this repo's many header rules and the awards function. It is stale and is **not** production. Per the brief it was not deployed to, deleted, or modified in any way.
- Netlify serves from AWS infrastructure, which is why IP lookups of the domain resolve to AWS ranges. That observation does not contradict Netlify hosting.
- Limitation: this sandbox's egress policy blocks direct requests to omniwellnessmedia.co.za (proxy 403), so header capture from the live domain was not possible here. The determination rests on the Netlify API, the GitHub deploy statuses, and the observed merge to production behaviour across ten PRs.

**Decision rule outcome: pipeline confirmed safe.** All work still sits on `feat/revenue-engine` unmerged, because merging is the team's call, and a PR is the smaller reversible option.

## 2. Router versus sitemap

The old `public/sitemap.xml` (49 URLs, hand maintained, lastmod 2026-05-03) disagreed with the router in these ways:

- `/blog` was listed but the router redirects it to `/`. A redirecting URL in a sitemap wastes crawl budget and is now gone.
- The tour fork was listed on both sides: `/tours/great-mother-cave-tour` AND `/tour-detail/great-mother-cave-tour`, plus `/tour-detail/winter-wine-country-wellness`, splitting duplicate content signals.
- All five commerce routes were listed (`/store`, `/roambuddy-store`, `/esim-store`, `/wellness-deals`, `/wellness-roaming-packages`).
- `/screenings`, the highest intent commercial page on the site, was **missing**.
- `/partner-portal` (an operator surface) was listed.

The sitemap is now generated from the route registry (`npm run sitemap`, and again into `dist/` at build time): 46 canonical URLs, no redirects, no noindex surfaces. Fixes shipped in this branch:

- `/tour-detail/:id` 301s to `/tours/:id` (server rule in `_redirects` plus a param preserving client redirect); `/tours/:id` added as the canonical dynamic route with the named static pages ranking above it.
- Commerce collapse: `/store`, `/store/collections/*` and `/wellness-deals` 301 to `/marketplace`; `/esim-store` and `/wellness-roaming-packages` 301 to `/roambuddy-store`. Reasoning: `/marketplace` (UnifiedMarketplace) is the goods surface and already merges the local business catalogue; `/roambuddy-store` is the established connectivity surface that two older routes already redirected to. `/store/product/:id` deep links deliberately keep resolving.

Thin or defective routes logged, not changed:

- `TourCategory` redirects unknown slugs to `/tours-retreats/<slug>` via `window.location`, but no such route exists; that path 200s into the SPA and NotFounds. Latent bug, one line in `src/pages/TourDetail.tsx:134` as well.
- `/experience/:id` duplicates tour detail; its canonical tag now points at `/tours/<slug>` so it no longer competes.
- `/community` and `/community-blog` serve the same component (canonical: `/community`).

## 3. Pre-existing analytics

The brief said there were no analytics. **Wrong: a full stack is already live** and was left intact:

- GA4 `G-X9DQ4DEHNB`, hardcoded in `index.html`, firing the initial page_view.
- Google Ads `AW-11266714886` with live conversion labels in `src/lib/googleAds.ts` (contact_submit, booking_inquiry, provider_signup_start, marketplace_clickthrough and others).
- Microsoft Clarity, plus placeholder (no-op) Meta, TikTok and LinkedIn pixels in `src/lib/socialPixels.ts`.

Task 5 was therefore implemented as a reconciliation: the hardcoded install stays (removing it in favour of an env var would silently kill analytics on any deploy without the var), `VITE_GA4_ID` is supported as an optional additional or replacement ID, SPA navigations now fire page_view (they previously did not, so GA undercounted every session's depth), and the four revenue events are wired: `deposit_click`, `whatsapp_click`, `booking_submit`, `esim_click`. Everything is a silent no-op when unconfigured.

## 4. Supabase RLS review (from migrations)

Reviewed all migrations in `supabase/migrations/`. One live hole, one weakness, several by design exposures, several past holes already fixed:

- **LIVE HOLE, tour_bookings:** migration `20250714011000` created `"Staff can view all bookings" FOR SELECT USING (auth.role() = 'authenticated')`. The security fix migration `20250825055502` rebuilt the user and admin SELECT policies **but never dropped this one**. Policies are OR'd, so **any self registered account can still read every tour booking**: names, emails, phones, special requirements. Fix is a one statement migration (`DROP POLICY "Staff can view all bookings" ON public.tour_bookings;`). Not shipped here: the repo's migration replay is broken (see below), and the team applies migrations by hand in the SQL editor at the moment; this statement should be run there.
- **Weak:** `"Authenticated users can view provider contact info"` exposes provider contact details to any logged in account, not just to clients with a booking relationship.
- By design public reads: verified provider profiles, approved testimonials, reviews, community posts, brands, published products and deals, feature flags, time slots. Reasonable for a marketplace.
- Already fixed in later migrations (no action needed): public UPDATE on `orders` and `booking_leases` (now service role only), public UPDATE on `newsletter_subscribers` and `chatbot_conversations` (dropped), public SELECT on `contact_submissions` (now admin only).
- **Broken migration:** an early migration references `public.orders` before it exists, so a full replay fails on every Supabase preview branch (repo issue #45). Any new migration ships behind that failure, which is why database changes currently go through the SQL editor by hand.

## 5. Viator affiliate attribution

`/viator-wellness-experiences` links out via `useConsciousAffiliate.generateAffiliateLink`, which builds
`https://www.viator.com/partner-shop/omniwellnessmedia/?medium=link&medium_version=shop&campaign=omni-wellness`.
This is a **partner shop URL, not a tagged affiliate link**: there is no `pid`/`mcid` (Viator partner programme) parameter anywhere in the repo. If the `omniwellnessmedia` partner shop account is active, Viator attributes bookings made inside the shop; anything that navigates away from the shop earns nothing. Action for the team: confirm the partner shop account status in the Viator partner centre, and if a standard affiliate `pid` exists, add it to `generateAffiliateLink` (one function, one line).

## 6. Hot linked external images

**None.** A full repo scan for `irp.cdn-website.com` and Duda CDN hosts found zero image references. Site imagery is served from the repo (`public/`) and from the project's own Supabase storage bucket. The `src/components/duda/` directory is admin tooling for a Duda API integration, not image hotlinking. No migration work needed.

## 7. Environment variables, decisions, and larger items

**Environment variables** (list only, none committed, none required for the site to work):

| Variable | Purpose | Behaviour when absent |
|---|---|---|
| `VITE_GA4_ID` | Optional additional or standalone GA4 ID | Hardcoded GA4 continues; module no-ops |
| `TOURS_FROM_SUPABASE` | `1` enables build time fetch of published tours for sitemap and prerender | Static route list used |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Already in the repo's `.env` (Lovable convention; the publishable anon key is public by design) | n/a |

No service role key appears anywhere in the build, and none must ever be added.

**Ambiguity decisions taken (smaller reversible option each time):**

1. **Offers as typed config, not a Supabase table.** Migration replay is broken (issue #45) and payment links change rarely and need review like copy. The `Offer` shape is 1:1 with a future table.
2. **Every offer ships `active: false`.** No live payment URL exists in the repo and inventing one would present planned work as operational, which this codebase's standing rule forbids. Activation per offer: create the Quicket (or later Ozow/PayFast) checkout link, paste it into `src/config/offers.ts`, set `active: true`. Return URLs should carry `?offer=<slug>`; `/payment-success` and `/payment-cancelled` already handle them.
3. **Commerce collapse mapping** as in item 2 (goods to `/marketplace`, connectivity to `/roambuddy-store`), with product deep links preserved. Restoring any collapsed page is a two line revert.
4. **Prerender is head only for most routes; static body shells only for `/tours-retreats`, `/tours` and `/services`.** A generic body shell on all 38 routes would flash before React paints, and a wrong shell is worse than none.
5. **Hardcoded GA4 kept** alongside the env var (item 3).
6. **Nothing merged.** Pipeline is confirmed (item 1), but merge to production stays the team's call.

**Materially larger than the brief assumed, flagged with a smaller proposal:**

- True static rendering (full HTML per route, hydration) means moving the build to SSG tooling; the shipped approach (per route head surgery plus targeted body shells on the proven prerender mechanism) captures most of the crawler value at a fraction of the risk. Proposal: measure indexation for four weeks via Search Console before deciding on SSG.
- The deposit engine intentionally stops at plain checkout URLs. Automated reconciliation (webhooks writing deposits into Supabase) needs an Ozow or PayFast merchant account first; when one exists, the `offers` shape and the return pages are already in place.
