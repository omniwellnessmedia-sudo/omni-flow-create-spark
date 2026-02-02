import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CONTENT_PILLARS = ['inspiration', 'education', 'empowerment', 'wellness'];

const SYSTEM_PROMPT = `You are a social media content expert for RoamBuddy eSIMs and Omni Wellness Media. Generate engaging social media posts that blend travel connectivity with wellness themes.

BRAND VOICE:
- Friendly, helpful, and travel-savvy
- Focus on peace of mind and stress-free travel
- Emphasize wellness and conscious travel
- South African brand with global reach

CONTENT PILLARS:
1. Inspiration - Motivational travel content, adventure awaits messages
2. Education - How eSIMs work, travel tips, device compatibility
3. Empowerment - Taking control of your connectivity, digital freedom
4. Wellness - Stress-free travel, mindful connectivity, staying present

ROAMBUDDY KEY MESSAGES:
- eSIMs for 200+ countries
- No more roaming shock
- Instant activation
- Stay connected to what matters
- Affordable global data (from $5)
- 4G/5G speeds worldwide

PLATFORM GUIDELINES:
- Facebook: Longer form, informative, community-focused, 1-2 hashtags
- Instagram: Visual, inspiring, lifestyle-focused, 8-15 hashtags
- TikTok: Trendy, casual, POV style, hook in first line, 3-5 hashtags

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
        "Your next adventure awaits! With RoamBuddy eSIM, stay connected to the moments that matter most. No roaming fees, no stress. 🌍✈️",
        "Travel transforms us. Stay connected to share those life-changing moments with the ones you love. RoamBuddy has you covered in 200+ countries.",
      ],
      instagram: [
        "✈️ Wanderlust calling? Answer it with confidence. RoamBuddy keeps you connected in 200+ countries. No roaming shock, just pure adventure. 🌍\n\nWhere are you headed next? Drop a 📍 below!",
        "The world is waiting. Your connection is ready. 🌏✨\n\nRoamBuddy eSIM: Instant activation, global coverage, peace of mind.",
      ],
      tiktok: [
        "POV: You land in a new country and you're already connected 📱✨ This is the RoamBuddy effect. #TravelHack #eSIM #DigitalNomad",
        "That moment when you have signal before you even leave the airport 😌✈️ RoamBuddy changed the game. #TravelTips #eSIM",
      ]
    },
    education: {
      facebook: [
        "Did you know? Most travelers spend R500-R2000 on international roaming PER TRIP! 😱 RoamBuddy eSIMs start from just $5 for the same coverage. Here's how it works...",
        "eSIM 101: No physical SIM card needed! Your phone downloads the eSIM instantly. Works on iPhone XS+ and most Android phones from 2019+. Questions? Ask away! 📱",
      ],
      instagram: [
        "🤔 Still using physical SIM cards abroad?\n\nHere's why eSIM is the future:\n✅ Instant activation\n✅ No roaming fees\n✅ Works in 200+ countries\n✅ Keep your home number active\n\nMake the switch → Link in bio",
        "Travel tip that saves hundreds 💰\n\nDitch the airport SIM kiosks. Get your eSIM before you even pack. Activated the moment you land. This is how smart travelers stay connected.",
      ],
      tiktok: [
        "Things I wish I knew before traveling abroad: You DON'T need to buy overpriced SIMs at the airport 📱 Get an eSIM instead! #TravelHacks #BudgetTravel",
        "Explaining eSIM to my parents vs my friends 😂 It's just... you download it? And it works? Everywhere? Yes. #eSIM #TravelTech",
      ]
    },
    empowerment: {
      facebook: [
        "Take control of your travel connectivity. No more hunting for WiFi, no more roaming bill shock. With RoamBuddy, you decide when and how you stay connected. Your journey, your rules. 💪",
        "Digital freedom looks different for everyone. For travelers, it means reliable connection without the hassle. RoamBuddy puts that power in your pocket.",
      ],
      instagram: [
        "🌍 200+ countries. One eSIM. Zero stress.\n\nStop letting connectivity anxiety hold you back. RoamBuddy empowers you to travel freely, work remotely, and stay connected to what matters.\n\nYour global journey starts now →",
        "She traded roaming anxiety for travel confidence 💪\n\nWith RoamBuddy, you're in control. Affordable data. Instant activation. Global coverage.\n\nWhat's holding you back from your next adventure?",
      ],
      tiktok: [
        "When they said I couldn't work remotely from Bali... I proved them wrong with my RoamBuddy eSIM 😏 #DigitalNomadLife #RemoteWork",
        "Main character energy is having signal in the middle of nowhere 📱✨ #TravelVibes #eSIM #RoamBuddy",
      ]
    },
    wellness: {
      facebook: [
        "Travel wellness starts with peace of mind. Knowing you can reach loved ones, access maps, and handle emergencies - that's the foundation for truly present travel. RoamBuddy gives you that security. 🧘‍♀️✈️",
        "Mindful travel tip: When you're not stressed about connectivity, you can actually be present in the moment. Let RoamBuddy handle the technical stuff while you soak in the experience.",
      ],
      instagram: [
        "🧘‍♀️ Wellness travel tip:\n\nStress-free connectivity = more present moments\n\nWhen you're not worried about finding WiFi or racking up roaming charges, you can fully immerse in your journey.\n\nRoamBuddy: Peace of mind, wherever you roam 🌍",
        "The overlooked wellness hack for travelers:\n\nReliable connection = reduced anxiety\nReduced anxiety = better experiences\nBetter experiences = lasting memories\n\nIt all starts with smart connectivity 📱✨",
      ],
      tiktok: [
        "Self-care is getting an eSIM before your trip so you're not stressed about data 🧘‍♀️📱 #SelfCareTips #TravelWellness #eSIM",
        "The calm of knowing you can always reach home, even from across the world 🌍💕 #MindfulTravel #RoamBuddy",
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
