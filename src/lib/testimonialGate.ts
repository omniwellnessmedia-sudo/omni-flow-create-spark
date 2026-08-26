import type { Testimonial } from "@/data/testimonials";
import { BLOCKED_TERMS } from "@/data/blockedTerms";

/**
 * The consent gate. A testimonial renders if and only if this returns true.
 * There is no override flag, no preview mode, and no admin bypass: any
 * future "just show it" requirement must change the consent record itself,
 * on paper first.
 *
 * Two branches:
 *   A. Attributed publication: written consent scoped to commercial web.
 *   B. Anonymous publication: anonymous_permitted consent scoped to
 *      commercial web, fully stripped attribution, low re-identification
 *      risk, and a quote free of blocklisted names and places.
 * Audio and video sources additionally require an approved transcript on
 * BOTH branches: anonymity does not waive transcription.
 *
 * No em dashes in this file.
 */

/** Escape a term for literal use inside a RegExp. */
const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Case-insensitive, word-boundary match of a blocklisted term inside text.
 * Multi-word terms (e.g. "Cape Town", "de Klerk") match as a phrase with
 * boundaries at both ends.
 */
const containsTerm = (text: string, term: string): boolean =>
  new RegExp(`\\b${escapeRegExp(term)}\\b`, "i").test(text);

/** First blocklisted term found in the text, or null. */
export function firstBlockedTerm(text: string): string | null {
  for (const term of BLOCKED_TERMS) {
    if (containsTerm(text, term)) return term;
  }
  return null;
}

const transcriptionSatisfied = (t: Testimonial): boolean =>
  t.sourceMedium === "whatsapp_audio" || t.sourceMedium === "video"
    ? t.transcribed === true && t.speakerApprovedTranscript === true
    : true;

/**
 * Why a record is not publishable, as one human sentence, or null when it
 * is publishable. isPublishable derives from this so the gate and the
 * build audit can never disagree.
 */
export function blockingReason(t: Testimonial): string | null {
  const hasQuote = typeof t.quotePublished === "string" && t.quotePublished.length > 0;

  if (t.consent.status === "written") {
    if (!t.consent.scope.includes("commercial_web"))
      return "written consent does not cover commercial web publication";
    if (!hasQuote) return "no published span has been set";
    if (t.attributionMode === "anonymous" && t.attributionName !== null)
      return "attribution inconsistent: anonymous mode with a name set";
    if (!transcriptionSatisfied(t))
      return "audio or video source without a speaker approved transcript";
    return null;
  }

  if (t.consent.status === "anonymous_permitted") {
    if (!t.consent.scope.includes("commercial_web"))
      return "anonymous consent does not cover commercial web publication";
    if (!hasQuote) return "no published span has been set";
    if (t.attributionMode !== "anonymous")
      return "anonymous consent permits anonymous attribution only";
    if (t.attributionName !== null || t.attributionRole !== null || t.attributionOrg !== null)
      return "anonymous publication with attribution fields still populated";
    if (t.reidentificationRisk !== "low")
      return `re-identification risk is ${t.reidentificationRisk}, anonymous publication requires low`;
    const hit = firstBlockedTerm(t.quotePublished as string);
    if (hit !== null) return `published span contains blocked term "${hit}"`;
    if (!transcriptionSatisfied(t))
      return "audio or video source without a speaker approved transcript, anonymity does not waive transcription";
    return null;
  }

  return `consent status is "${t.consent.status}", publication requires "written" or "anonymous_permitted"`;
}

export function isPublishable(t: Testimonial): boolean {
  return blockingReason(t) === null;
}
