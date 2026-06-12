import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Leaf, Users, Heart, ArrowRight } from "lucide-react";
import { addMonths, endOfMonth, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CommunityEvent {
  id: string;
  title: string;
  location?: string;
  date: Date;
  category: "cleanup" | "workshop" | "tour" | "drive" | "volunteer";
}

// Sample events — will move to a `community_events` table once the schema lands.
// Dates are anchored on today so the calendar always feels live.
const SAMPLE_EVENTS = (): CommunityEvent[] => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return [
    { id: "1", title: "Beach Cleanup", location: "Muizenberg Beach", date: new Date(y, m, 7, 9, 0), category: "cleanup" },
    { id: "2", title: "Youth Empowerment Workshop", date: new Date(y, m, 16, 10, 0), category: "workshop" },
    { id: "3", title: "Community Food Drive", location: "Hanover Park", date: new Date(y, m, 28, 11, 0), category: "drive" },
  ];
};

const CATEGORY_ICON: Record<CommunityEvent["category"], typeof Leaf> = {
  cleanup: Leaf,
  workshop: Users,
  tour: ArrowRight,
  drive: Heart,
  volunteer: Users,
};

const CATEGORY_STYLE: Record<CommunityEvent["category"], string> = {
  cleanup: "bg-omni-green/10 text-omni-green",
  workshop: "bg-omni-orange/10 text-omni-orange",
  tour: "bg-omni-violet/10 text-omni-violet",
  drive: "bg-omni-blue/10 text-omni-blue",
  volunteer: "bg-primary/10 text-primary",
};

const CommunityCalendar = () => {
  const events = useMemo(SAMPLE_EVENTS, []);
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const days = useMemo(() => {
    // Whole weeks so the grid is always rectangular
    const start = startOfWeek(startOfMonth(monthCursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(monthCursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [monthCursor]);

  const eventDateKeys = useMemo(
    () => new Set(events.map(e => format(e.date, "yyyy-MM-dd"))),
    [events]
  );

  const upcoming = useMemo(
    () => [...events].filter(e => e.date >= new Date(new Date().setHours(0, 0, 0, 0))).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 3),
    [events]
  );

  return (
    <Card className="border-border/50 magic-card">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg leading-tight">Community Calendar</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Upcoming events & opportunities</p>
            </div>
          </div>
          <Link to="/community/events" className="text-xs font-medium text-primary hover:underline shrink-0 mt-2">
            View full calendar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Calendar grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-sm">{format(monthCursor, "MMMM yyyy")}</div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setMonthCursor(prev => addMonths(prev, -1))}
                  className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMonthCursor(prev => addMonths(prev, 1))}
                  className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
                <div key={d} className="text-[10px] font-medium text-muted-foreground text-center py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map(day => {
                const inMonth = isSameMonth(day, monthCursor);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const hasEvent = eventDateKeys.has(format(day, "yyyy-MM-dd"));
                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative h-9 sm:h-10 rounded-lg text-sm transition-colors",
                      !inMonth && "text-muted-foreground/40",
                      inMonth && !isSelected && !isToday && "hover:bg-muted",
                      isToday && !isSelected && "bg-primary text-primary-foreground font-medium",
                      isSelected && !isToday && "bg-muted font-medium",
                    )}
                    aria-label={format(day, "PPP")}
                  >
                    {format(day, "d")}
                    {hasEvent && (
                      <span className={cn(
                        "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                        isToday ? "bg-primary-foreground" : "bg-omni-green"
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming events list */}
          <div className="lg:col-span-2 space-y-2.5">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming events yet. Check back soon.
              </p>
            ) : (
              upcoming.map(evt => {
                const Icon = CATEGORY_ICON[evt.category];
                return (
                  <div key={evt.id} className="flex items-start gap-3 p-3 rounded-xl border border-border/40 hover:border-border transition-colors">
                    <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", CATEGORY_STYLE[evt.category])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm leading-tight">{evt.title}</div>
                      {evt.location && <div className="text-xs text-muted-foreground mt-0.5">{evt.location}</div>}
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {format(evt.date, "d MMM yyyy")} · {format(evt.date, "h:mm a")}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <Link
              to="/community/events"
              className="flex items-center justify-end gap-1 text-xs font-medium text-primary hover:underline pt-1"
            >
              View all events <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCalendar;
