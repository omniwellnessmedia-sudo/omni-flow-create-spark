// Affiliate click tracking with rate limiting to prevent click fraud
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_PER_PROGRAM = 30; // Max 30 clicks per program per IP per window
const RATE_LIMIT_MAX_TOTAL = 100; // Max 100 total clicks per IP per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window

function checkRateLimit(ip: string, programId: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  
  // Check per-program rate limit
  const programKey = `${ip}_${programId}`;
  const programRecord = rateLimitMap.get(programKey);
  
  if (programRecord && now <= programRecord.resetTime && programRecord.count >= RATE_LIMIT_MAX_PER_PROGRAM) {
    return { allowed: false, reason: 'Too many clicks for this program' };
  }
  
  // Check total rate limit
  const totalKey = `${ip}_total`;
  const totalRecord = rateLimitMap.get(totalKey);
  
  if (totalRecord && now <= totalRecord.resetTime && totalRecord.count >= RATE_LIMIT_MAX_TOTAL) {
    return { allowed: false, reason: 'Too many clicks' };
  }
  
  // Update program counter
  if (!programRecord || now > programRecord.resetTime) {
    rateLimitMap.set(programKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    programRecord.count++;
  }
  
  // Update total counter
  if (!totalRecord || now > totalRecord.resetTime) {
    rateLimitMap.set(totalKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    totalRecord.count++;
  }
  
  return { allowed: true };
}

// Input validation
function validateInput(data: any): { valid: boolean; error?: string } {
  if (!data.programId || typeof data.programId !== 'string' || data.programId.length > 100) {
    return { valid: false, error: 'Invalid programId' };
  }
  if (!data.destinationUrl || typeof data.destinationUrl !== 'string' || data.destinationUrl.length > 2000) {
    return { valid: false, error: 'Invalid destinationUrl' };
  }
  // Basic URL validation
  try {
    new URL(data.destinationUrl);
  } catch {
    return { valid: false, error: 'Invalid destinationUrl format' };
  }
  if (data.referrerUrl && (typeof data.referrerUrl !== 'string' || data.referrerUrl.length > 2000)) {
    return { valid: false, error: 'Invalid referrerUrl' };
  }
  if (data.userAgent && (typeof data.userAgent !== 'string' || data.userAgent.length > 500)) {
    return { valid: false, error: 'Invalid userAgent' };
  }
  return { valid: true };
}

// Get client IP from request headers
function getClientIP(req: Request): string {
  // Check various headers for client IP (in order of preference)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  return 'unknown';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestData = await req.json();
    
    // Validate input
    const validation = validateInput(requestData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const {
      programId,
      destinationUrl,
      referrerUrl,
      userAgent
    } = requestData;

    // Get client IP from headers (more reliable than client-provided)
    const clientIP = getClientIP(req);

    // Rate limiting check
    const rateLimitResult = checkRateLimit(clientIP, programId);
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for IP ${clientIP}: ${rateLimitResult.reason}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: rateLimitResult.reason 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    // Generate unique click ID
    const clickId = `${programId}_${Date.now()}_${crypto.randomUUID()}`;

    // Get user if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      userId = user?.id;
    }

    // Detect device type from user agent
    const ua = userAgent || '';
    const deviceType = ua.includes('Mobile') ? 'mobile' : 
                       ua.includes('Tablet') ? 'tablet' : 'desktop';

    // Insert click record
    const { error } = await supabaseClient
      .from('affiliate_clicks')
      .insert({
        click_id: clickId,
        affiliate_program_id: programId.substring(0, 100),
        destination_url: destinationUrl.substring(0, 2000),
        referrer_url: referrerUrl?.substring(0, 2000) || null,
        user_id: userId,
        ip_address: clientIP !== 'unknown' ? clientIP : null,
        user_agent: ua.substring(0, 500) || null,
        device_type: deviceType
      });

    if (error) throw error;

    console.log(`Click tracked: ${clickId} from IP ${clientIP}`);

    return new Response(
      JSON.stringify({
        success: true,
        click_id: clickId,
        message: 'Click tracked successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error tracking click:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to track click'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});