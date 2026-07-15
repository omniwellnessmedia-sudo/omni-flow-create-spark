/**
 * textFromHtml — robust HTML → plain text conversion.
 *
 * The blog WYSIWYG stores HTML, but several surfaces need clean prose:
 * excerpt derivation, admin list previews (which were rendering literal
 * "<ul><li><br></li></ul>" for empty drafts), and word counts.
 *
 * Strategy: pad block-level tag boundaries with a space (so "<p>a</p><p>b</p>"
 * becomes "a b", not "ab"), let DOMParser do the real tag stripping + entity
 * decoding, then collapse all whitespace runs to single spaces.
 */

const BLOCK_BOUNDARY =
  /<\/?(?:p|div|li|ul|ol|h[1-6]|blockquote|br|hr|tr|td|th|thead|tbody|table|section|article|header|footer|figure|figcaption|pre|address)(?:\s[^>]*)?\/?>/gi;

/** Convert an HTML (or already-plain) string to whitespace-collapsed plain text. */
export function textFromHtml(html: string | null | undefined): string {
  if (!html) return "";
  // Fast path: nothing that looks like markup or an entity — just tidy whitespace.
  if (!/[<&]/.test(html)) return html.replace(/\s+/g, " ").trim();
  try {
    const spaced = html.replace(BLOCK_BOUNDARY, " $&");
    const doc = new DOMParser().parseFromString(spaced, "text/html");
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  } catch {
    // Extremely defensive fallback (DOMParser is available in all target browsers).
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}

/** Count words in an HTML (or plain) string. Empty content counts as 0. */
export function countWordsFromHtml(html: string | null | undefined): number {
  const text = textFromHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

/** Derive a plain-text excerpt from HTML, truncated with an ellipsis. */
export function excerptFromHtml(
  html: string | null | undefined,
  maxLength = 200
): string {
  const text = textFromHtml(html);
  if (text.length <= maxLength) return text;
  // Cut on a word boundary where possible so excerpts don't end mid-word.
  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}
