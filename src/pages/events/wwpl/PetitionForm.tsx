import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { BtnButton, BtnLink } from "./ui";
import { PAGE_URL, PETITION_GOAL, PETITION_SLUG } from "./event";

/**
 * Petition sign-up.
 *
 * TRUTHFUL COUNTER — the design prototype hard-coded BASE = 1284 signatures
 * before anyone had signed. That was rejected: this page's entire argument is
 * that it is the trustworthy official source, and fabricated social proof on a
 * page making that claim is indefensible. The number rendered here is only ever
 * what the database returns, starting at zero. Never add an offset.
 *
 * POPIA — this collects personal data of South Africans. Omni Wellness Media
 * collects it; the named campaign partners (Beauty Without Cruelty and
 * G.A.R.D.) receive the petition and are the responsible parties. The consent
 * copy below states that, and the marketing checkbox is separate from the act
 * of signing and defaults to unchecked.
 *
 * FAILURE IS VISIBLE — the prototype optimistically swapped to a thank-you
 * state, which would silently drop a signature whenever the request failed.
 * Here the swap only happens after the server confirms, and on failure the
 * user's input is preserved with a real error message.
 */

const SIGNED_KEY = "sp-petition-signed";

type Status = "idle" | "submitting" | "done" | "error";

const fmt = (n: number) => n.toLocaleString("en-ZA");

