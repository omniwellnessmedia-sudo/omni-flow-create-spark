import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Users, Plus, Minus, Send, CreditCard, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter';
import { PriceDisplay } from '@/components/ui/price-display';

interface Tour {
  id: string;
  title: string;
  price_from: number;
  max_participants: number;
  destination: string;
  highlights?: string[];
}

interface RoamBuddyService {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface TourBookingSidebarProps {
  tour: Tour;
}

const TourBookingSidebar: React.FC<TourBookingSidebarProps> = ({ tour }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [roamBuddyServices, setRoamBuddyServices] = useState<RoamBuddyService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [esimSearch, setEsimSearch] = useState('');
  const [showAllEsims, setShowAllEsims] = useState(false);
  const { toast } = useToast();
  const { formatUSD, formatZAR, convertZARToUSD } = useCurrencyConverter();

  const fetchRoamBuddyServices = useCallback(async () => {
    setServicesLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('roambuddy-api', {
        body: {
          action: 'getServices',
          data: { destination: tour.destination }
        }
      });

      if (error) throw error;

      if (data?.success && data?.data?.services) {
        setRoamBuddyServices(data.data.services);
      } else {
        // RoamBuddy eSIM services for South Africa
        setRoamBuddyServices([
          { id: 'esim-sa-1gb', name: 'South Africa eSIM - 1GB', price: 12, description: '1GB data valid for 7 days in South Africa' },
          { id: 'esim-sa-3gb', name: 'South Africa eSIM - 3GB', price: 25, description: '3GB data valid for 30 days in South Africa' },
          { id: 'esim-sa-5gb', name: 'South Africa eSIM - 5GB', price: 39, description: '5GB data valid for 30 days in South Africa' },
          { id: 'esim-africa-regional', name: 'Africa Regional eSIM - 2GB', price: 35, description: '2GB data for multiple African countries, 30 days' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching RoamBuddy services:', error);
      // Show RoamBuddy eSIM services on error
      setRoamBuddyServices([
        { id: 'esim-sa-1gb', name: 'South Africa eSIM - 1GB', price: 12, description: '1GB data valid for 7 days in South Africa' },
        { id: 'esim-sa-3gb', name: 'South Africa eSIM - 3GB', price: 25, description: '3GB data valid for 30 days in South Africa' },
        { id: 'esim-sa-5gb', name: 'South Africa eSIM - 5GB', price: 39, description: '5GB data valid for 30 days in South Africa' },
        { id: 'esim-africa-regional', name: 'Africa Regional eSIM - 2GB', price: 35, description: '2GB data for multiple African countries, 30 days' },
      ]);
    } finally {
      setServicesLoading(false);
    }
  }, [tour.destination]);

  useEffect(() => {
    fetchRoamBuddyServices();
  }, [fetchRoamBuddyServices]);

  const calculateTotal = () => {
    const basePrice = tour.price_from * participants;
    const servicesTotal = selectedServices.reduce((total, serviceId) => {
      const service = roamBuddyServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    return basePrice + servicesTotal;
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBookNow = async () => {
    if (!selectedDate || !contactName || !contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const roambuddyServiceDetails = selectedServices.map(id => {
        const service = roamBuddyServices.find(s => s.id === id);
        return { id, name: service?.name, price: service?.price };
      });

      // Build booking data — omit user_id if not authenticated (column may have FK or NOT NULL)
      const bookingData: Record<string, unknown> = {
        tour_id: tour.id,
        booking_date: selectedDate,
        participants,
        total_price: calculateTotal(),
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        special_requirements: specialRequirements || null,
        roambuddy_services: roambuddyServiceDetails.length > 0 ? roambuddyServiceDetails : null,
        status: 'pending',
        payment_status: 'pending'
      };

      // Only set user_id if the user is actually authenticated
      if (user?.id) {
        bookingData.user_id = user.id;
      }

      const { error } = await supabase
        .from('tour_bookings')
        .insert([bookingData]);

      if (error) {
        console.error('Tour booking DB error:', error);
        // If user_id is required by the DB and user isn't logged in, fall back to email enquiry
        if (error.message?.includes('user_id') || error.code === '23502') {
          // Save as lead in contact_submissions instead
          await supabase.from('contact_submissions').insert({
            name: contactName,
            email: contactEmail,
            message: `Tour Booking Request: ${tour.title}\nDate: ${selectedDate}\nParticipants: ${participants}\nTotal: $${calculateTotal()}\nPhone: ${contactPhone || 'N/A'}\nSpecial Requirements: ${specialRequirements || 'None'}\neSIM Add-ons: ${roambuddyServiceDetails.map(s => s.name).join(', ') || 'None'}`,
            service: `Tour: ${tour.title}`,
            status: 'pending',
          });

          // Also send email notification
          supabase.functions.invoke('submit-contact', {
            body: {
              name: contactName,
              email: contactEmail,
              message: `Tour Booking Request: ${tour.title}\nDate: ${selectedDate}\nParticipants: ${participants}\nTotal: $${calculateTotal()}`,
              service: `Tour: ${tour.title}`,
            },
          }).catch(err => console.error('Notification error:', err));
        } else {
          throw error;
        }
      }

      toast({
        title: "Booking Submitted!",
        description: "We'll contact you within 24 hours to confirm your booking.",
      });

      // Reset form
      setSelectedDate('');
      setParticipants(1);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setSpecialRequirements('');
      setSelectedServices([]);

    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : "Unable to submit booking. Please try again.";
      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnquiry = () => {
    const subject = `Enquiry about ${tour.title}`;
    const body = `Hi,\n\nI'm interested in learning more about the ${tour.title} tour.\n\nPlease send me more information.\n\nBest regards,\n${contactName || '[Your Name]'}`;
    const mailtoLink = `mailto:traveltourscapetown@gmail.com?cc=admin@omniwellnessmedia.co.za&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7); // Minimum 7 days from today

  return (
    <Card className="sticky top-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Book Your Journey</CardTitle>
        <div className="space-y-1">
          <PriceDisplay 
            price={tour.price_from} 
            size="lg" 
            primaryCurrency="USD"
          />
          <span className="text-sm text-muted-foreground">per person</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div>
          <Label htmlFor="date" className="text-sm font-medium">Select Date *</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate.toISOString().split('T')[0]}
            className="mt-1"
            required
          />
        </div>

        {/* Participants */}
        <div>
          <Label className="text-sm font-medium">Participants *</Label>
          <div className="flex items-center space-x-3 mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setParticipants(Math.max(1, participants - 1))}
              disabled={participants <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold w-12 text-center">{participants}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setParticipants(Math.min(tour.max_participants, participants + 1))}
              disabled={participants >= tour.max_participants}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Maximum {tour.max_participants} participants
          </p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-semibold">Contact Information</h4>
          <div>
            <Label htmlFor="name" className="text-sm">Full Name *</Label>
            <Input
              id="name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm">Phone Number</Label>
            <Input
              id="phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* RoamBuddy Services */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Stay Connected - RoamBuddy eSIM</h4>
          <p className="text-xs text-muted-foreground mb-3">Add eSIM data plans to stay connected during your journey</p>
          
          {/* eSIM Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search eSIM plans..."
              value={esimSearch}
              onChange={(e) => setEsimSearch(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          
          {servicesLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <>
              {/* Filtered Services */}
              {(() => {
                const filteredServices = roamBuddyServices.filter(service => {
                  const matchesSearch = service.name.toLowerCase().includes(esimSearch.toLowerCase()) ||
                                       service.description.toLowerCase().includes(esimSearch.toLowerCase());
                  const isRelevant = service.name.toLowerCase().includes('south africa') || 
                                    service.name.toLowerCase().includes('africa') ||
                                    service.description.toLowerCase().includes('south africa') ||
                                    service.description.toLowerCase().includes('africa');
                  
                  if (esimSearch) return matchesSearch;
                  return showAllEsims || isRelevant;
                });

                return (
                  <>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto">
                      {filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                          <div key={service.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={`service-${service.id}`}
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={() => handleServiceToggle(service.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <label 
                                htmlFor={`service-${service.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {service.name}
                              </label>
                              <p className="text-xs text-muted-foreground">{service.description}</p>
                              <p className="text-sm font-semibold text-primary">{formatUSD(service.price)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No eSIM plans found matching "{esimSearch}"
                        </p>
                      )}
                    </div>

                    {/* Show More / Show Less Toggle */}
                    {!esimSearch && roamBuddyServices.length > 4 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllEsims(!showAllEsims)}
                        className="w-full mt-2 text-xs"
                      >
                        {showAllEsims ? (
                          <>
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Show Relevant Only
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Show All Countries ({roamBuddyServices.length})
                          </>
                        )}
                      </Button>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </div>

        {/* Special Requirements */}
        <div>
          <Label htmlFor="requirements" className="text-sm">Special Requirements</Label>
          <Textarea
            id="requirements"
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            placeholder="Dietary restrictions, accessibility needs, etc."
            rows={3}
          />
        </div>

        {/* Price Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Base price ({participants} {participants === 1 ? 'person' : 'people'})</span>
            <PriceDisplay 
              price={tour.price_from * participants} 
              size="sm" 
              primaryCurrency="USD"
              showBothCurrencies={false}
            />
          </div>
          {selectedServices.length > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span>Additional services</span>
              <span className="font-medium">
                {formatUSD(selectedServices.reduce((total, serviceId) => {
                  const service = roamBuddyServices.find(s => s.id === serviceId);
                  return total + (service?.price || 0);
                }, 0))}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <PriceDisplay 
              price={calculateTotal()} 
              size="lg" 
              primaryCurrency="USD"
            />
          </div>
        </div>

        {/* Booking Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleBookNow}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Book Now
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleEnquiry}
            className="w-full"
            size="lg"
          >
            <Send className="mr-2 h-5 w-5" />
            Send Enquiry
          </Button>
        </div>

        {/* Tour Features */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className="pt-6 border-t">
            <h4 className="font-semibold mb-3">What's Included</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {tour.highlights.slice(0, 4).map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{highlight}</span>
                </li>
              ))}
              {tour.highlights.length > 4 && (
                <li className="text-xs text-muted-foreground pl-6">
                  And {tour.highlights.length - 4} more...
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TourBookingSidebar;