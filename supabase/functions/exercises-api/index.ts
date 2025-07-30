import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExerciseParams {
  name?: string;
  type?: 'cardio' | 'olympic_weightlifting' | 'plyometrics' | 'powerlifting' | 'strength' | 'stretching';
  muscle?: string;
  difficulty?: 'beginner' | 'intermediate' | 'expert';
}

interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('API_NINJAS_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API_NINJAS_KEY is not configured' }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let params: ExerciseParams = {};

    if (req.method === 'POST') {
      // Handle POST request with JSON body
      const body = await req.json();
      params = body.filters || {};
    } else {
      // Handle GET request with query parameters
      const url = new URL(req.url);
      const searchParams = new URLSearchParams(url.search);
      
      if (searchParams.get('name')) {
        params.name = searchParams.get('name')!;
      }
      if (searchParams.get('type')) {
        params.type = searchParams.get('type') as ExerciseParams['type'];
      }
      if (searchParams.get('muscle')) {
        params.muscle = searchParams.get('muscle')!;
      }
      if (searchParams.get('difficulty')) {
        params.difficulty = searchParams.get('difficulty') as ExerciseParams['difficulty'];
      }
    }

    // Build query string for API Ninjas
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value.trim()) {
        queryParams.append(key, value.trim());
      }
    });

    const apiUrl = `https://api.api-ninjas.com/v1/exercises${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    console.log('Fetching exercises from:', apiUrl);
    console.log('Search parameters:', params);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('API Ninjas error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ 
          error: `API Ninjas request failed with status ${response.status}` 
        }), 
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const exercises: Exercise[] = await response.json();
    
    console.log(`Found ${exercises.length} exercises`);

    return new Response(JSON.stringify({ 
      exercises,
      total: exercises.length,
      filters: params
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in exercises-api function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});