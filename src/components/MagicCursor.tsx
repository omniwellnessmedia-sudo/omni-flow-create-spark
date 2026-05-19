import { useEffect, useRef, useState } from "react";

/**
 * MagicCursor — a sparkle-trail custom cursor in Omni's brand colors.
 * - Cycles through omni-violet / omni-orange / omni-blue / primary teal
 * - Trails behind the pointer with an organic lag
 * - Scales + brightens on interactive elements (a, button, [role=button], [data-cursor=hover])
 * - Auto-disables on touch devices and when prefers-reduced-motion is set
 * - Auto-disables inside text inputs / textareas / contenteditable so the native caret is visible
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

export const MagicCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef({ x: -100, y: -100 });
  const trail = useRef<Trail[]>(
    Array.from({ length: TRAIL_LENGTH }, (_, i) => ({ x: -100, y: -100, key: i }))
  );

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("magic-cursor-active");
    return () => document.documentElement.classList.remove("magic-cursor-active");
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      // Don't override native cursor on form fields / contenteditable
      const t = e.target as HTMLElement | null;
      const inField =
        !!t && (t.matches("input, textarea, select, [contenteditable=true], [contenteditable='']") ||
        !!t.closest("input, textarea, [contenteditable=true]"));
      document.documentElement.classList.toggle("magic-cursor-hide-native", !inField);

      const hoverable =
        !!t && !!t.closest('a, button, [role="button"], [data-cursor="hover"], summary, label[for]');
      setHovering(hoverable);
    };

    const tick = () => {
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

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
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
