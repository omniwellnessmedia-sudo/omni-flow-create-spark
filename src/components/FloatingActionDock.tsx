import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Compass, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/lib/images";

/**
 * FloatingActionDock — one floating button that expands to a stack of contextual actions.
 *
 * Replaces the previous trio of overlapping bottom-right widgets (RoamBuddy chat button,
 * AppTour TourTrigger, AccessibilitySettings) that all fought for the same corner.
 *
 * Actions exposed:
 *   - eSIM Help     → opens the RoamBuddy chatbot via a custom event
 *   - WhatsApp      → opens the Omni WhatsApp channel
 *   - Take Tour     → starts the AppTour via a custom event (HeroSection listens)
 *   - Accessibility → toggles the Accessibility panel via a custom event
 *
 * Hidden entirely on operator routes (auth, dashboards, admin) and remembered across
 * sessions via localStorage when the user clicks the Hide control.
 */

const HIDDEN_PATH_PREFIXES = [
  "/auth",
  "/admin",
  "/accountant",
  "/provider-dashboard",
  "/provider-portal",
  "/wellness-account",
  "/blog/editor",
];

const STORAGE_KEY = "omni:floating-dock-hidden";

const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbAwPluA89MadCKPxE1y";

type Action = {
  id: string;
  label: string;
  icon: typeof MessageCircle;
  onClick: () => void;
  // Brand colour for the action chip; falls back to primary teal
  tone?: string;
};

export const FloatingActionDock = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "1";
  });

  // Auto-collapse when the route changes so the dock doesn't stay open across navigations
  useEffect(() => { setExpanded(false); }, [location.pathname]);
  useEffect(() => () => { if (spinTimer.current) clearTimeout(spinTimer.current); }, []);

  // Trigger the logo's magical spin, then toggle the menu. CSS handles reduced-motion.
  const handleTriggerClick = () => {
    setSpinning(true);
    if (spinTimer.current) clearTimeout(spinTimer.current);
    spinTimer.current = setTimeout(() => setSpinning(false), 900);
    setExpanded(v => !v);
  };

  const onOperatorRoute = HIDDEN_PATH_PREFIXES.some(p => location.pathname.startsWith(p));
  if (onOperatorRoute || hidden) {
    // Operator routes get nothing. Manually-hidden users get only a small "show" affordance
    // that brings the dock back without making them dig through settings.
    if (hidden && !onOperatorRoute) {
      return (
        <button
          type="button"
          onClick={() => { localStorage.removeItem(STORAGE_KEY); setHidden(false); }}
          className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-40 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-foreground hover:bg-background shadow-md flex items-center justify-center transition-colors"
          aria-label="Show quick actions"
        >
          <Eye className="h-4 w-4" />
        </button>
      );
    }
    return null;
  }

  const actions: Action[] = [
    {
      id: "esim",
      label: "Need eSIM help?",
      icon: MessageCircle,
      onClick: () => window.dispatchEvent(new CustomEvent("omni:open-roambuddy-chat")),
      tone: "from-blue-600 to-blue-700",
    },
    {
      id: "whatsapp",
      label: "WhatsApp channel",
      icon: MessageCircle,
      onClick: () => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer"),
      tone: "from-emerald-500 to-emerald-600",
    },
    {
      id: "tour",
      label: "Take the tour",
      icon: Compass,
      onClick: () => window.dispatchEvent(new CustomEvent("omni:start-tour")),
      tone: "from-omni-orange to-amber-500",
    },
    // Accessibility intentionally omitted — it has its own subtle always-on button
    // (AccessibilitySettings) so it's reachable on operator routes too, where this dock is hidden.
  ];

  return (
    <div className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
      {expanded && (
        <div className="flex flex-col items-end gap-2 mb-1 pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-200">
          {actions.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => { a.onClick(); setExpanded(false); }}
              className={cn(
                "group flex items-center gap-2 pl-3 pr-4 py-2 rounded-full shadow-lg backdrop-blur-sm text-white text-sm font-medium",
                "bg-gradient-to-r", a.tone || "from-primary to-primary",
                "hover:scale-[1.03] transition-transform"
              )}
              style={{ animationDelay: `${i * 30}ms` }}
              data-cursor="hover"
            >
              <a.icon className="h-4 w-4 shrink-0" />
              <span>{a.label}</span>
            </button>
          ))}

          {/* Hide control — remembers across sessions */}
          <button
            type="button"
            onClick={() => { localStorage.setItem(STORAGE_KEY, "1"); setHidden(true); setExpanded(false); }}
            className="flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-cursor="hover"
          >
            <EyeOff className="h-3 w-3" />
            Hide for now
          </button>
        </div>
      )}

      {/* Main trigger — the Omni lotus logo. Breathes gently, spins on click. */}
      <button
        type="button"
        onClick={handleTriggerClick}
        className={cn(
          "pointer-events-auto h-14 w-14 rounded-full overflow-hidden shadow-2xl flex items-center justify-center transition-all",
          "bg-white/95 backdrop-blur-sm ring-1 ring-border/40 hover:shadow-xl hover:scale-105"
        )}
        aria-expanded={expanded}
        aria-label={expanded ? "Close quick actions" : "Open quick actions"}
        data-cursor="hover"
      >
        {expanded ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <img
            src={IMAGES.logos.omniCircularBadge}
            alt="Omni — open quick actions"
            className={cn("h-full w-full rounded-full object-cover magic-logo", spinning && "is-spinning")}
            draggable={false}
          />
        )}
      </button>
    </div>
  );
};

export default FloatingActionDock;
