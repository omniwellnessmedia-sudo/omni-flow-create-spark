import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  addMonths, endOfMonth, format, isSameDay, isSameMonth,
  startOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
} from "date-fns";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCommunityEvents, CATEGORY_ICON, CATEGORY_STYLE, CATEGORY_LABEL,
  type CommunityEventCategory,
} from "@/data/communityEvents";

const ALL = "all" as const;

const CommunityEvents = () => {
  const events = useMemo(getCommunityEvents, []);
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [filter, setFilter] = useState<CommunityEventCategory | typeof ALL>(ALL);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(monthCursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(monthCursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [monthCursor]);

  const filtered = useMemo(
    () => (filter === ALL ? events : events.filter(e => e.category === filter)),
    [events, filter]
  );

  const eventDateKeys = useMemo(
    () => new Set(filtered.map(e => format(e.date, "yyyy-MM-dd"))),
    [filtered]
  );

  const upcoming = useMemo(
    () =>
      [...filtered]
        .filter(e => e.date >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [filtered]
  );

  const selectedDayEvents = useMemo(
    () => (selectedDate ? filtered.filter(e => isSameDay(e.date, selectedDate)) : []),
    [filtered, selectedDate]
  );

  const categories = Object.keys(CATEGORY_LABEL) as CommunityEventCategory[];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-omni-violet/5 to-omni-blue/10 border-b border-border/50">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <Link
            to="/community"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Community
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl leading-tight">Community Calendar</h1>
              <p className="text-muted-foreground mt-1">
                Cleanups, workshops, wellness sessions and impact outings across Cape Town.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setFilter(ALL)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              filter === ALL
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/60 text-muted-foreground hover:bg-muted"
            )}
          >
            All events
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                filter === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:bg-muted"
              )}
            >
              {CATEGORY_LABEL[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Calendar grid */}
          <div className="lg:col-span-3">
            <Card className="border-border/50">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-heading text-lg">{format(monthCursor, "MMMM yyyy")}</div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setMonthCursor(prev => addMonths(prev, -1))}
                      className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthCursor(prev => addMonths(prev, 1))}
                      className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center"
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
                          "relative h-12 sm:h-14 rounded-lg text-sm transition-colors flex items-start justify-center pt-2",
                          !inMonth && "text-muted-foreground/40",
                          inMonth && !isSelected && !isToday && "hover:bg-muted",
                          isToday && !isSelected && "bg-primary text-primary-foreground font-medium",
                          isSelected && !isToday && "bg-muted font-medium ring-1 ring-primary/30",
                        )}
                        aria-label={format(day, "PPP")}
                      >
                        {format(day, "d")}
                        {hasEvent && (
                          <span className={cn(
                            "absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full",
                            isToday ? "bg-primary-foreground" : "bg-omni-green"
                          )} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected day */}
                {selectedDate && (
                  <div className="mt-6 pt-5 border-t border-border/40">
                    <div className="text-sm font-medium mb-3">
                      {format(selectedDate, "EEEE, d MMMM yyyy")}
                    </div>
                    {selectedDayEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedDayEvents.map(evt => {
                          const Icon = CATEGORY_ICON[evt.category];
                          return (
                            <div key={evt.id} className="flex items-start gap-3">
                              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", CATEGORY_STYLE[evt.category])}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium">{evt.title}</div>
                                <div className="text-xs text-muted-foreground">{format(evt.date, "h:mm a")}{evt.location ? ` · ${evt.location}` : ""}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming events list */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl mb-4">Upcoming events</h2>
            {upcoming.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center text-muted-foreground text-sm">
                  No upcoming events in this category yet. Check back soon.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcoming.map(evt => {
                  const Icon = CATEGORY_ICON[evt.category];
                  return (
                    <Card key={evt.id} className="border-border/50 hover:border-border transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", CATEGORY_STYLE[evt.category])}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium leading-tight">{evt.title}</h3>
                              <Badge variant="outline" className="text-[10px] shrink-0">{CATEGORY_LABEL[evt.category]}</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5">
                              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{format(evt.date, "d MMM yyyy · h:mm a")}</span>
                              {evt.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{evt.location}</span>}
                            </div>
                            {evt.description && (
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{evt.description}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Card className="border-primary/20 bg-primary/5 mt-6">
              <CardContent className="p-5">
                <h3 className="font-medium mb-1">Want to host or suggest an event?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Community impact is at the heart of Omni. Reach out to get your initiative on the calendar.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/contact">Get in touch</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityEvents;
