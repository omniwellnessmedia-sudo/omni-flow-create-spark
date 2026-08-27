/**
 * Testimonial consent register, public half.
 *
 * GOVERNANCE, read before touching anything here:
 *
 * 1. A testimonial renders only when its consent record explicitly permits
 *    commercial web publication. The default state for every record is not
 *    published. There is no override flag, no draft preview that renders
 *    publicly, and no admin toggle that bypasses the gate in
 *    src/lib/testimonialGate.ts.
 * 2. Quotes are verbatim. The only permitted transformations are stripping
 *    emoji, normalising whitespace, and trimming to a contiguous span.
 *    Never invent, paraphrase, complete or improve a quote.
 * 3. THIS REPOSITORY IS PUBLIC. quoteVerbatim is therefore committed ONLY
 *    for records whose text is already cleared for publication. For every
 *    other record it stays an empty string and the received text lives in
 *    the private consent register: committing an unconsented WhatsApp
 *    message or a personal disclosure to a public repository would itself
 *    be the breach this file exists to prevent.
 * 4. anonymous_permitted means the record may render with
 *    attributionMode "anonymous" only, and never with a name, role or
 *    organisation. Anonymity does not waive audio transcription approval.
 * 5. No em dashes anywhere in this file.
 */

export type ConsentStatus =
  | "none"
  | "requested"
  | "written"
  | "anonymous_permitted"
  | "withdrawn";

export type ConsentScope = "commercial_web" | "internal_only" | "print";

