import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";
import { useFeatureFlag } from "@/hooks/useFeatureFlags";
import { supabase } from "@/integrations/supabase/client";

interface CalComBookingProps {
  eventTypeSlug?: string;
  calUsername?: string;
  prefillData?: {
    name?: string;
    email?: string;
    notes?: string;
  };
  embedMode?: "inline" | "popup" | "modal";
  onBookingSuccess?: (data: BookingData) => void;
  fallbackEmail?: string;
  buttonText?: string;
  buttonClassName?: string;
}

interface BookingData {
  eventTypeSlug: string;
  bookingId: string;
  date: string;
}

interface GlobalSettings {
  calcom_username: string;
  default_event_slug: string;
  embed_mode: string;
}

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void;
      q?: unknown[];
      ns?: Record<string, unknown>;
      loaded?: boolean;
    };
  }
}

export const CalComBooking = ({
  eventTypeSlug,
  calUsername,
  prefillData,
  embedMode = "popup",
  onBookingSuccess,
  fallbackEmail = "admin@omniwellnessmedia.co.za",
  buttonText = "Book Session",
  buttonClassName = "",
}: CalComBookingProps) => {
  const { isEnabled: calComEnabled, loading: flagLoading } = useFeatureFlag("calcom_integration");
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
  const [calLoaded, setCalLoaded] = useState(false);

  // Fetch global Cal.com settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("calcom_global_settings")
        .select("setting_key, setting_value");

      if (!error && data) {
        const settings: GlobalSettings = {
          calcom_username: "omniwellnessmedia",
          default_event_slug: "discovery-call",
          embed_mode: "popup",
        };
        
        data.forEach((item) => {
          if (item.setting_key === "calcom_username") {
            settings.calcom_username = item.setting_value;
          } else if (item.setting_key === "default_event_slug") {
            settings.default_event_slug = item.setting_value;
          } else if (item.setting_key === "embed_mode") {
            settings.embed_mode = item.setting_value;
          }
        });
        
        setGlobalSettings(settings);
      }
    };

    fetchSettings();
  }, []);

  // Load Cal.com embed script
  useEffect(() => {
    if (!calComEnabled || calLoaded) return;

    const loadCalEmbed = () => {
      if (window.Cal) {
        setCalLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.innerHTML = `
        (function (C, A, L) {
          let p = function (a, ar) { a.q.push(ar); };
          let d = C.document;
          C.Cal = C.Cal || function () {
            let cal = C.Cal;
            let ar = arguments;
            if (!cal.loaded) {
              cal.ns = {};
              cal.q = cal.q || [];
              d.head.appendChild(d.createElement("script")).src = A;
              cal.loaded = true;
            }
            if (ar[0] === L) {
              const api = function () { p(api, arguments); };
              const namespace = ar[1];
              api.q = api.q || [];
              typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
              return;
            }
            p(cal, ar);
          };
        })(window, "https://app.cal.com/embed/embed.js", "init");
      `;
      document.head.appendChild(script);

      // Wait for script to load
      const checkLoaded = setInterval(() => {
        if (window.Cal) {
          setCalLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);

      // Cleanup timeout
      setTimeout(() => clearInterval(checkLoaded), 5000);
    };

    loadCalEmbed();
  }, [calComEnabled, calLoaded]);

  // Initialize Cal.com when loaded
  useEffect(() => {
    if (!calLoaded || !window.Cal) return;

    const username = calUsername || globalSettings?.calcom_username || "omniwellnessmedia";
    const eventSlug = eventTypeSlug || globalSettings?.default_event_slug || "discovery-call";
    const mode = embedMode || globalSettings?.embed_mode || "popup";

    // Initialize Cal.com
    window.Cal("init", { origin: "https://app.cal.com" });

    // Set up UI configuration
    window.Cal("ui", {
      theme: "light",
      styles: { branding: { brandColor: "#339999" } },
      hideEventTypeDetails: false,
    });

    // Listen for booking success
    window.Cal("on", {
      action: "bookingSuccessful",
      callback: (e: unknown) => {
        console.log("Cal.com booking successful:", e);
        const bookingUid = (e as { detail?: { data?: { uid?: string } } })?.detail?.data?.uid || "";

        // Save booking lead to DB for dashboard sync
        supabase.from("contact_submissions").insert({
          name: prefillData?.name || "Cal.com Booking",
          email: prefillData?.email || "calcom-booking@capture.com",
          message: `Cal.com booking confirmed: ${eventSlug} (ID: ${bookingUid})`,
          service: eventSlug.replace(/-/g, " "),
          status: "pending",
        }).then(({ error }) => {
          if (error) console.error("Cal.com lead save error:", error);
        });

        if (onBookingSuccess) {
          onBookingSuccess({
            eventTypeSlug: eventSlug,
            bookingId: bookingUid,
            date: new Date().toISOString(),
          });
        }
      },
    });
  }, [calLoaded, calUsername, eventTypeSlug, embedMode, globalSettings, onBookingSuccess]);

  const handleCalClick = useCallback(() => {
    if (!window.Cal) return;

    const username = calUsername || globalSettings?.calcom_username || "omniwellnessmedia";
    const eventSlug = eventTypeSlug || globalSettings?.default_event_slug || "discovery-call";
    const calLink = `${username}/${eventSlug}`;

    const config: Record<string, unknown> = {
      calLink,
      config: {
        layout: "month_view",
      },
    };

    if (prefillData) {
      config.config = {
        ...config.config as object,
        name: prefillData.name,
        email: prefillData.email,
        notes: prefillData.notes,
      };
    }

    if (embedMode === "modal") {
      window.Cal("modal", config);
    } else {
      window.Cal("popup", config);
    }
  }, [calUsername, eventTypeSlug, embedMode, prefillData, globalSettings]);

  const handleFallbackClick = async () => {
    // Save lead to DB even when using email fallback
    const slug = eventTypeSlug || globalSettings?.default_event_slug || "discovery-call";
    try {
      await supabase.from("contact_submissions").insert({
        name: prefillData?.name || "Website Visitor",
        email: prefillData?.email || "pending@capture.com",
        message: `Booking request via Cal.com fallback for: ${slug}`,
        service: slug.replace(/-/g, " "),
        status: "pending",
      });
    } catch (err) {
      console.error("Lead capture error:", err);
    }

    const subject = encodeURIComponent("Booking Request - Omni Wellness Media");
    const body = encodeURIComponent(
      `Hi,\n\nI would like to book a session.\n\nName: ${prefillData?.name || ""}\nPreferred Date/Time: \n\nThank you!`
    );
    window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
  };

  // Show loading state
  if (flagLoading) {
    return (
      <Button disabled className={`min-h-[44px] ${buttonClassName}`}>
        <Calendar className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  // If Cal.com is disabled, show fallback mailto button
  if (!calComEnabled) {
    return (
      <Button
        onClick={handleFallbackClick}
        className={`min-h-[44px] bg-gradient-rainbow hover:opacity-90 ${buttonClassName}`}
      >
        <Calendar className="w-4 h-4 mr-2" />
        {buttonText}
      </Button>
    );
  }

  // Inline embed mode
  if (embedMode === "inline") {
    const username = calUsername || globalSettings?.calcom_username || "omniwellnessmedia";
    const eventSlug = eventTypeSlug || globalSettings?.default_event_slug || "discovery-call";
    
    return (
      <div className="w-full">
        <iframe
          src={`https://app.cal.com/${username}/${eventSlug}?embed=true&theme=light`}
          className="w-full min-h-[600px] border-0 rounded-lg"
          title="Book a session"
        />
      </div>
    );
  }

  // Popup/Modal button
  return (
    <Button
      onClick={handleCalClick}
      className={`min-h-[44px] bg-gradient-rainbow hover:opacity-90 ${buttonClassName}`}
      disabled={!calLoaded}
    >
      <Calendar className="w-4 h-4 mr-2" />
      {calLoaded ? buttonText : "Loading Calendar..."}
      {calLoaded && <ExternalLink className="w-3 h-3 ml-2" />}
    </Button>
  );
};

export default CalComBooking;
