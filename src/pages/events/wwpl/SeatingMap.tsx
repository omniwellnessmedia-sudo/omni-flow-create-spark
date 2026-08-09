import { quicketHref } from "./attribution";
import { useState } from "react";
import { BtnButton, BtnLink, Eyebrow, Reveal } from "./ui";
import { cn } from "@/lib/utils";

/**
 * The Masque Theatre house plan — READ-ONLY.
 *
 * WHY READ-ONLY, AND WHY IT MUST STAY THAT WAY
 * -------------------------------------------
 * The "Omni Screenings" design handoff proposed an Omni-owned booking surface:
 * clickable seats, a basket, tiers, a hold timer and checkout. That is not
 * buildable for this event and must not be added here.
 *
 *   - Quicket holds the AUTHORITATIVE seat plan. Laura Baasch (Quicket,
 *     27 Jul) confirmed The Masque "remains responsible for ... seating
 *     allocations", and that every attendee needs a separately scannable
 *     ticket and an allocated seat per session. Two systems selling the same
 *     physical chairs double-sells them — someone gets turned away on the day.
 *   - The Masque requires the seat plan stay in place to control capacity,
 *     wheelchair allocations and health-and-safety.
 *   - The page's own "buying with confidence" copy states that Omni is not a
 *     reseller and that checkout finishes on Quicket. An own checkout would
 *     contradict copy that is load-bearing for the Google Ads event-ticket
 *     certification.
 *
 * So this shows people the room and answers "where will I sit, is there
 * wheelchair access, how big is it" — then hands off to Quicket to actually
 * choose seats.
 *
 * NO AVAILABILITY IS SHOWN, DELIBERATELY. The handoff rendered "25 of 168
 * sold · live" from a hard-coded list, and generated a ~30% sold set for other
 * sessions from a seeded PRNG. That is fabricated scarcity presented as live
 * data — the same class of problem as the rejected BASE = 1284 petition count,
 * and it breaks this page's no-false-scarcity rule. Real-time availability
 * lives on Quicket; if we ever show it here it must come from Quicket, not
 * from us.
 *
 * The layout below is the plan supplied in the handoff's data.js. Verified:
 * 166 general + 2 wheelchair spaces = 168 sellable, matching its stated total.
 */

type Cell = "#" | "w" | "o";

interface Row {
  row: string;
  pat: string;
}

const HOUSE: Row[] = [
  { row: "AA", pat: "w#############oooow" },
  { row: "A", pat: "#################" },
  { row: "B", pat: "#########o#########" },
  { row: "C", pat: "########ooo########" },
  { row: "D", pat: "oo#################" },
  { row: "E", pat: "##################" },
  { row: "F", pat: "#######oo#########" },
  { row: "G", pat: "##################" },
  { row: "H", pat: "#################" },
  { row: "J", pat: "################" },
];

const GENERAL = 166;
const WHEELCHAIR = 2;
const TOTAL = GENERAL + WHEELCHAIR;

/**
 * Rows curve gently away from centre, as in a real auditorium:
 * translateY((t²)·7px) where t is normalised distance from the row's middle.
 * Purely decorative, so it is dropped under prefers-reduced-motion via the
 * motion-safe wrapper on the parent.
 */
const curveY = (index: number, len: number) => {
  const t = len <= 1 ? 0 : (index - (len - 1) / 2) / ((len - 1) / 2);
  return t * t * 7;
};

const SeatRow = ({ row, pat }: Row) => {
  const cells = pat.split("") as Cell[];
  let seatNo = 0;

  return (
    <div className="flex items-center justify-center gap-[var(--seat-gap)]">
      <span className="w-6 shrink-0 text-right font-wwpl-cond text-[10px] tracking-[.18em] text-wwpl-goldLight/50">
        {row}
      </span>
      <div className="flex items-end gap-[var(--seat-gap)]">
        {cells.map((c, i) => {
          if (c !== "o") seatNo += 1;
          const y = curveY(i, cells.length);
          const key = `${row}-${i}`;

          if (c === "o") {
            return (
              <span
                key={key}
                aria-hidden="true"
                className="grid place-items-center"
                style={{ width: "var(--seat)", height: "var(--seat)", transform: `translateY(${y}px)` }}
              >
                <span className="block h-[30%] w-[30%] rounded-full bg-wwpl-goldLight/20" />
              </span>
            );
          }

          const accessible = c === "w";
          return (
            <span
              key={key}
              aria-hidden="true"
              title={accessible ? `Row ${row} — wheelchair space` : `Row ${row}, seat ${seatNo}`}
              style={{ width: "var(--seat)", height: "var(--seat)", transform: `translateY(${y}px)` }}
              className={cn(
                "grid place-items-center rounded-full border",
                accessible
                  ? "border-wwpl-gold/70 bg-wwpl-gold/35"
                  : "border-wwpl-goldLight/25 bg-wwpl-goldLight/[0.14]"
              )}
            >
              {accessible && (
                <span className="block h-[45%] w-[45%] rounded-full bg-wwpl-gold" />
              )}
            </span>
          );
        })}
      </div>
      <span className="w-6 shrink-0 font-wwpl-cond text-[10px] tracking-[.18em] text-wwpl-goldLight/50">
        {row}
      </span>
    </div>
  );
};

const LegendItem = ({ swatch, label }: { swatch: React.ReactNode; label: string }) => (
  <span className="flex items-center gap-2 text-[12.5px] text-[rgba(249,245,240,.7)]">
    {swatch}
    {label}
  </span>
);

