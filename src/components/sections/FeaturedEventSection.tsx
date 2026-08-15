import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SmartImage from '@/components/ui/smart-image';
import { EVENT_CONCLUDED, WHAT_FEEDS_US_CREDIT } from '@/pages/events/wwpl/event';

/**
 * Homepage feature spot for the current flagship event.
 * Copy mirrors the source-of-truth constants in src/pages/events/StunningPigs.tsx —
 * if the event details change there, update here too.
 */
const SESSIONS = [
  { time: '10:00', title: 'What Feeds Us' },
  { time: '12:00', title: 'Stunning Pigs — Cape Town Premiere + Q&A' },
  { time: '14:00', title: 'Voices for Women Showcase & Awards' },
];

const FeaturedEventSection = () => {
  return (
    <section aria-labelledby="featured-event-heading" className="bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 items-center max-w-5xl mx-auto">
          <Link
            to="/events/stunning-pigs"
            aria-label="Celebrating Women Who Protect Life, event details"
            className="block rounded-2xl overflow-hidden shadow-lg ring-1 ring-border/60 hover:shadow-xl transition-shadow"
          >
            <SmartImage
              src="/events/wwpl-square.png"
              alt="Celebrating Women Who Protect Life — official poster. Monday 10 August 2026, The Masque Theatre, Muizenberg."
              className="w-full h-auto aspect-square object-cover"
            />
          </Link>

          <div>
            <Badge className="mb-4 bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">
              Featured Event · Women's Day
            </Badge>
            <h2 id="featured-event-heading" className="text-3xl md:text-4xl font-bold mb-3">
              Celebrating Women Who Protect Life
            </h2>
            <p className="text-muted-foreground mb-5">
              Featuring the Cape Town premiere of <em>Stunning Pigs</em> — a day of film,
              food and recognition honouring the women who feed, guard and grow our communities.
            </p>

            <div className="space-y-2 text-sm mb-5">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-rose-500 shrink-0" />
                Monday 10 August 2026
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                The Masque Theatre, 37 Main Road, Muizenberg
              </p>
              {SESSIONS.map((s) => (
                <p key={s.time} className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-rose-500 shrink-0" />
                  {s.time} — {s.title}
                </p>
              ))}
              {/* The event concluded on 10 Aug 2026. Advertising a price and
                  "tickets on Quicket" after that date is a false commercial
                  claim on the site's highest-traffic page, so the sales line
                  is replaced rather than left to age. */}
              <p className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-rose-500 shrink-0" />
                {EVENT_CONCLUDED
                  ? 'This event has concluded'
                  : 'R150 per session · tickets on Quicket'}
              </p>
              {/* Required production credit — must appear wherever the film is
                  named. Imported so the wording can never drift. */}
              <p className="text-xs text-muted-foreground/80 pt-1">
                <em>What Feeds Us</em> — {WHAT_FEEDS_US_CREDIT}
              </p>
            </div>

            <Button asChild size="lg">
              <Link to="/events/stunning-pigs">
                {EVENT_CONCLUDED ? 'See what happened' : 'Event details & tickets'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventSection;
