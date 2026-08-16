import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const PETITION_IP_SALT = Deno.env.get("PETITION_IP_SALT");

// Server-owned. Bump IN THE SAME COMMIT as any change to the on-page consent
// wording, and commit the new wording to supabase/migrations/consent-texts/.
const CONSENT_VERSION = "2026-08-v1";

const DEFAULT_SLUG = "stunning-pigs";
const ALLOWED_SLUGS = ["stunning-pigs"];
const DEFAULT_SOURCE = "stunning-pigs-page";

const MIN_FILL_MS = 3_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

const NAME_MAX = 80;
const CITY_MAX = 80;
const EMAIL_MAX = 254;
const SOURCE_MAX = 60;

const PRIVACY_EMAIL = "omniwellnessmedia@gmail.com";

// Logged only — never used to block. Origin is trivially forged, and blocking
// would break Netlify deploy previews.
const KNOWN_ORIGINS = [
  "https://www.omniwellnessmedia.co.za",
  "https://omniwellnessmedia.co.za",
  "http://localhost:8080",
];

// Identical in all three 200 branches: new signature, duplicate, honeypot.
const SUCCESS_MESSAGE = "Your name is on the petition — thank you.";

const jsonResponse = (
  status: number,
  body: Record<string, unknown>,
  extraHeaders: Record<string, string> = {}
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders },
  });

// Copied from subscribe-newsletter/index.ts
const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
    .substring(0, 500);
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Link-stuffed name/city fields are the dominant petition spam pattern.
const linkSpamRegex = /https?:\/\/|www\.|\.(com|ru|xyz|top)\b/i;

function getClientIP(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? req.headers.get("cf-connecting-ip") ?? null;
}

async function hashIP(ip: string, salt: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Authoritative count straight from petition_counters. Never seeded, never
// offset. Returns null (not a guess) if the read fails.
async function readCount(supabase: any, slug: string): Promise<number | null> {
  const { data, error } = await supabase.rpc("get_petition_count", { p_slug: slug });
  if (error) {
    console.error("petition count read failed:", error.code ?? "", error.message ?? "");
    return null;
  }
  const n = Number(data);
  return Number.isFinite(n) ? n : null;
}

// Marketing consent is actioned, not merely recorded. Non-fatal by design: a
// signature must never fail because a mailing-list write failed.
async function linkMarketingConsent(
  supabase: any,
  email: string,
  fullName: string
): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, interests, unsubscribed")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      const interests: string[] = Array.isArray(existing.interests) ? existing.interests : [];
      if (!interests.includes("stunning-pigs")) interests.push("stunning-pigs");

      await supabase
        .from("newsletter_subscribers")
        .update({
          interests,
          // A fresh, explicit tick is a new consent — honour it over a stale
          // unsubscribe. Withdrawal remains available via the unsubscribe link.
          unsubscribed: false,
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      return;
    }

    await supabase.from("newsletter_subscribers").insert({
      email,
      full_name: fullName,
      source: "petition-stunning-pigs",
      interests: ["stunning-pigs"],
      confirmed: true,
      confirmed_at: new Date().toISOString(),
    });
  } catch (subscribeError) {
    console.error("petition marketing-consent link failed:", subscribeError);
  }
}