export const PetitionForm = ({ onSigned }: { onSigned?: () => void }) => {
  const [count, setCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [alreadySigned, setAlreadySigned] = useState(false);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [updates, setUpdates] = useState(false);
  // Honeypot — must be named `website`: that is the field the edge function
  // checks. Real people never fill it; bots that autofill everything do.
  const [website, setWebsite] = useState("");
  // Absolute start time, not an elapsed figure — the function enforces a
  // minimum fill time of 3s and rejects a missing/zero value outright.
  const formStartedAt = useRef(Date.now());

  // Returning signers see the thanks state immediately. localStorage is UX
  // memory only — the server owns the truth.
  useEffect(() => {
    try {
      if (localStorage.getItem(SIGNED_KEY) === "1") setAlreadySigned(true);
    } catch {
      /* private mode — not important enough to surface */
    }
  }, []);

  // Public total. Failure here must not break the form, so the meter simply
  // stays hidden rather than showing a wrong or invented number.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Cast: src/integrations/supabase/types.ts is generated from the live
        // schema, and this function only exists once the petition migration has
        // been applied. Regenerate the types after deploying it and this cast
        // can go. Until then the call fails soft and the meter stays hidden —
        // it must never fall back to an invented number.
        const rpc = supabase.rpc as unknown as (
          fn: string,
          args?: Record<string, unknown>
        ) => Promise<{ data: unknown; error: unknown }>;
        const { data, error: err } = await rpc("get_petition_count", { p_slug: PETITION_SLUG });
        if (!cancelled && !err && typeof data === "number") setCount(data);
      } catch {
        /* leave count null */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Count up 0 → total once, on first arrival of a real number.
  useEffect(() => {
    if (count === null) return;
    let raf = 0;
    let t0: number | null = null;
    const step = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min(1, (ts - t0) / 1200);
      setDisplayCount(Math.round(count * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  const pct = count === null ? 0 : Math.min(100, (count / PETITION_GOAL) * 100);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    try {
      const { data, error: err } = await supabase.functions.invoke("sign-petition", {
        body: {
          first_name: first.trim(),
          surname: last.trim(),
          email: email.trim(),
          city: city.trim() || null,
          updates_consent: updates,
          petition_slug: PETITION_SLUG,
          source: "stunning-pigs-page",
          website, // honeypot
          form_started_at: formStartedAt.current,
        },
      });

      if (err) throw err;
      if (data?.error) throw new Error(data.error);

      // `count` is number | null — the server returns null rather than a guess
      // if the counter read fails, so leave the meter alone in that case.
      if (typeof data?.count === "number") {
        setCount(data.count);
        setDisplayCount(data.count);
      }
      try {
        localStorage.setItem(SIGNED_KEY, "1");
      } catch {
        /* ignore */
      }
      setStatus("done");
      onSigned?.();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't record your signature just now. Please try again."
      );
    }
  };

  const signed = status === "done" || alreadySigned;

  const inputCls =
    "w-full rounded-[10px] border border-wwpl-line bg-wwpl-creamSoft px-3.5 py-3 text-[15px] text-wwpl-ink " +
    "focus:outline-none focus:border-wwpl-gold focus:ring-[3px] focus:ring-[rgba(217,179,108,.22)]";
  const labelCls = "block text-[12.5px] font-semibold tracking-[.04em] text-wwpl-slate mb-1.5";

  if (signed) {
    return (
      <div className="rounded-[20px] border border-wwpl-line bg-white p-10 shadow-wwpl-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-wwpl-gold text-wwpl-plum text-[28px]">
          ✓
        </div>
        <h3 className="font-wwpl-display font-semibold text-[26px] text-wwpl-ink">
          Thank you — your voice is counted
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-wwpl-slate">
          We'll present every signature with the campaign. Share the petition so it travels further.
        </p>
        <BtnLink
          variant="ink"
          className="mt-6"
          href={`https://wa.me/?text=${encodeURIComponent(
            `Sign for humane standards — the Stunning Pigs petition: ${PAGE_URL}#petition`
          )}`}
          target="_blank"
          rel="noopener"
        >
          Share on WhatsApp
        </BtnLink>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-wwpl-line bg-white p-10 shadow-wwpl-md">
      <h3 className="font-wwpl-display font-semibold text-[24px] text-wwpl-ink">Add your name</h3>
      <p className="mt-1.5 text-[14px] text-wwpl-slate">
        Joined by ticket-holders, advocates and first-time supporters across the Cape.
      </p>

      {/* Meter renders only once a real number has loaded — never a placeholder. */}
      {count !== null && (
        <div className="my-6">
          <div className="flex justify-between text-[13px] text-wwpl-slate">
            <span>
              <b className="text-[15px] text-wwpl-ink tabular-nums">{fmt(displayCount)}</b>{" "}
              {displayCount === 1 ? "signature" : "signatures"}
            </span>
            <span>
              Goal: <b className="text-[15px] text-wwpl-ink tabular-nums">{fmt(PETITION_GOAL)}</b>
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-wwpl-cream">
            <i
              className="block h-full rounded-full bg-[linear-gradient(90deg,#9C7434,#D9B36C)] transition-[width] duration-[1.2s] ease-wwpl"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelCls} htmlFor="p-first">First name</label>
            <input id="p-first" className={inputCls} required autoComplete="given-name"
              value={first} onChange={(e) => setFirst(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="p-last">Surname</label>
            <input id="p-last" className={inputCls} required autoComplete="family-name"
              value={last} onChange={(e) => setLast(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls} htmlFor="p-email">Email</label>
          <input id="p-email" type="email" className={inputCls} required autoComplete="email"
            inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className={labelCls} htmlFor="p-city">City / town <span className="font-normal">(optional)</span></label>
          <input id="p-city" className={inputCls} autoComplete="address-level2"
            value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        {/* Honeypot — visually and programmatically hidden from real users. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="p-website">Website</label>
          <input id="p-website" tabIndex={-1} autoComplete="off"
            value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <label className="flex items-start gap-2.5 text-[13px] text-wwpl-slate">
          <input type="checkbox" className="mt-0.5 accent-[#9C7434]"
            checked={updates} onChange={(e) => setUpdates(e.target.checked)} />
          <span>Keep me posted on the campaign and the premiere.</span>
        </label>

        {error && (
          <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[13.5px] text-red-800">
            {error}
          </p>
        )}

        <BtnButton type="submit" variant="gold" disabled={status === "submitting"}
          className={cn("w-full", status === "submitting" && "opacity-70")}>
          {status === "submitting" ? "Signing…" : "Sign the petition"}
        </BtnButton>
      </form>

      {/* POPIA disclosure. Names the parties the signature is shared with —
          signing is the petition act; marketing contact is the separate,
          opt-in checkbox above. */}
      <p className="mt-4 text-center text-[12px] leading-relaxed text-wwpl-slate">
        Your details are used for this petition only. Signatures are collected by Omni Wellness
        Media and shared with campaign partners Beauty Without Cruelty and G.A.R.D., who present
        them to regulators and industry. Never sold. See our{" "}
        <a href="/privacy-policy" className="text-wwpl-goldDeep underline underline-offset-2">
          privacy policy
        </a>
        .
      </p>
    </div>
  );
};
