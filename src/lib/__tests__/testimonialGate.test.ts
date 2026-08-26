import { describe, it, expect } from "vitest";
import { isPublishable, blockingReason, firstBlockedTerm } from "@/lib/testimonialGate";
import type { Testimonial } from "@/data/testimonials";
import { TESTIMONIALS } from "@/data/testimonials";

/**
 * Gate tests. Each failing condition is asserted individually so a future
 * loosening of any single check turns the suite red. No em dashes here.
 */

const attributedBase: Testimonial = {
  id: "test-attributed",
  quoteVerbatim: "A lovely evening all round.",
  quotePublished: "A lovely evening all round.",
  attributionName: "Thandi Example",
  attributionRole: "Guest",
  attributionOrg: null,
  attributionMode: "full_name",
  sourceMedium: "whatsapp_text",
  sourceDate: "2026-08-11",
  transcribed: false,
  speakerApprovedTranscript: false,
  consent: {
    status: "written",
    scope: ["commercial_web"],
    obtainedOn: "2026-08-20",
    obtainedVia: "WhatsApp reply, filed in consent register",
    requestedBy: "Tumelo Ncube",
  },
  reidentificationRisk: "low",
  reidentificationNotes: null,
  notes: null,
};

const anonymousBase: Testimonial = {
  ...attributedBase,
  id: "test-anonymous",
  attributionName: null,
  attributionRole: null,
  attributionOrg: null,
  attributionMode: "anonymous",
  consent: {
    ...attributedBase.consent,
    status: "anonymous_permitted",
  },
};

describe("Branch A, attributed publication", () => {
  it("passes a fully consented attributed record", () => {
    expect(isPublishable(attributedBase)).toBe(true);
  });

  it("fails when consent status is requested even with a populated quotePublished", () => {
    const t: Testimonial = {
      ...attributedBase,
      consent: { ...attributedBase.consent, status: "requested" },
    };
    expect(t.quotePublished).toBeTruthy();
    expect(isPublishable(t)).toBe(false);
  });

  it("fails when consent status is none", () => {
    expect(isPublishable({ ...attributedBase, consent: { ...attributedBase.consent, status: "none" } })).toBe(false);
  });

  it("fails when consent status is withdrawn", () => {
    expect(isPublishable({ ...attributedBase, consent: { ...attributedBase.consent, status: "withdrawn" } })).toBe(false);
  });

  it("fails when scope lacks commercial_web", () => {
    expect(isPublishable({ ...attributedBase, consent: { ...attributedBase.consent, scope: ["internal_only"] } })).toBe(false);
  });

  it("fails when quotePublished is null", () => {
    expect(isPublishable({ ...attributedBase, quotePublished: null })).toBe(false);
  });

  it("fails when quotePublished is empty", () => {
    expect(isPublishable({ ...attributedBase, quotePublished: "" })).toBe(false);
  });

  it("fails the consistency check: anonymous mode with a name set", () => {
    expect(
      isPublishable({ ...attributedBase, attributionMode: "anonymous", attributionName: "Thandi Example" })
    ).toBe(false);
  });

  it("fails an audio source without transcription", () => {
    expect(
      isPublishable({ ...attributedBase, sourceMedium: "whatsapp_audio", transcribed: false, speakerApprovedTranscript: false })
    ).toBe(false);
  });

  it("fails an audio source transcribed but not speaker approved", () => {
    expect(
      isPublishable({ ...attributedBase, sourceMedium: "whatsapp_audio", transcribed: true, speakerApprovedTranscript: false })
    ).toBe(false);
  });

  it("fails a video source without an approved transcript", () => {
    expect(
      isPublishable({ ...attributedBase, sourceMedium: "video", transcribed: true, speakerApprovedTranscript: false })
    ).toBe(false);
  });

  it("passes an audio source with an approved transcript", () => {
    expect(
      isPublishable({ ...attributedBase, sourceMedium: "whatsapp_audio", transcribed: true, speakerApprovedTranscript: true })
    ).toBe(true);
  });
});

describe("Branch B, anonymous publication", () => {
  it("passes a fully valid anonymous record", () => {
    expect(isPublishable(anonymousBase)).toBe(true);
  });

  it("fails when scope lacks commercial_web", () => {
    expect(isPublishable({ ...anonymousBase, consent: { ...anonymousBase.consent, scope: ["print"] } })).toBe(false);
  });

  it("fails when quotePublished is null", () => {
    expect(isPublishable({ ...anonymousBase, quotePublished: null })).toBe(false);
  });

  it("fails when attributionMode is not anonymous", () => {
    expect(isPublishable({ ...anonymousBase, attributionMode: "first_name" })).toBe(false);
  });

  it("fails when attributionName is populated", () => {
    expect(isPublishable({ ...anonymousBase, attributionName: "Thandi Example" })).toBe(false);
  });

  it("fails when attributionRole is populated", () => {
    expect(isPublishable({ ...anonymousBase, attributionRole: "Guest" })).toBe(false);
  });

  it("fails when attributionOrg is populated", () => {
    expect(isPublishable({ ...anonymousBase, attributionOrg: "Some Org" })).toBe(false);
  });

  it("fails when reidentificationRisk is medium and everything else is valid", () => {
    expect(isPublishable({ ...anonymousBase, reidentificationRisk: "medium" })).toBe(false);
  });

  it("fails when reidentificationRisk is high", () => {
    expect(isPublishable({ ...anonymousBase, reidentificationRisk: "high" })).toBe(false);
  });

  it("fails when quotePublished contains a blocked first name", () => {
    const t: Testimonial = { ...anonymousBase, quotePublished: "Amanda organised such a lovely evening." };
    expect(isPublishable(t)).toBe(false);
    expect(blockingReason(t)).toContain("Amanda");
  });

  it("fails when quotePublished contains a blocked place name, case-insensitive", () => {
    expect(isPublishable({ ...anonymousBase, quotePublished: "Best night out in cape town this year." })).toBe(false);
  });

  it("fails when quotePublished contains a blocked multi-word surname", () => {
    expect(isPublishable({ ...anonymousBase, quotePublished: "Thanks to de klerk for the lift home." })).toBe(false);
  });

  it("does not false-positive on words containing a blocked term without a boundary", () => {
    expect(firstBlockedTerm("The Alexandria hall looked wonderful")).toBeNull();
  });

  it("fails an anonymous audio source without an approved transcript, anonymity does not waive transcription", () => {
    expect(
      isPublishable({ ...anonymousBase, sourceMedium: "whatsapp_audio", transcribed: false, speakerApprovedTranscript: false })
    ).toBe(false);
  });
});

describe("Seeded dataset state", () => {
  it("publishes exactly the four approved anonymous records", () => {
    const published = TESTIMONIALS.filter(isPublishable).map((t) => t.id).sort();
    expect(published).toEqual(["caitlin", "karen-de-klerk", "michelle-t", "valerie-text"]);
  });

  it("keeps every non-approved record unpublishable with a stated reason", () => {
    for (const t of TESTIMONIALS.filter((x) => !isPublishable(x))) {
      expect(blockingReason(t)).toBeTruthy();
    }
  });

  it("keeps the four published spans free of blocked terms", () => {
    for (const t of TESTIMONIALS.filter(isPublishable)) {
      expect(firstBlockedTerm(t.quotePublished as string)).toBeNull();
    }
  });
});
