/**
 * Affiliate disclosure.
 *
 * One component, one string, rendered on every surface that shows an
 * affiliate link. The wording is defined once here and never copy-pasted:
 * a disclosure that drifts between pages is worse than one that does not,
 * because the differences are what a regulator reads.
 *
 * Render this on any page carrying an outbound affiliate link, whatever the
 * programme (Viator, RoamBuddy, CJ, Awin, CameraStuff when reactivated).
 */

export const AFFILIATE_DISCLOSURE_TEXT =
  "We may earn a commission on purchases made through these links, at no extra cost to you.";

interface AffiliateDisclosureProps {
  /** Visual weight. "inline" sits under a link or card, "panel" is a bordered block. */
  variant?: "inline" | "panel";
  className?: string;
}

export const AffiliateDisclosure = ({
  variant = "inline",
  className = "",
}: AffiliateDisclosureProps) => {
  if (variant === "panel") {
    return (
      <aside
        className={`rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground ${className}`}
      >
        {AFFILIATE_DISCLOSURE_TEXT}
      </aside>
    );
  }

  return (
    <p className={`text-xs text-muted-foreground ${className}`}>
      {AFFILIATE_DISCLOSURE_TEXT}
    </p>
  );
};

export default AffiliateDisclosure;
