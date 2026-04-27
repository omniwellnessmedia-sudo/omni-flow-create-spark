import { memo, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, Sparkles, X } from "lucide-react";

interface Alert {
  type: "warning" | "info" | "success";
  message: string;
}

interface SmartGreetingProps {
  userName?: string;
  role?: "admin" | "provider" | "user";
  alerts?: Alert[];
  subtitle?: string;
}

const SmartGreeting = memo(({ userName, role, alerts = [], subtitle }: SmartGreetingProps) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("dashboard-dismissed-alerts") || "[]");
    } catch {
      return [];
    }
  });

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.message));

  const dismissAlert = (message: string) => {
    const next = [...dismissedAlerts, message];
    setDismissedAlerts(next);
    sessionStorage.setItem("dashboard-dismissed-alerts", JSON.stringify(next));
  };

  const { greeting, emoji, timeStr, dateStr } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    let greeting: string;
    let emoji: string;

    if (hour < 6) { greeting = "Burning the midnight oil"; emoji = "🌙"; }
    else if (hour < 12) { greeting = "Good morning"; emoji = "☀️"; }
    else if (hour < 17) { greeting = "Good afternoon"; emoji = "👋"; }
    else if (hour < 21) { greeting = "Good evening"; emoji = "🌅"; }
    else { greeting = "Working late"; emoji = "🌙"; }

    const timeStr = now.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    return { greeting, emoji, timeStr, dateStr };
  }, []);

  const firstName = userName?.split(" ")[0] || "";

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-1">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
            {greeting}{firstName ? `, ${firstName}` : ""} {emoji}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            {timeStr} &middot; {dateStr}
            {subtitle && <> &middot; {subtitle}</>}
          </p>
        </div>
        {role && (
          <Badge variant="outline" className="text-[10px] w-fit shrink-0 gap-1">
            <Sparkles className="h-3 w-3" />
            {role === "admin" ? "Admin" : role === "provider" ? "Provider" : "Member"}
          </Badge>
        )}
      </div>

      {visibleAlerts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {visibleAlerts.map((alert, i) => (
            <div
              key={i}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                alert.type === "warning"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  : alert.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              }`}
            >
              {alert.type === "warning" ? (
                <AlertTriangle className="h-3 w-3" />
              ) : alert.type === "success" ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              <span>{alert.message}</span>
              <button type="button" onClick={() => dismissAlert(alert.message)} aria-label="Dismiss alert" className="ml-1 rounded-full hover:bg-background/40">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

SmartGreeting.displayName = "SmartGreeting";

export default SmartGreeting;