export interface Testimonial {
  /** Slug, stable, never reused. */
  id: string;
  /** Exactly as received, emoji stripped. Empty when the text is not yet
   *  cleared for publication: see governance note 3 above. */
  quoteVerbatim: string;
  /** The trimmed span actually rendered, null until consented. */
  quotePublished: string | null;
  attributionName: string | null;
  attributionRole: string | null;
  attributionOrg: string | null;
  attributionMode: "full_name" | "first_name" | "initials" | "anonymous";
  sourceMedium: "whatsapp_text" | "whatsapp_audio" | "email" | "video";
  /** ISO date the message was received. */
  sourceDate: string;
  /** Audio only: false blocks render regardless of consent. */
  transcribed: boolean;
  speakerApprovedTranscript: boolean;
  consent: {
    status: ConsentStatus;
    scope: ConsentScope[];
    obtainedOn: string | null;
    obtainedVia: string | null;
    requestedBy: string | null;
  };
  /** How likely an anonymous reader is to identify the speaker. */
  reidentificationRisk: "low" | "medium" | "high";
  reidentificationNotes: string | null;
  notes: string | null;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "michelle-t",
    quoteVerbatim:
      "A phenomenal event. So deeply moving, and fun at the same time. Let's hope it's the first of many more.",
    quotePublished:
      "A phenomenal event. So deeply moving, and fun at the same time. Let's hope it's the first of many more.",
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_text",
    sourceDate: "2026-08-11",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "anonymous_permitted",
      scope: ["commercial_web"],
      obtainedOn: "2026-08-26",
      obtainedVia: "Approved for anonymous publication by Tumelo Ncube, filed in consent register",
      requestedBy: "Tumelo Ncube",
    },
    reidentificationRisk: "low",
    reidentificationNotes: null,
    notes: null,
  },
  {
    id: "karen-de-klerk",
    quoteVerbatim: "What a wonderful event, full of meaning and love.",
    quotePublished: "What a wonderful event, full of meaning and love.",
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_text",
    sourceDate: "2026-08-11",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "anonymous_permitted",
      scope: ["commercial_web"],
      obtainedOn: "2026-08-26",
      obtainedVia: "Approved for anonymous publication by Tumelo Ncube, filed in consent register",
      requestedBy: "Tumelo Ncube",
    },
    reidentificationRisk: "low",
    reidentificationNotes: null,
    notes: null,
  },
  {
    id: "valerie-text",
    quoteVerbatim: "This was such a beautiful event. Thank you.",
    quotePublished: "This was such a beautiful event. Thank you.",
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_text",
    sourceDate: "2026-08-11",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "anonymous_permitted",
      scope: ["commercial_web"],
      obtainedOn: "2026-08-26",
      obtainedVia: "Approved for anonymous publication by Tumelo Ncube, filed in consent register",
      requestedBy: "Tumelo Ncube",
    },
    reidentificationRisk: "low",
    reidentificationNotes: null,
    notes: null,
  },
  {
    id: "caitlin",
    quoteVerbatim:
      "Well done for putting this all together. It was super impressive to bring all those amazing women together.",
    quotePublished:
      "Well done for putting this all together. It was super impressive to bring all those amazing women together.",
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_text",
    sourceDate: "2026-08-11",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "anonymous_permitted",
      scope: ["commercial_web"],
      obtainedOn: "2026-08-26",
      obtainedVia: "Approved for anonymous publication by Tumelo Ncube, filed in consent register",
      requestedBy: "Tumelo Ncube",
    },
    reidentificationRisk: "low",
    reidentificationNotes: null,
    notes: null,
  },
  {
    id: "luana-pasanisi",
    quoteVerbatim: "",
    quotePublished: null,
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_text",
    sourceDate: "2026-08-11",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "none",
      scope: [],
      obtainedOn: null,
      obtainedVia: null,
      requestedBy: null,
    },
    reidentificationRisk: "high",
    reidentificationNotes:
      "The message is a private in-joke whose wording is identifiable to the sender by anyone who knows her. Anonymisation cannot make it safe.",
    notes: "Not for publication, private in-joke.",
  },
  {
    id: "amanda",
    quoteVerbatim: "",
    quotePublished: null,
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_text",
    sourceDate: "2026-08-12",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "none",
      scope: [],
      obtainedOn: null,
      obtainedVia: null,
      requestedBy: null,
    },
    reidentificationRisk: "medium",
    reidentificationNotes: null,
    notes:
      "Partnership offer, not a testimonial. Third-party chain of custody unresolved.",
  },
  {
    id: "mymoena-scholtz",
    quoteVerbatim: "",
    quotePublished: null,
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_text",
    sourceDate: "2026-08-12",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "none",
      scope: [],
      obtainedOn: null,
      obtainedVia: null,
      requestedBy: null,
    },
    reidentificationRisk: "high",
    reidentificationNotes:
      "Sender did not attend the event and wrote in an award-recipient context; the message contains a personal family disclosure that must never be published, and the award context makes the sender identifiable even without a name.",
    notes:
      "Did not attend the event, award-recipient context only. Personal family disclosure must never be published.",
  },
  {
    id: "nicky-voicenote",
    quoteVerbatim: "",
    quotePublished: null,
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_audio",
    sourceDate: "2026-08-12",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "none",
      scope: [],
      obtainedOn: null,
      obtainedVia: null,
      requestedBy: null,
    },
    reidentificationRisk: "medium",
    reidentificationNotes: null,
    notes: "Request for assistance, not a testimonial. Do not publish.",
  },
  {
    id: "alex-dodd-audio",
    quoteVerbatim: "",
    quotePublished: null,
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_audio",
    sourceDate: "2026-08-11",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "requested",
      scope: [],
      obtainedOn: null,
      obtainedVia: null,
      requestedBy: "Tumelo Ncube",
    },
    reidentificationRisk: "medium",
    reidentificationNotes: null,
    notes: "Voice note. Not transcribed, so blocked regardless of consent.",
  },
  {
    id: "nicola-vernon-audio",
    quoteVerbatim: "",
    quotePublished: null,
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_audio",
    sourceDate: "2026-08-11",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "requested",
      scope: [],
      obtainedOn: null,
      obtainedVia: null,
      requestedBy: "Tumelo Ncube",
    },
    reidentificationRisk: "medium",
    reidentificationNotes: null,
    notes: "Voice note. Not transcribed, so blocked regardless of consent.",
  },
  {
    id: "samantha-phillips-audio",
    quoteVerbatim: "",
    quotePublished: null,
    attributionName: null,
    attributionRole: null,
    attributionOrg: null,
    attributionMode: "anonymous",
    sourceMedium: "whatsapp_audio",
    sourceDate: "2026-08-11",
    transcribed: false,
    speakerApprovedTranscript: false,
    consent: {
      status: "requested",
      scope: [],
      obtainedOn: null,
      obtainedVia: null,
      requestedBy: "Tumelo Ncube",
    },
    reidentificationRisk: "medium",
    reidentificationNotes: null,
    notes: "Voice note. Not transcribed, so blocked regardless of consent.",
  },
];
