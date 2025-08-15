import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { 
      name, 
      email, 
      phone, 
      company, 
      service_type, 
      project_details, 
      budget_range, 
      timeline 
    } = await req.json();

    // Input sanitization function to prevent XSS
    const sanitizeInput = (input: string): string => {
      if (!input) return "";
      return input
        .replace(/[<>]/g, "") // Remove potential script tags
        .replace(/javascript:/gi, "") // Remove javascript: protocols
        .replace(/on\w+\s*=/gi, "") // Remove event handlers
        .trim()
        .substring(0, 2000); // Limit length
    };

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;

    if (!name || !email || !service_type || !project_details) {
      return new Response(
        JSON.stringify({ error: "Name, email, service type, and project details are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (phone && !phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid phone number" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Sanitize all inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;
    const sanitizedCompany = company ? sanitizeInput(company) : null;
    const sanitizedServiceType = sanitizeInput(service_type);
    const sanitizedProjectDetails = sanitizeInput(project_details);
    const sanitizedBudgetRange = budget_range ? sanitizeInput(budget_range) : null;
    const sanitizedTimeline = timeline ? sanitizeInput(timeline) : null;

    const { data, error } = await supabase
      .from("service_quotes")
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        company: sanitizedCompany,
        service_type: sanitizedServiceType,
        project_details: sanitizedProjectDetails,
        budget_range: sanitizedBudgetRange,
        timeline: sanitizedTimeline,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit service quote" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});