export const SeatingMap = () => {
  /* Below lg the plan collapses behind a toggle: it is ~1,100px of
     decorative, no-availability content compressed to unreadability on a
     phone, standing between the visitor and the conversion band below. */
  const [roomOpen, setRoomOpen] = useState(false);
  return (
  <section id="seating" className="scroll-mt-8 bg-wwpl-plum py-24">
    <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
      <Reveal className="mx-auto max-w-[60ch] text-center mb-12">
        <Eyebrow className="text-[13px] tracking-[.22em] text-wwpl-gold">The room</Eyebrow>
        <h2 className="mt-3 font-wwpl-display font-semibold text-[clamp(30px,5vw,42px)] leading-[1.12] text-white">
          Where you'll be sitting
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-[rgba(249,245,240,.7)]">
          The Masque is an intimate {TOTAL}-seat house — ten rows, no seat far from the screen.
          Every ticket is a specific, allocated seat.
        </p>
      </Reveal>

      <div className="mb-4 text-center lg:hidden">
        <BtnButton
          variant="ghostLight"
          aria-expanded={roomOpen}
          aria-controls="seating-plan"
          onClick={() => setRoomOpen((o) => !o)}
        >
          {roomOpen ? "Hide the room" : "See the room"}
        </BtnButton>
      </div>

      <Reveal
        id="seating-plan"
        className={cn(
          roomOpen ? "block" : "hidden",
          "lg:block rounded-2xl border border-[rgba(240,217,168,.18)] bg-[rgba(249,245,240,.03)] p-5 sm:p-8"
        )}
        /* Seat sizing scales with the viewport so the widest row (19 seats)
           always fits without a horizontal scrollbar, down to 320px. */
        style={
          {
            "--seat": "clamp(9px, 2.05vw, 20px)",
            "--seat-gap": "clamp(2px, 0.55vw, 6px)",
          } as React.CSSProperties
        }
      >
        {/* Screen / stage */}
        <div className="mx-auto mb-8 w-full max-w-[430px]">
          <div className="rounded-t-md border-x border-t border-wwpl-gold/40 bg-wwpl-gold/10 py-2 text-center font-wwpl-cond text-[11px] tracking-[.42em] text-wwpl-goldLight">
            SCREEN &amp; STAGE
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-wwpl-gold/60 to-transparent shadow-[0_0_18px_rgba(217,179,108,.5)]" />
        </div>

        {/* The plan itself is decorative for assistive tech — a grid of 168
            circles is noise to a screen reader. The equivalent information is
            given as text in the summary below, which is what actually helps. */}
        <div className="motion-safe:transition-opacity space-y-[var(--seat-gap)]" role="presentation">
          {HOUSE.map((r) => (
            <SeatRow key={r.row} {...r} />
          ))}
        </div>

        {/* Furniture. Centred and wrapping on small screens — space-between at
            360px orphaned the second "EXIT TO FOYER" onto its own line, which
            read as a layout bug rather than as the back of the room. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[rgba(240,217,168,.12)] pt-5 font-wwpl-cond text-[10px] tracking-[.22em] text-[rgba(249,245,240,.45)] sm:justify-between">
          <span>EXIT TO FOYER</span>
          <span>LIGHTING ROOM</span>
          <span>EXIT TO FOYER</span>
        </div>

        {/* Legend. gap-x-5 keeps all three on one line at 360px rather than
            orphaning "Not a seat". */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <LegendItem
            label="Seat"
            swatch={<span className="h-3.5 w-3.5 rounded-full border border-wwpl-goldLight/25 bg-wwpl-goldLight/[0.14]" />}
          />
          <LegendItem
            label="Wheelchair space"
            swatch={
              <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-wwpl-gold/70 bg-wwpl-gold/35">
                <span className="block h-[45%] w-[45%] rounded-full bg-wwpl-gold" />
              </span>
            }
          />
          <LegendItem
            label="Not a seat"
            swatch={
              <span className="grid h-3.5 w-3.5 place-items-center">
                <span className="block h-[30%] w-[30%] rounded-full bg-wwpl-goldLight/20" />
              </span>
            }
          />
        </div>
      </Reveal>

      {/* Text equivalent of the plan — this is what a screen reader gets, and
          it is also the honest summary: layout, not availability. */}
      <Reveal className="mx-auto mt-10 max-w-[62ch] text-center">
        <p className="text-[15px] leading-relaxed text-[rgba(249,245,240,.75)]">
          Ten rows — AA, A, B, C, D, E, F, G, H and J — with {GENERAL} seats plus{" "}
          {WHEELCHAIR} dedicated wheelchair spaces in row AA, level with the foyer entrance.
          The layout above is a guide to the room.{" "}
          <span className="text-wwpl-goldLight">
            Live availability and your exact seat are chosen on Quicket.
          </span>
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <BtnLink
            href={quicketHref()}
            target="_blank"
            rel="noopener"
            variant="gold"
            onClick={() => {
              const w = window as any;
              w.gtag?.("event", "quicket_click", { campaign: "stunningpigs", from: "seating-map" });
              w.tagClarityEvent?.("quicket_click", "stunningpigs");
            }}
          >
            Choose your seats on Quicket
          </BtnLink>
        </div>
        <p className="mt-4 text-[12.5px] text-[rgba(249,245,240,.5)]">
          Booking for a group? Assigned seating means you can sit together — book in one order.
          Wheelchair spaces come with a free companion seat; email us and we'll arrange it.
        </p>
      </Reveal>
    </div>
  </section>
  );
};
