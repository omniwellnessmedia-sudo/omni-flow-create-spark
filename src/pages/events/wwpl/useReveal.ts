import { useEffect, useRef, useState } from "react";

/**
 * One-way scroll reveal for the event landing page.
 *
 * IntersectionObserver rather than the prototype's scroll handler — same
 * thresholds and easing, but no un-throttled layout reads per scroll event.
 * Once revealed it never re-hides, and it disconnects itself, so a long page
 * of tiles does not keep observers alive after they have all fired.
 *
 * Reduced motion is handled by the CALLER via `motion-safe:` variants, so a
 * user who prefers reduced motion sees everything present and static. This
 * hook therefore starts `true` when the media query matches, so nothing can
 * ever be left invisible if the observer never runs.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(() => {
    if (typeof window === "undefined") return true; // prerender: render revealed
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;

    // Fires a little before the element reaches the fold, matching the
    // prototype's innerHeight * 0.92 trigger.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return { ref, shown };
};

/** Stagger delay in ms — the prototype's (index % 3) * 90ms. */
export const revealDelay = (index: number) => `${(index % 3) * 90}ms`;
