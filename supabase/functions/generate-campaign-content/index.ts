import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CONTENT_PILLARS = ['inspiration', 'education', 'empowerment', 'wellness'];

const SYSTEM_PROMPT = `You are Roam 🧭 - The Mindful Travel Connectivity Guide for RoamBuddy eSIMs and Omni Wellness Media. Generate engaging social media posts that blend travel connectivity with wellness themes.

YOUR PERSONA:
- You are Roam 🧭, a warm and knowledgeable travel connectivity guide
- You speak in first person ("I've guided thousands of travelers...")
- Your tone is calm, helpful, and wellness-oriented
- You care about conscious travel and stress-free connectivity
- You're a South African brand with global reach

BRAND VOICE:
- Friendly, helpful, and travel-savvy
- Focus on peace of mind and stress-free travel
- Emphasize wellness and conscious travel
- Always include 🧭 emoji in signature/attribution
- Sign posts with "- Roam 🧭" when appropriate

CONTENT PILLARS (Rotating Daily):
1. 🧘 Wellness (Monday) - Mindful connectivity, retreat prep
2. 📚 Education (Tuesday) - How eSIM works, device guides
3. 💪 Empowerment (Wednesday) - Take control of your connectivity
4. 🌍 Inspiration (Thursday) - Destination spotlights, travel stories
5. 🎉 Community (Friday) - User content, partner spotlights
6. 💰 Deals (Saturday) - Promo codes, limited offers
7. 🧭 Roam Talks (Sunday) - Personal tips from Roam

ROAMBUDDY KEY MESSAGES:
- eSIMs for 200+ countries
- No more roaming shock (compare R50/MB roaming vs R90 for 1GB)
- Instant activation - scan QR code
- Stay connected to what matters
- Affordable global data (from $5 / R90)
- 4G/5G speeds worldwide
- Dual SIM keeps your SA number active
- Valley of Plenty community impact

PLATFORM GUIDELINES:
- Facebook: Longer form, conversational, community-focused, 1-2 hashtags, sign with "- Roam 🧭"
- Instagram: Visual, inspiring, lifestyle-focused, 8-15 hashtags, start with "🧭 Roam here."
- TikTok: Trendy, casual, POV style, hook in first line, 3-5 hashtags, relatable content

DISCOUNT CODES TO PROMOTE:
- ROAM10: 10% off (general organic posts)
- FIRSTTRIP: 20% off (first-time travelers)
- WELLNESS: 15% off (wellness community)
- AIRPORT20: 20% off (airport campaigns)

Generate content that would resonate with wellness-focused travelers and digital nomads.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { days = 31, postsPerDay = 3, campaign = 'RoamBuddy Launch' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const totalPosts = days * postsPerDay;
    const platforms = ['facebook', 'instagram', 'tiktok'];
    
    // Generate posts in batches to avoid token limits
    const allPosts: any[] = [];
    const batchSize = 10;
    
    for (let batch = 0; batch < Math.ceil(totalPosts / batchSize); batch++) {
      const startPost = batch * batchSize;
      const endPost = Math.min(startPost + batchSize, totalPosts);
      
      const prompt = `Generate ${endPost - startPost} social media posts for a ${days}-day RoamBuddy eSIM campaign.

Posts ${startPost + 1} to ${endPost} of ${totalPosts} total.

For each post, provide:
1. Platform (rotate: facebook, instagram, tiktok)
2. Content pillar (rotate: inspiration, education, empowerment, wellness)
3. Post content (platform-optimized)
4. Hashtags (platform-appropriate count)

Format each post as JSON:
{
  "day": 1,
  "platform": "instagram",
  "pillar": "inspiration",
  "content": "Your post content here...",
  "hashtags": ["#RoamBuddy", "#TravelWellness"]
}