// The mechanism by which someone whose address was submitted by a third party
// finds out and can ask for removal. Non-fatal.
async function sendConfirmationEmail(
  email: string,
  firstName: string,
  slug: string
): Promise<void> {
  if (!RESEND_API_KEY) return;
  try {
    // On-brand confirmation in the campaign's own register (plum/gold,
    // serif headings) rather than a generic gradient template — this email
    // is many signers' only other touchpoint with the campaign.
    const year = new Date().getFullYear();
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#F7F3EA;font-family:Helvetica,Arial,sans-serif;color:#1F2F27;line-height:1.6;">
        <div style="max-width:600px;margin:0 auto;padding:24px 16px;">
          <div style="background:#FDFBF6;border:1px solid #E4DCC9;">
            <div style="background:#2A0A1E;padding:28px 30px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#D9B36C;">Voices for Women</p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:600;font-size:26px;color:#F9F5F0;">Thank you for signing</h1>
            </div>
            <div style="padding:30px;">
              <p>Hi ${firstName},</p>
              <p>Your name has been added to the petition asking South African regulators,
              retailers and industry bodies to review the use of high-concentration CO<sub>2</sub>
              gas stunning of pigs.</p>
              <!-- GOVERNED WORDING. This is a per-signer disclosure, so it must
                   match the approved wording on the form exactly in substance.
                   It named Beauty Without Cruelty and G.A.R.D. as recipients
                   and responsible parties until 16 August 2026. Neither has
                   agreed in writing to be named. Name no organisation here. -->
              <p>Your signature is held by Omni Wellness Media. It has not been shared with any
              third party. This petition is being prepared for submission and your signature may
              be shared with campaign partner organisations for that purpose. We will confirm the
              recipient and submission date to signatories. We do not sell or trade your details
              and we do not use them for anything else unless you have opted in to updates.</p>
              <div style="background:#F7F3EA;border-left:3px solid #D9B36C;padding:16px 18px;margin:22px 0;font-size:14px;">
                <p style="margin:0 0 10px;"><strong>Your first name, surname and city may appear on the
                petition as presented. Your email address is never published.</strong></p>
                <p style="margin:0;">We process this information under the Protection of Personal
                Information Act 4 of 2013. If you did not sign this, or you want your details seen,
                corrected or removed, email
                <a href="mailto:${PRIVACY_EMAIL}" style="color:#8E7B52;">${PRIVACY_EMAIL}</a> and we will action it.</p>
              </div>
              <p style="margin:24px 0 0;">One more thing that genuinely helps: pass the petition on.
              <a href="https://omniwellnessmedia.co.za/events/stunning-pigs#petition" style="color:#8E7B52;">Share this link</a>
              with one person who should see it.</p>
              <p style="margin:24px 0 0;">With thanks,<br><strong>Omni Wellness Media</strong></p>
            </div>
            <div style="background:#0E1513;color:#8A9A96;padding:20px 30px;text-align:center;font-size:12px;">
              <p style="margin:0 0 6px;">You received this because your email address was used to sign a petition at omniwellnessmedia.co.za</p>
              <p style="margin:0;">&copy; ${year} Omni Wellness Media</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = [
      `Hi ${firstName},`,
      "",
      "Your name has been added to the petition asking South African regulators, retailers and industry bodies to review the use of high-concentration CO2 gas stunning of pigs.",
      "",
      // Plain-text part. Keep in step with the HTML part above: same governed
      // wording, no organisation named.
      "Your signature is held by Omni Wellness Media. It has not been shared with any third party. This petition is being prepared for submission and your signature may be shared with campaign partner organisations for that purpose. We will confirm the recipient and submission date to signatories. We do not sell or trade your details and we do not use them for anything else unless you have opted in to updates.",
      "",
      "Your first name, surname and city may appear on the petition as presented. Your email address is never published. We process this information under the Protection of Personal Information Act 4 of 2013. If you did not sign this, or want your details seen, corrected or removed, email " + PRIVACY_EMAIL + ".",
      "",
      "Pass it on: https://omniwellnessmedia.co.za/events/stunning-pigs#petition",
      "",
      "With thanks,",
      "Omni Wellness Media",
    ].join("\n");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // REQUIRES the omniwellnessmedia.co.za domain to be VERIFIED in
        // Resend (Domains -> Add domain -> add the DNS records it shows).
        // The previous onboarding@resend.dev sender only delivers to the
        // Resend account owner's own address — every real signer's
        // confirmation was silently rejected. Do not deploy this change
        // before the domain shows "Verified" in Resend.
        from: "Omni Wellness Media <petition@omniwellnessmedia.co.za>",
        reply_to: PRIVACY_EMAIL,
        to: [email],
        subject: "Your name is on the petition — thank you",
        html,
        text,
      }),
    });

    if (!resendResponse.ok) {
      console.error("petition confirmation email rejected by Resend, status", resendResponse.status);
    } else {
      console.log("petition confirmation email sent", { slug });
    }
  } catch (emailError) {
    console.error("petition confirmation email error:", emailError);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse(
        405,
        {
          success: false,
          code: "method_not_allowed",
          error: "That request could not be processed.",
        },
        { Allow: "POST, OPTIONS" }
      );
    }

    const origin = req.headers.get("origin");
    if (origin && !KNOWN_ORIGINS.includes(origin)) {
      console.warn("petition signed from unrecognised origin:", origin);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch (_parseError) {
      return jsonResponse(400, {
        success: false,
        code: "bad_request",
        error: "We couldn't read that request. Please try again.",
      });
    }

    // ---- Slug allowlist -----------------------------------------------------
    // Never insert a client-supplied slug unchecked: it would let anyone create
    // counter rows.
    const rawSlug = typeof body.petition_slug === "string" ? body.petition_slug.trim() : "";
    const slug = rawSlug === "" ? DEFAULT_SLUG : rawSlug;
    if (!ALLOWED_SLUGS.includes(slug)) {
      return jsonResponse(400, {
        success: false,
        code: "bad_request",
        error: "We couldn't read that request. Please try again.",
      });
    }

    // ---- Honeypot -----------------------------------------------------------
    // Silent: normal success shape, nothing written. Bots must not learn they
    // were caught, and they do not retry.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      console.warn("petition honeypot tripped", { slug });
      const count = await readCount(supabase, slug);
      return jsonResponse(200, { success: true, count, message: SUCCESS_MESSAGE });
    }

    // ---- Minimum time-to-submit --------------------------------------------
    // A real error, unlike the honeypot: a false positive here would silently
    // destroy a genuine signature, so the user is told to tap sign again.
    const startedAt = Number(body.form_started_at);
    const elapsed = Date.now() - startedAt;
    if (
      !Number.isFinite(startedAt) ||
      startedAt <= 0 ||
      elapsed < MIN_FILL_MS ||
      elapsed > MAX_FORM_AGE_MS
    ) {
      console.warn("petition time-trap rejected a submission", { slug });
      return jsonResponse(400, {
        success: false,
        code: "too_fast",
        error: "That went through a little too quickly — please tap sign again.",
      });
    }

    // ---- Field validation ---------------------------------------------------
    const firstName = sanitizeInput(typeof body.first_name === "string" ? body.first_name : "");
    const surname = sanitizeInput(typeof body.surname === "string" ? body.surname : "");
    const rawEmail = typeof body.email === "string" ? body.email : "";
    const city = sanitizeInput(typeof body.city === "string" ? body.city : "");

    if (!firstName) {
      return jsonResponse(400, {
        success: false,
        code: "missing_field",
        field: "first_name",
        error: "Please enter your first name.",
      });
    }
    if (!surname) {
      return jsonResponse(400, {
        success: false,
        code: "missing_field",
        field: "surname",
        error: "Please enter your surname.",
      });
    }
    if (!rawEmail.trim()) {
      return jsonResponse(400, {
        success: false,
        code: "missing_field",
        field: "email",
        error: "Please enter your email address.",
      });
    }

    // Reject over-length names rather than truncating — silently shortening
    // someone's surname on a petition is not acceptable.
    if (firstName.length > NAME_MAX) {
      return jsonResponse(400, {
        success: false,
        code: "invalid_name",
        field: "first_name",
        error: `Please shorten your first name to ${NAME_MAX} characters or fewer.`,
      });
    }
    if (surname.length > NAME_MAX) {
      return jsonResponse(400, {
        success: false,
        code: "invalid_name",
        field: "surname",
        error: `Please shorten your surname to ${NAME_MAX} characters or fewer.`,
      });
    }
    if (linkSpamRegex.test(firstName)) {
      return jsonResponse(400, {
        success: false,
        code: "invalid_name",
        field: "first_name",
        error: "Please enter your first name without any web addresses.",
      });
    }
    if (linkSpamRegex.test(surname)) {
      return jsonResponse(400, {
        success: false,
        code: "invalid_name",
        field: "surname",
        error: "Please enter your surname without any web addresses.",
      });
    }

    if (city.length > CITY_MAX) {
      return jsonResponse(400, {
        success: false,
        code: "invalid_city",
        field: "city",
        error: `Please shorten your city or town to ${CITY_MAX} characters or fewer.`,
      });
    }
    if (city && linkSpamRegex.test(city)) {
      return jsonResponse(400, {
        success: false,
        code: "invalid_city",
        field: "city",
        error: "Please enter your city or town without any web addresses.",
      });
    }

    const email = rawEmail.toLowerCase().trim();
    if (!emailRegex.test(email) || email.length > EMAIL_MAX) {
      return jsonResponse(400, {
        success: false,
        code: "invalid_email",
        field: "email",
        error: "Please provide a valid email address.",
      });
    }

    const source = (
      typeof body.source === "string" && body.source.trim()
        ? sanitizeInput(body.source)
        : DEFAULT_SOURCE
    ).substring(0, SOURCE_MAX);

    const updatesConsent = body.updates_consent === true;

    // ---- Per-IP throttle ----------------------------------------------------
    // An unsalted (or weakly salted) hash of an IPv4 address is brute-forceable
    // over 2^32 — a raw IP wearing a costume. With no usable salt we store
    // nothing and skip the throttle rather than pretend.
    let ipHash: string | null = null;
    const clientIP = getClientIP(req);
    if (clientIP && PETITION_IP_SALT && PETITION_IP_SALT.length >= 16) {
      ipHash = await hashIP(clientIP, PETITION_IP_SALT);
    } else if (!PETITION_IP_SALT || PETITION_IP_SALT.length < 16) {
      console.warn(
        "PETITION_IP_SALT missing or shorter than 16 chars — storing no ip_hash and skipping the per-IP throttle."
      );
    }

    if (ipHash) {
      const { data: allowed, error: rateError } = await supabase.rpc("check_petition_ip_rate", {
        p_ip_hash: ipHash,
      });
      if (rateError) {
        // Fail open: a missing/failed rate-limit function must not brick the
        // petition. Loud so it gets noticed.
        console.error(
          "petition rate-limit check failed, allowing through:",
          rateError.code ?? "",
          rateError.message ?? ""
        );
      } else if (allowed === false) {
        console.warn("petition rate limit hit", { slug });
        return jsonResponse(
          429,
          {
            success: false,
            code: "rate_limited",
            error:
              "We've had a lot of signatures from this connection. Please try again in an hour.",
            retry_after_seconds: 3600,
          },
          { "Retry-After": "3600" }
        );
      }
    }

    // ---- Insert -------------------------------------------------------------
    const nowIso = new Date().toISOString();
    const { data: inserted, error: insertError } = await supabase
      .from("petition_signatures")
      .insert({
        petition_slug: slug,
        first_name: firstName,
        surname: surname,
        email,
        city: city || null,
        updates_consent: updatesConsent,
        updates_consent_at: updatesConsent ? nowIso : null,
        consent_version: CONSENT_VERSION,
        source,
        ip_hash: ipHash,
      })
      .select("id")
      .maybeSingle();

    let isNewSignature = false;

    if (insertError) {
      // 23505 = unique_violation on (petition_slug, lower(email)).
      // Do NOT log insertError.details — for a unique violation it contains the
      // email address.
      if (insertError.code === "23505") {
        console.log("petition duplicate", { slug });

        const { data: existing, error: existingError } = await supabase
          .from("petition_signatures")
          .select("id, updates_consent, withdrawn_at")
          .eq("petition_slug", slug)
          .eq("email", email)
          .maybeSingle();

        if (existingError) {
          console.error(
            "petition duplicate lookup failed:",
            existingError.code ?? "",
            existingError.message ?? ""
          );
        } else if (existing?.withdrawn_at) {
          // Someone previously withdrew. Do not silently re-add them and do not
          // touch their consent — reinstatement is an auditable admin action.
          console.warn("petition resubmission on a withdrawn row, left untouched", { slug });
        } else if (existing && updatesConsent && existing.updates_consent === false) {
          // An opt-in on a repeat submission is honoured. The reverse is not:
          // an unticked box is not a withdrawal, and honouring it would let a
          // third party silently opt someone out. Names, city and created_at
          // are never overwritten — the first signature is the evidentiary one.
          const { error: consentError } = await supabase
            .from("petition_signatures")
            .update({
              updates_consent: true,
              updates_consent_at: nowIso,
              consent_version: CONSENT_VERSION,
            })
            .eq("id", existing.id);

          if (consentError) {
            console.error(
              "petition consent upgrade failed:",
              consentError.code ?? "",
              consentError.message ?? ""
            );
          } else {
            await linkMarketingConsent(supabase, email, `${firstName} ${surname}`);
          }
        }
      } else {
        console.error("petition insert error:", insertError.code ?? "", insertError.message ?? "");
        return jsonResponse(500, {
          success: false,
          code: "server_error",
          error: "We couldn't record your signature just now. Please try again.",
        });
      }
    } else if (inserted) {
      isNewSignature = true;
    } else {
      // No row and no error should be impossible; treat it as a failure rather
      // than telling someone they signed when we cannot show that they did.
      console.error("petition insert returned no row and no error");
      return jsonResponse(500, {
        success: false,
        code: "server_error",
        error: "We couldn't record your signature just now. Please try again.",
      });
    }

    if (isNewSignature && updatesConsent) {
      await linkMarketingConsent(supabase, email, `${firstName} ${surname}`);
    }

    if (isNewSignature) {
      await sendConfirmationEmail(email, firstName, slug);
    }

    // The counter trigger runs inside the inserting transaction, so this read is
    // already consistent with the row just written.
    const count = await readCount(supabase, slug);

    return jsonResponse(200, { success: true, count, message: SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Server error:", error);
    return jsonResponse(500, {
      success: false,
      code: "server_error",
      error: "We couldn't record your signature just now. Please try again.",
    });
  }
});
