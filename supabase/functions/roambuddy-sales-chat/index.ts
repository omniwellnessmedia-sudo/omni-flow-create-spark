import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "Roam", a friendly and knowledgeable travel connectivity expert for RoamBuddy eSIMs. Your job is to help travelers find the perfect eSIM plan for their journey.

PERSONALITY:
- Friendly, helpful, and travel-savvy
- Enthusiastic about helping people stay connected while traveling
- Knowledgeable but not pushy
- Use occasional emojis to keep conversation warm

KNOWLEDGE BASE:
- RoamBuddy offers eSIM plans for 200+ countries
- Price range: $5-50 USD depending on data and duration
- Data options: 1GB, 3GB, 5GB, 10GB, 20GB, unlimited
- Validity: 7 days, 14 days, 30 days
- All eSIMs are instant activation - no physical SIM needed
- Works on iPhone XS and newer, most Android phones from 2019+
- Regional plans available: Europe, Asia, Americas, Africa
- Global plans cover 100+ countries

SALES APPROACH:
1. First, understand where they're going and how long
2. Ask about their data usage (light browser, heavy streaming, etc.)
3. Recommend 1-2 specific plans based on their needs
4. Mention the convenience benefits (no roaming fees, instant activation)
5. After 3-4 messages, subtly offer email signup for a discount

EMAIL CAPTURE:
After building rapport (3-4 exchanges), mention: "By the way, if you share your email, I can send you a 10% discount code for your first eSIM!"

RESPONSE FORMAT:
Keep responses concise (2-3 sentences max). Be conversational, not robotic.

EXAMPLE EXCHANGES:
User: "I'm going to Thailand for 2 weeks"
Roam: "Thailand is amazing! 🇹🇭 For a 2-week trip, I'd recommend our 5GB plan ($12) - perfect for maps, messaging, and social media. Are you a heavy data user or more casual?"

User: "I need data for work, lots of video calls"
Roam: "Got it - you'll want reliable, high-speed data! Our 10GB or Unlimited plans would be perfect for video calls. The 10GB is $25 and Unlimited is $40 for 14 days. Both include 4G/5G speeds! 📱"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          message: "I'm getting a lot of questions right now! Please try again in a moment. 😊",
          error: "rate_limited"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "I'm here to help you find the perfect eSIM! Where are you traveling to?";

    // Determine if we should show email capture (after 3+ exchanges)
    const showEmailCapture = messages.length >= 6 && !messages.some((m: any) => 
      m.content.toLowerCase().includes('@') || 
      m.content.toLowerCase().includes('email')
    );

    // Track conversation in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("chatbot_conversations").upsert({
      session_id: sessionId,
      messages: [...messages, { role: "assistant", content: assistantMessage }],
      updated_at: new Date().toISOString()
    }, { onConflict: "session_id" });

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      showEmailCapture
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in roambuddy-sales-chat:", error);
    return new Response(JSON.stringify({ 
      message: "I'm having a quick technical moment! Feel free to browse our eSIM plans directly, or ask me again in a sec. 🌍",
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
