import React from 'react';
import { ExternalLink, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PriceDisplay } from '@/components/ui/price-display';
import { TRAVEL_AND_TOURS, tourEnquiryMailto } from '@/data/travelAndTours';

/**
 * The booking card on every tour page: a hand-off to Travel and Tours Cape
 * Town, not a checkout.
 *
 * This used to take a date, a head count, eSIM add-ons and a card icon,
 * add it all up in dollars and write a booking row marked pending.
 * Nothing behind it took a payment, so a visitor
 * who pressed Book Now believed they had booked and paid for nothing, and
 * the team found out by email a day later. Tours are Travel and Tours'
 * business; this card says so and sends people there.
 *
 * The props are unchanged so the five tour pages that render it did not
 * have to change.
 *
 * No em dashes in this file.
 */

interface Tour {
  id: string;
  title: string;
  price_from: number;
  max_participants: number;
  destination: string;
  highlights?: string[];
}

interface TourBookingSidebarProps {
  tour: Tour;
}

const TourBookingSidebar: React.FC<TourBookingSidebarProps> = ({ tour }) => (
  <Card className="sticky top-6 shadow-lg">
    <CardHeader>
      <p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground" style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
        Booked through {TRAVEL_AND_TOURS.shortName}
      </p>
      <CardTitle className="text-2xl">Book this tour</CardTitle>
      {tour.price_from > 0 && (
        <div className="space-y-1">
          <PriceDisplay price={tour.price_from} size="lg" primaryCurrency="USD" />
          <span className="text-sm text-muted-foreground">from, per person</span>
        </div>
      )}
    </CardHeader>

    <CardContent className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {TRAVEL_AND_TOURS.name} runs this tour and takes the booking. Dates, group size and
        payment are confirmed with them directly.
        {tour.max_participants > 0 ? ` Groups up to ${tour.max_participants}.` : ''}
      </p>

      <div className="space-y-3">
        <Button asChild className="w-full" size="lg">
          <a href={TRAVEL_AND_TOURS.website} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-5 w-5" />
            Book with {TRAVEL_AND_TOURS.shortName}
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full" size="lg">
          <a href={tourEnquiryMailto(tour.title)}>
            <Mail className="mr-2 h-5 w-5" />
            Email an enquiry
          </a>
        </Button>
        <p className="text-xs text-muted-foreground">
          Enquiries go to {TRAVEL_AND_TOURS.email}, with Omni Wellness Media copied in.
        </p>
      </div>

      {tour.highlights && tour.highlights.length > 0 && (
        <div className="border-t pt-5">
          <h4 className="mb-3 font-semibold">What is included</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {tour.highlights.slice(0, 4).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
            {tour.highlights.length > 4 && (
              <li className="pl-6 text-xs text-muted-foreground">And {tour.highlights.length - 4} more.</li>
            )}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
);

export default TourBookingSidebar;
