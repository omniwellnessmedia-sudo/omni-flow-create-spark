import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Rewrite a draft Google Ads campaign for one Omni offer.
 *
 * The client (src/lib/ads.ts) sends the offer as published on the rate
 * card and its own deterministic draft. This asks the model for sharper
 * headlines, descriptions and keywords inside Google's limits, and the
 * client re-applies the limits and the site's rules to whatever comes
 * back, so a long line or a promise the terms do not make never reaches
 * the account.
 *
 * Uses the same Lovable AI gateway and key as generate-campaign-content.
 *
 * No em dashes in this file.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You write Google Search ads for Omni Wellness Media, a media and marketing company in Muizenberg, Cape Town, South Africa, that sells to small businesses and wellness practitioners.

Hard rules:
- Headlines: at most 30 characters each. Descriptions: at most 90 characters each. Count carefully.
- Use ONLY the price given. Never invent a price, discount, deadline or number.
- Never promise results, rankings, sales or leads. Never use "guarantee", "#1", "best", "cheapest", "risk free".
- No emoji. No exclamation marks. Plain, confident South African English.
- Mention Cape Town or Muizenberg in at least two headlines.
- Keywords: 8 to 15 phrases a small business owner in Cape Town would actually type, lower case, no punctuation.

Return only JSON: {"headlines": [...15 strings], "descriptions": [...4 strings], "keywords": [...strings]}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { offer, draft } = await req.json();
    if (!offer || typeof offer.name !== "string") {
      return new Response(JSON.stringify({ error: "offer is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const prompt = `Offer as published:
Name: ${offer.name}
Price: ${offer.price}
What it is: ${offer.blurb}
Included: ${(offer.bullets ?? []).join("; ")}
Landing page: https://omniwellnessmedia.co.za/services/${offer.slug}

Current draft (correct but flat), improve on it:
Headlines: ${(draft?.headlines ?? []).join(" | ")}
Descriptions: ${(draft?.descriptions ?? []).join(" | ")}
Keywords: ${(draft?.keywords ?? []).join(", ")}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      const status = response.status === 429 ? 429 : 502;
      return new Response(JSON.stringify({ error: status === 429 ? "Rate limited, try again in a moment." : "The AI gateway did not answer." }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "{}";
    const jsonText = content.replace(/```json\s*|```/g, "").trim();
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      const m = jsonText.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
    }

    return new Response(JSON.stringify({
      headlines: Array.isArray(parsed.headlines) ? parsed.headlines : [],
      descriptions: Array.isArray(parsed.descriptions) ? parsed.descriptions : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("generate-ad-copy error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
