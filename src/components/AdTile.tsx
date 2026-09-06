import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fetchAdSlots, pickSlot, recordAdEvent, type AdSlot } from '@/lib/adSlots';
import { INK, SLATE, LINE, mono } from '@/components/services/spectrum';

/**
 * One house promo tile.
 *
 * RENDERS NOTHING when there is no live slot, which is the normal state.
 * A promo area that shows a placeholder when it has nothing to promote is
 * worse than an absent one: it takes space and teaches people to skip it.
 *
 * AN IMPRESSION IS COUNTED ONCE, and only after the tile has been in the
 * viewport for a moment. A tile scrolled past at speed, or rendered far
 * below the fold and never reached, is not an impression, and counting it
 * as one would flatter every campaign measured through it.
 *
 * It is labelled as promotional in the markup, because a house ad styled
 * like editorial content is the thing people object to.
 *
 * No em dashes in this file.
 */

const VISIBLE_MS = 1000;

const AdTile = ({ slotKey, className = '' }: { slotKey: string; className?: string }) => {
  const [slot, setSlot] = useState<AdSlot | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const slots = await fetchAdSlots(slotKey);
      if (cancelled) return;
      setSlot(pickSlot(slots, Math.random()));
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [slotKey]);

  useEffect(() => {
    const el = ref.current;
    if (!slot || !el || counted.current) return;

    // No IntersectionObserver means no honest way to tell whether this was
    // seen, so nothing is counted rather than counting a render.
    if (typeof IntersectionObserver === 'undefined') return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          timer = setTimeout(() => {
            counted.current = true;
            void recordAdEvent(slot.id, 'impression');
            io.disconnect();
          }, VISIBLE_MS);
        } else if (timer) {
          // Scrolled away before it counted. It was not seen.
          clearTimeout(timer);
          timer = undefined;
        }
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      io.disconnect();
    };
  }, [slot]);

  if (!slot) return null;

  const hue = slot.hue || INK;
  const isInternal = slot.cta_href.startsWith('/');
  const onClick = () => void recordAdEvent(slot.id, 'click');

  return (
    <aside
      ref={ref}
      aria-label="Promotion"
      className={`relative overflow-hidden rounded-[18px] bg-white p-6 ${className}`}
      style={{ border: `1px solid ${LINE}` }}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px]" style={{ background: hue }} />

      <p className="text-[10px] uppercase tracking-[.2em]" style={{ ...mono, color: SLATE }}>
        Promoted
      </p>

      {slot.image_url && (
        <img
          src={slot.image_url}
          alt=""
          loading="lazy"
          className="mt-4 aspect-[16/9] w-full rounded-lg object-cover"
        />
      )}

      <h3 className="mt-4 font-wwpl-display text-[22px] leading-tight" style={{ color: INK }}>
        {slot.title}
      </h3>

      {slot.body && (
        <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: SLATE }}>
          {slot.body}
        </p>
      )}

      {slot.cta_label && slot.cta_href && (
        <div className="mt-5">
          {isInternal ? (
            <Link
              to={slot.cta_href}
              onClick={onClick}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-white"
              style={{ background: hue }}
            >
              {slot.cta_label} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <a
              href={slot.cta_href}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              onClick={onClick}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium text-white"
              style={{ background: hue }}
            >
              {slot.cta_label} <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </aside>
  );
};

export default AdTile;
