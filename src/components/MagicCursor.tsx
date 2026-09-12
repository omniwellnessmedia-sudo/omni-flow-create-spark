import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * MagicCursor — a sparkle-trail custom cursor in Omni's brand colors.
 * - Cycles through omni-violet / omni-orange / omni-blue / primary teal
 * - Trails behind the pointer with an organic lag
 * - Scales + brightens on interactive elements (a, button, [role=button], [data-cursor=hover])
 * - Auto-disables on touch devices and when prefers-reduced-motion is set
 *
 * IT NO LONGER HIDES THE REAL CURSOR, and that was the whole of the "sticky
 * cursor" complaint. The native pointer used to be hidden everywhere except
 * form fields, so the only pointer on screen was the sparkle dot, and that
 * dot is drawn on a requestAnimationFrame loop: always at least one frame
 * behind where the mouse actually is, and further behind whenever the main
 * thread is busy loading forty photographs. The lag was real and it was the
 * only pointer the visitor had.
 *
 * A decoration is now a decoration. The system cursor stays visible and
 * instant, the sparkles trail behind it, and nothing about the brand flourish
 * is lost.
 *
 * The hover test also moved off mousemove and into the animation frame. It
 * walks up the DOM with closest(), a pointer can fire that over a hundred
 * times a second, and each React state change re-rendered eight sparkles plus
 * the dot. Once per frame, and only when the answer changes.
 */

type Trail = { x: number; y: number; key: number };

// HSL values pulled from src/index.css — keep these in sync if the brand changes.
const SPARKLE_COLORS = [
  "hsl(280 60% 70%)", // omni-violet
  "hsl(25 90% 70%)",  // omni-orange
  "hsl(200 60% 60%)", // omni-blue
  "hsl(180 50% 55%)", // primary teal
  "hsl(45 95% 75%)",  // omni-yellow
];

const TRAIL_LENGTH = 8;

// Admin, editors and dashboards are work surfaces: a decorative cursor there
// costs typing/scroll performance where it matters most and adds nothing.
const WORK_SURFACES = ["/admin", "/accountant", "/provider-dashboard", "/provider-portal"];

export const MagicCursor = () => {
  const { pathname } = useLocation();
  const onWorkSurface = WORK_SURFACES.some((p) => pathname.startsWith(p));
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef<HTMLElement | null>(null);
  const hoverRef = useRef(false);
  const trail = useRef<Trail[]>(
    Array.from({ length: TRAIL_LENGTH }, (_, i) => ({ x: -100, y: -100, key: i }))
  );

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A permanent rAF loop is a real cost on low-end hardware ("the site makes
    // my cursor lag") — skip the effect entirely on constrained devices.
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowEnd =
      (nav.deviceMemory !== undefined && nav.deviceMemory < 4) ||
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4);
    if (isTouch || reduced || lowEnd || onWorkSurface) {
      setEnabled(false);
      document.documentElement.classList.remove("magic-cursor-active", "magic-cursor-hide-native");
      return;
    }
    setEnabled(true);
    document.documentElement.classList.add("magic-cursor-active");
    // magic-cursor-hide-native is deliberately never added now. See the note
    // at the top of this file.
    document.documentElement.classList.remove("magic-cursor-hide-native");
    return () => document.documentElement.classList.remove("magic-cursor-active", "magic-cursor-hide-native");
  }, [onWorkSurface]);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      // The hover test is a walk up the DOM tree, so it is recorded here and
      // read once per frame rather than run on every mousemove. A pointer can
      // fire well over a hundred move events a second; the screen updates
      // sixty times.
      target.current = e.target as HTMLElement | null;
    };

    const tick = () => {
      // One closest() per frame, and setHovering only when the answer changes,
      // so a steady mouse movement over a link no longer re-renders eight
      // sparkles plus the dot on every event.
      const t = target.current;
      const hoverable =
        !!t && !!t.closest('a, button, [role="button"], [data-cursor="hover"], summary, label[for]');
      if (hoverable !== hoverRef.current) {
        hoverRef.current = hoverable;
        setHovering(hoverable);
      }

      // dot follows immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      // trail eases toward the previous sparkle, giving an organic lag
      let prev = pos.current;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const t = trail.current[i];
        t.x += (prev.x - t.x) * 0.28;
        t.y += (prev.y - t.y) * 0.28;
        const el = trailRefs.current[i];
        if (el) el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0)`;
        prev = t;
      }
      raf = requestAnimationFrame(tick);
    };

    // Pause the animation loop entirely while the tab is hidden.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* trailing sparkles */}
      {trail.current.map((t, i) => {
        const color = SPARKLE_COLORS[i % SPARKLE_COLORS.length];
        const size = 14 - i * 1.2;
        const opacity = (1 - i / TRAIL_LENGTH) * (hovering ? 1 : 0.85);
        return (
          <div
            key={t.key}
            ref={(el) => (trailRefs.current[i] = el)}
            style={{
              position: "absolute",
              left: -size / 2,
              top: -size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              opacity,
              willChange: "transform",
              transition: "opacity 200ms ease",
              filter: hovering ? "blur(0.5px) brightness(1.3)" : "blur(0.5px)",
            }}
          />
        );
      })}
      {/* leading dot */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          left: hovering ? -10 : -5,
          top: hovering ? -10 : -5,
          width: hovering ? 20 : 10,
          height: hovering ? 20 : 10,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, hsl(180 50% 55% / 0.9) 0%, hsl(280 60% 70% / 0.6) 60%, transparent 80%)",
          boxShadow:
            "0 0 12px hsl(180 50% 55% / 0.6), 0 0 24px hsl(280 60% 70% / 0.4)",
          willChange: "transform, width, height",
          transition: "width 200ms ease, height 200ms ease, left 200ms ease, top 200ms ease",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};

export default MagicCursor;
