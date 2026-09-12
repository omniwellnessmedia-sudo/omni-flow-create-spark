import * as React from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { transformedStorageUrl, DEFAULT_RENDER_WIDTH } from "@/lib/supabaseImage";

export type SmartImageFallbackCategory = keyof typeof IMAGES.fallbacks;

export interface SmartImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "loading"> {
  /** Primary image URL. May be undefined/null — SmartImage degrades gracefully. */
  src?: string | null;
  /** Explicit fallback tried immediately after `src` fails. */
  fallback?: string | null;
  /**
   * Category of generic fallbacks (from IMAGES.fallbacks) tried after `src`
   * and `fallback` are exhausted. Omit for images (e.g. partner logos) where
   * a generic photo would be misleading — the designed placeholder shows instead.
   */
  category?: SmartImageFallbackCategory;
  /** Load immediately (above the fold). Defaults to lazy + async decoding. */
  eager?: boolean;
  /** Browser fetch priority hint. Use "high" for the hero image. */
  fetchPriority?: "high" | "low" | "auto";
  /** CSS aspect-ratio (e.g. "16/9") to reserve space and prevent layout shift. */
  aspectRatio?: string;
  /**
   * Widest this image is ever drawn, in CSS pixels. Supabase storage images
   * are requested at roughly twice this so they stay sharp on a 2x screen,
   * instead of the camera original. Defaults to a size that covers every card
   * on the site; full bleed images should pass their own.
   *
   * Pass null to opt out entirely, for an image that must arrive untouched.
   */
  renderWidth?: number | null;
}

/**
 * SmartImage — structurally unbreakable <img>.
 *
 * Ordered fallback chain: src → fallback prop → IMAGES.fallbacks[category] →
 * designed placeholder (Omni rainbow gradient + ImageOff icon). A total
 * network failure never shows a broken-image glyph or alt-text splat.
 *
 * While loading, a skeleton shimmer is shown (disabled for users who prefer
 * reduced motion via Tailwind's motion-safe variant).
 */
const SmartImage = React.forwardRef<HTMLImageElement, SmartImageProps>(
  (
    {
      src,
      fallback,
      category,
      eager = false,
      fetchPriority,
      aspectRatio,
      renderWidth,
      alt = "",
      className,
      style,
      width,
      height,
      onError,
      onLoad,
      decoding,
      ...rest
    },
    ref
  ) => {
    const candidates = React.useMemo(() => {
      // A resized copy of src goes first, with the untouched original right
      // behind it. If Supabase image transformation is not enabled on this
      // project the first request errors and the second one is what loads,
      // which is exactly the behaviour before this existed. That is why the
      // optimisation can ship without being able to test the endpoint.
      const resized =
        renderWidth === null ? null : transformedStorageUrl(src, renderWidth ?? DEFAULT_RENDER_WIDTH);
      const chain = [resized, src, fallback, ...(category ? IMAGES.fallbacks[category] : [])];
      return chain.filter((url): url is string => Boolean(url)).filter(
        (url, index, all) => all.indexOf(url) === index
      );
    }, [src, fallback, category, renderWidth]);

    const [attempt, setAttempt] = React.useState(0);
    const [status, setStatus] = React.useState<"loading" | "loaded" | "failed">("loading");

    // Restart the chain if the source props change (e.g. carousel/rotation).
    const chainKey = candidates.join("|");
    React.useEffect(() => {
      setAttempt(0);
      setStatus("loading");
    }, [chainKey]);

    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        onError?.(event);
        setAttempt((current) => {
          if (current < candidates.length - 1) return current + 1;
          setStatus("failed");
          return current;
        });
      },
      [candidates.length, onError]
    );

    const handleLoad = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        onLoad?.(event);
        setStatus("loaded");
      },
      [onLoad]
    );

    const sizeStyle: React.CSSProperties = {
      ...style,
      ...(aspectRatio ? { aspectRatio } : {}),
    };

    // Entire chain exhausted (or no usable src at all): designed placeholder.
    if (status === "failed" || candidates.length === 0) {
      return (
        <div
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          style={{
            ...sizeStyle,
            ...(width != null ? { width } : {}),
            ...(height != null ? { height } : {}),
          }}
          className={cn(
            "flex items-center justify-center bg-muted bg-rainbow-subtle",
            // Intrinsically-sized slots (logos, w-full h-auto) would collapse to
            // the icon's height without a floor.
            !aspectRatio && width == null && height == null && "min-h-32 min-w-16",
            className
          )}
          data-smart-image="placeholder"
        >
          <ImageOff
            className="h-8 w-8 text-muted-foreground/70"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
      );
    }

    // React 18 only forwards fetchpriority when written in lowercase.
    const fetchPriorityAttr = fetchPriority
      ? ({ fetchpriority: fetchPriority } as Record<string, string>)
      : undefined;

    return (
      <img
        ref={ref}
        src={candidates[Math.min(attempt, candidates.length - 1)]}
        alt={alt}
        width={width}
        height={height}
        style={sizeStyle}
        loading={eager ? "eager" : "lazy"}
        decoding={decoding ?? "async"}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          status === "loading" && "bg-muted motion-safe:animate-pulse",
          className
        )}
        {...fetchPriorityAttr}
        {...rest}
      />
    );
  }
);
SmartImage.displayName = "SmartImage";

export { SmartImage };
export default SmartImage;