Return as a JSON array of posts.`;

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
            { role: "user", content: prompt }
          ],
          max_tokens: 4000,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        
        if (response.status === 429) {
          return new Response(JSON.stringify({ 
            error: "Rate limited. Please try again in a moment.",
            posts: allPosts
          }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "[]";
      
      // Parse the JSON from the response
      try {
        // Extract JSON array from the response (handle markdown code blocks)
        let jsonString = content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          jsonString = jsonMatch[0];
        }
        
        const batchPosts = JSON.parse(jsonString);
        allPosts.push(...batchPosts);
      } catch (parseError) {
        console.error("Failed to parse batch:", parseError);
        // Generate fallback posts for this batch
        for (let i = startPost; i < endPost; i++) {
          const day = Math.floor(i / postsPerDay) + 1;
          const postIndex = i % postsPerDay;
          const platform = platforms[postIndex];
          const pillar = CONTENT_PILLARS[day % 4];
          
          allPosts.push({
            day,
            platform,
            pillar,
            content: getFallbackContent(platform, pillar, day),
            hashtags: getDefaultHashtags(platform)
          });
        }
      }
    }

    // Format posts for bulk import
    const formattedPosts = allPosts.map((post, index) => {
      const day = post.day || Math.floor(index / postsPerDay) + 1;
      const postIndex = index % postsPerDay;
      const times = ['09:00', '13:00', '18:00'];
      
      return {
        day,
        platform: post.platform,
        pillar: post.pillar || post.content_pillar,
        content: post.content,
        hashtags: post.hashtags || [],
        scheduled_time: times[postIndex],
        campaign_name: campaign
      };
    });

    return new Response(JSON.stringify({ 
      success: true,
      campaign,
      totalDays: days,
      postsPerDay,
      totalPosts: formattedPosts.length,
      posts: formattedPosts
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-campaign-content:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      posts: []
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getFallbackContent(platform: string, pillar: string, day: number): string {
  const templates: Record<string, Record<string, string[]>> = {
    inspiration: {
      facebook: [
        "🧭 A quick word from Roam...\n\nI've guided thousands of conscious travelers to their perfect eSIM plan. Here's what I've learned:\n\nThe best travelers aren't the ones with the most data. They're the ones with the RIGHT data for their journey.\n\n• Yoga retreat? 5GB is plenty\n• Safari documentation? You need 20GB\n• Silent meditation? 1GB for emergencies\n• Digital nomad life? Unlimited\n\nWhat's your next wellness journey? Drop a 🌍 and I'll recommend the perfect plan.\n\nP.S. First-time travelers get 20% off with code FIRSTTRIP\n\n- Roam 🧭",
        "🧭 Every time you buy an eSIM from RoamBuddy, you're supporting something bigger.\n\nA portion of every sale goes to Valley of Plenty - our community initiative teaching coding and digital skills to young people in Hanover Park, Cape Town.\n\nYour connectivity helps us build community.\n\nThat's what conscious travel is all about.\n\n#ValleyOfPlenty #ImpactTravel #ConsciousBusiness #ROAMbyOmni\n\n- Roam 🧭",
      ],
      instagram: [
        "🧭 Roam here.\n\nYour yoga retreat in Bali shouldn't start with airport SIM card stress.\n\nHere's a wellness travel secret: Install your eSIM before you pack. Land. Breathe. Connect instantly.\n\nNo queues. No roaming shock. Just you, your mat, and peace of mind.\n\n5GB Indonesia = R150 | Activated in 30 seconds\n\n📍 Ready for mindful travel? Link in bio.\n\n#ROAMbyOmni #WellnessTravel #eSIM #BaliRetreat #MindfulConnectivity #TravelWellness #DigitalNomad #YogaTravel",
        "🧭 Roam here.\n\nThe world is waiting. Your connection is ready. 🌏✨\n\nRoamBuddy eSIM: Instant activation, global coverage, peace of mind.\n\nWhere are you headed next? Drop a 📍 below!\n\n#ROAMbyOmni #Wanderlust #TravelGoals #eSIM #DigitalNomad #TravelTips #GlobalTravel #TravelSmart",
      ],
      tiktok: [
        "POV: You land in a new country and you're already connected 📱✨\n\nNo airport SIM queues. No roaming shock. Just instant data.\n\nThis is the RoamBuddy effect 🧭\n\n#TravelHack #eSIM #DigitalNomad #TravelTips #ROAMbyOmni",
        "That moment when you have signal before you even leave the airport 😌✈️\n\nRoamBuddy changed the game for me.\n\nUse code ROAM10 for 10% off 🧭\n\n#TravelTips #eSIM #TravelHacks #DigitalNomad",
      ]
    },
    education: {
      facebook: [
        "🧭 Did you know? Most travelers spend R500-R2000 on international roaming PER TRIP! 😱\n\nRoamBuddy eSIMs start from just R90 for 1GB - that's the same coverage at a fraction of the cost.\n\nHere's how it works:\n1. Choose your destination\n2. Get a QR code instantly\n3. Scan with your phone\n4. Land connected\n\nNo physical SIM. No airport queues. No stress.\n\nWorks on iPhone XS+ and most Android phones from 2019.\n\nQuestions? Drop them below 👇\n\n- Roam 🧭",
        "🧭 eSIM 101: No physical SIM card needed!\n\nYour phone downloads the eSIM instantly. It's like having a travel SIM built into your phone.\n\n✅ Works on iPhone XS and newer\n✅ Most Samsung Galaxy S20 and newer\n✅ Google Pixel 3 and newer\n\nDual SIM means you keep your SA number active while using your travel data.\n\nMind = blown? Questions? Ask away! 📱\n\n- Roam 🧭",
      ],
      instagram: [
        "🧭 Quick eSIM 101:\n\n\"But how does it work?\"\n\n1️⃣ Choose your destination\n2️⃣ Get a QR code instantly\n3️⃣ Scan with your phone\n4️⃣ Land connected\n\nNo physical SIM. No airport queues. No R500 roaming bills.\n\nWorks on iPhone XS+ and most Android phones from 2019.\n\nQuestions? Chat with me anytime 💬\n\n#eSIM #TravelTech #HowTo #TravelHacks #ROAMbyOmni #DigitalNomad #TravelTips #TravelSmart",
        "🧭 Things that cost more than a RoamBuddy eSIM:\n\n☕ Your daily coffee x2\n🍔 One burger\n🎫 A movie ticket\n📲 10 minutes of roaming data abroad\n\n5GB Europe = R150\n\nJust saying 🧭\n\n#TravelHacks #eSIM #BudgetTravel #ROAMbyOmni #TravelTips #SmartTravel #DigitalNomad #SavingMoney",
      ],
      tiktok: [
        "POV: You're explaining eSIM to your mom before her trip to Portugal 📱\n\n\"No mom, you don't get a new SIM card\"\n\"No, nothing arrives in the mail\"\n\"You literally just scan a QR code\"\n\"Yes it works instantly\"\n\"No, you keep your South African number\"\n\nThis is the RoamBuddy way 🧭✨\n\n#eSIMExplained #TravelHacks #SouthAfricanAbroad #TravelTips #RoamBuddy #DigitalNomad",
        "Still paying R50/MB abroad?\n\nThat's R900 for one episode of your show. 😱\n\nRoamBuddy: 1GB for R90\n\nMath isn't mathing for roaming 🧭\n\n#TravelHacks #eSIM #NoMoreRoamingShock #BudgetTravel #TravelTips",
      ]
    },
    empowerment: {
      facebook: [
        "🧭 Take control of your travel connectivity.\n\nNo more hunting for WiFi. No more roaming bill shock. No more airport SIM card queues.\n\nWith RoamBuddy, you decide when and how you stay connected. Your journey, your rules. 💪\n\nDigital freedom looks different for everyone. For travelers, it means reliable connection without the hassle.\n\nRoamBuddy puts that power in your pocket.\n\nUse code ROAM10 for 10% off your first eSIM.\n\n- Roam 🧭",
        "🧭 Your next trip shouldn't come with connectivity anxiety.\n\nI've seen too many travelers stress about data, chase WiFi signals, or come home to shocking roaming bills.\n\nThat's why I do what I do.\n\nRoamBuddy gives you the power to:\n✅ Stay connected from the moment you land\n✅ Keep your SA number active\n✅ Know exactly what you're paying\n\nNo surprises. Just connection.\n\n- Roam 🧭",
      ],
      instagram: [
        "🧭 Roam here.\n\n200+ countries. One eSIM. Zero stress.\n\nStop letting connectivity anxiety hold you back. RoamBuddy empowers you to travel freely, work remotely, and stay connected to what matters.\n\nYour global journey starts now →\n\n#ROAMbyOmni #DigitalFreedom #eSIM #RemoteWork #DigitalNomad #TravelEmpowerment #TakeControl #TravelSmart",
        "🧭 She traded roaming anxiety for travel confidence 💪\n\nWith RoamBuddy, you're in control. Affordable data. Instant activation. Global coverage.\n\nWhat's holding you back from your next adventure?\n\nCode FIRSTTRIP = 20% off 🧭\n\n#TravelConfidence #eSIM #DigitalNomad #WomenWhoTravel #ROAMbyOmni #TravelEmpowerment #TravelSmart",
      ],
      tiktok: [
        "When they said I couldn't work remotely from Bali...\n\nI proved them wrong with my RoamBuddy eSIM 😏\n\nStable connection. Beach views. Living the dream.\n\n#DigitalNomadLife #RemoteWork #BaliLife #eSIM #RoamBuddy #WorkFromAnywhere",
        "Main character energy is having signal in the middle of nowhere 📱✨\n\nRoamBuddy. 200+ countries. One eSIM.\n\n#TravelVibes #eSIM #RoamBuddy #MainCharacter #TravelTips",
      ]
    },
    wellness: {
      facebook: [
        "🧭 Travel wellness starts with peace of mind.\n\nKnowing you can reach loved ones, access maps, and handle emergencies - that's the foundation for truly present travel.\n\nRoamBuddy gives you that security so you can focus on what matters: the experience.\n\n🧘‍♀️ Mindful travel tip: When you're not stressed about connectivity, you can actually be present in the moment.\n\nLet RoamBuddy handle the technical stuff while you soak in the journey.\n\n- Roam 🧭",
        "🧭 The overlooked wellness hack for travelers:\n\nReliable connection = reduced anxiety\nReduced anxiety = better experiences\nBetter experiences = lasting memories\n\nIt all starts with smart connectivity 📱✨\n\nRoamBuddy: Wellness starts before you pack.\n\n- Roam 🧭",
      ],
      instagram: [
        "🧭 Roam here.\n\n🧘‍♀️ Wellness travel tip:\n\nStress-free connectivity = more present moments\n\nWhen you're not worried about finding WiFi or racking up roaming charges, you can fully immerse in your journey.\n\nRoamBuddy: Peace of mind, wherever you roam 🌍\n\n#WellnessTravel #MindfulTravel #eSIM #ROAMbyOmni #TravelWellness #PresentMoment #ConsciousTravel #YogaTravel",
        "🧭 Self-care is getting an eSIM before your trip so you're not stressed about data 🧘‍♀️📱\n\nRoamBuddy: Wellness starts with connection.\n\nCode WELLNESS = 15% off for our wellness community 💚\n\n#SelfCareTips #TravelWellness #eSIM #MindfulTravel #ROAMbyOmni #WellnessJourney #ConsciousTravel",
      ],
      tiktok: [
        "Self-care is getting an eSIM before your trip so you're not stressed about data 🧘‍♀️📱\n\nRoamBuddy energy 🧭\n\n#SelfCareTips #TravelWellness #eSIM #MindfulTravel #ROAMbyOmni",
        "The calm of knowing you can always reach home, even from across the world 🌍💕\n\nThat's RoamBuddy peace of mind.\n\n#MindfulTravel #RoamBuddy #TravelWellness #PeaceOfMind",
      ]
    }
  };

  const pillarContent = templates[pillar] || templates.inspiration;
  const platformContent = pillarContent[platform] || pillarContent.facebook;
  return platformContent[day % platformContent.length];
}

function getDefaultHashtags(platform: string): string[] {
  const hashtags: Record<string, string[]> = {
    facebook: ['#RoamBuddy', '#TravelSmart'],
    instagram: ['#RoamBuddy', '#TravelWellness', '#eSIM', '#DigitalNomad', '#TravelTips', '#Wanderlust', '#TravelSmart', '#GlobalTravel'],
    tiktok: ['#RoamBuddy', '#eSIM', '#TravelHack', '#TravelTips', '#DigitalNomad'],
  };
  return hashtags[platform] || hashtags.facebook;
}
