import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  MapPin,
  Video,
  Banknote,
  Coins,
} from 'lucide-react';

interface ProviderAvailability {
  days?: string[];
  startTime?: string;
  endTime?: string;
}

interface BookingSystemProps {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  providerId: string;
  providerName: string;
  providerEmail?: string;
  isOnline?: boolean;
  buttonClassName?: string;
  buttonLabel?: string;
  providerAvailability?: ProviderAvailability;
}

interface BookingDetails {
  date: Date | undefined;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  paymentMethod: 'eft' | 'wellcoins' | 'cash';
}

const ALL_TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00',
];

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function getAvailableSlots(av?: ProviderAvailability): string[] {
  if (!av) return ALL_TIME_SLOTS.filter(t => t >= '09:00' && t <= '17:30');
  const start = av.startTime || '09:00';
  const end = av.endTime || '17:30';
  return ALL_TIME_SLOTS.filter(t => t >= start && t <= end);
}

const BookingSystem: React.FC<BookingSystemProps> = ({
  serviceId,
  serviceName,
  servicePrice,
  serviceDuration,
  providerId,
  providerName,
  providerEmail,
  isOnline = false,
  buttonClassName = '',
  buttonLabel,
  providerAvailability,
}) => {
  const { user } = useAuth();
  const isFree = servicePrice === 0;

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'datetime' | 'details' | 'payment' | 'confirmation'>('datetime');
  const [booking, setBooking] = useState<BookingDetails>({
    date: undefined,
    time: '',
    customerName: user?.user_metadata?.full_name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    notes: '',
    paymentMethod: 'cash',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = isFree
    ? ['datetime', 'details', 'confirmation']
    : ['datetime', 'details', 'payment', 'confirmation'];

  const availableDays = providerAvailability?.days || ['mon', 'tue', 'wed', 'thu', 'fri'];
  const availableSlots = getAvailableSlots(providerAvailability);

  const isDateDisabled = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true;
    const dayKey = DAY_KEYS[date.getDay()];
    return !availableDays.includes(dayKey);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setBooking(prev => ({ ...prev, date, time: '' }));
  };

  const handleTimeSelect = (time: string) => {
    setBooking(prev => ({ ...prev, time }));
    if (booking.date && time) setStep('details');
  };

  const handleDetailsNext = () => {
    if (!booking.customerName.trim() || !booking.customerEmail.trim()) {
      toast.error('Please fill in your name and email');
      return;
    }
    setStep(isFree ? 'confirmation' : 'payment');
    if (isFree) submitBooking({ ...booking });
  };

  const submitBooking = async (data: BookingDetails) => {
    setIsProcessing(true);
    try {
      const bookingDate = data.date ? data.date.toISOString().split('T')[0] : '';
      const fullMessage = [
        `Service Booking: ${serviceName}`,
        `Provider: ${providerName}`,
        `Date: ${bookingDate} at ${data.time}`,
        `Duration: ${serviceDuration} minutes`,
        `Price: ${isFree ? 'FREE' : `R${servicePrice}`}`,
        `Payment: ${data.paymentMethod}`,
        `Location: ${isOnline ? 'Online (Zoom link provided)' : 'In-person'}`,
        data.notes ? `Notes: ${data.notes}` : '',
        data.customerPhone ? `Phone: ${data.customerPhone}` : '',
      ].filter(Boolean).join('\n');

      await supabase.from('contact_submissions').insert({
        name: data.customerName,
        email: data.customerEmail,
        message: fullMessage,
        service: serviceName,
        status: 'pending',
      });

      // Notify the client
      supabase.functions.invoke('submit-contact', {
        body: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
          message: fullMessage,
          service: serviceName,
        },
      }).catch(() => {});

      // Notify the provider
      if (providerEmail) {
        supabase.functions.invoke('submit-contact', {
          body: {
            name: `Booking request from ${data.customerName}`,
            email: providerEmail,
            phone: data.customerPhone,
            message: `New booking request!\n\n${fullMessage}\n\nClient email: ${data.customerEmail}`,
            service: serviceName,
          },
        }).catch(() => {});
      }

      if (typeof window.tagClarityEvent === 'function') {
        window.tagClarityEvent('booking', serviceName);
        window.tagClarityEvent('booking_value', String(servicePrice));
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to save your request. Please try emailing us directly.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookingSubmit = async () => {
    await submitBooking(booking);
    setStep('confirmation');
  };

  const resetBooking = () => {
    setStep('datetime');
    setBooking({
      date: undefined,
      time: '',
      customerName: user?.user_metadata?.full_name || '',
      customerEmail: user?.email || '',
      customerPhone: '',
      notes: '',
      paymentMethod: 'cash',
    });
    setIsOpen(false);
  };

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Date &amp; Time</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">Choose Date</Label>
          <Calendar
            mode="single"
            selected={booking.date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
          {providerAvailability?.days && (
            <p className="text-xs text-muted-foreground mt-1">
              Available: {availableDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
            </p>
          )}
        </div>
        <div>
          <Label className="text-sm font-medium mb-2 block">Choose Time</Label>
          {booking.date ? (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {availableSlots.map((time) => (
                <Button
                  key={time}
                  variant={booking.time === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTimeSelect(time)}
                  className="justify-start"
                >
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  {time}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Please select a date first</p>
          )}
        </div>
      </div>

      {booking.date && booking.time && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900">
          <h4 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">Summary</h4>
          <div className="space-y-1 text-sm text-emerald-700 dark:text-emerald-400">
            <p><strong>Service:</strong> {serviceName}</p>
            <p><strong>Provider:</strong> {providerName}</p>
            <p><strong>Date:</strong> {booking.date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Duration:</strong> {serviceDuration} min</p>
            <p><strong>Location:</strong> {isOnline ? 'Online — Zoom link provided after booking' : 'In-person'}</p>
            <p><strong>Price:</strong> {isFree ? 'FREE' : `R${servicePrice}`}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Your Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bk-name">Full Name *</Label>
          <Input
            id="bk-name"
            value={booking.customerName}
            onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-phone">Phone (optional)</Label>
          <Input
            id="bk-phone"
            value={booking.customerPhone}
            onChange={(e) => setBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
            placeholder="+27..."
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bk-email">Email Address *</Label>
        <Input
          id="bk-email"
          type="email"
          value={booking.customerEmail}
          onChange={(e) => setBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
          placeholder="your@email.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bk-notes">Notes (optional)</Label>
        <Textarea
          id="bk-notes"
          value={booking.notes}
          onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any health conditions, preferences, or questions…"
          rows={3}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('datetime')}>Back</Button>
        <Button onClick={handleDetailsNext} disabled={isProcessing}>
          {isProcessing ? 'Submitting…' : isFree ? 'Confirm Booking' : 'Continue to Payment'}
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Payment</h3>
      <div className="space-y-3">
        {[
          {
            id: 'eft' as const,
            icon: <Banknote className="w-5 h-5" />,
            label: 'EFT / Bank Transfer',
            sub: 'Banking details will be sent by email after booking',
          },
          {
            id: 'wellcoins' as const,
            icon: <Coins className="w-5 h-5 text-omni-orange" />,
            label: 'WellCoins',
            sub: 'Pay with your Omni wellness rewards balance',
          },
          {
            id: 'cash' as const,
            icon: <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs font-bold">R</div>,
            label: 'Pay in Person',
            sub: 'Cash or card at the appointment',
          },
        ].map(opt => (
          <div
            key={opt.id}
            className={`p-4 border rounded-xl cursor-pointer transition-colors ${
              booking.paymentMethod === opt.id
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                : 'border-border hover:border-emerald-300'
            }`}
            onClick={() => setBooking(prev => ({ ...prev, paymentMethod: opt.id }))}
          >
            <div className="flex items-center gap-3">
              {opt.icon}
              <div>
                <p className="font-medium text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-muted/50 rounded-xl p-4 flex justify-between items-center">
        <span className="font-medium text-sm">Total</span>
        <span className="text-xl font-bold text-emerald-600">R{servicePrice}</span>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('details')}>Back</Button>
        <Button onClick={handleBookingSubmit} disabled={isProcessing}>
          {isProcessing ? 'Confirming…' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6 py-4">
      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-emerald-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-emerald-800 mb-2">
          {isFree ? 'Discovery Call Booked!' : 'Booking Received!'}
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          {isFree
            ? "We've received your request and will be in touch to confirm your call time."
            : "We've received your booking request. Sandy's team will confirm within 24 hours."}
        </p>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl text-left border border-emerald-100 dark:border-emerald-900">
        <div className="space-y-1.5 text-sm text-emerald-700 dark:text-emerald-400">
          <p><strong>Service:</strong> {serviceName}</p>
          <p><strong>Provider:</strong> {providerName}</p>
          {booking.date && <p><strong>Requested date:</strong> {booking.date.toLocaleDateString('en-ZA')}</p>}
          {booking.time && <p><strong>Requested time:</strong> {booking.time}</p>}
          <p><strong>Location:</strong> {isOnline ? 'Online' : 'In-person'}</p>
        </div>
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="flex items-center justify-center gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          A confirmation will be sent to {booking.customerEmail}
        </p>
        {isOnline && (
          <p className="flex items-center justify-center gap-1.5">
            <Video className="h-3.5 w-3.5" />
            Zoom link provided before session
          </p>
        )}
      </div>
      <Button onClick={resetBooking} className="w-full">Done</Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`w-full ${buttonClassName}`}>
          <CalendarIcon className="w-4 h-4 mr-2" />
          {buttonLabel ?? (isFree ? 'Book Free Call' : 'Book Session')}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isOnline ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            <span>Book {serviceName}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step === s
                    ? 'bg-emerald-600 text-white'
                    : steps.indexOf(step) > i
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-1 rounded-full transition-colors ${steps.indexOf(step) > i ? 'bg-emerald-500' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {step === 'datetime' && renderDateTimeStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'payment' && renderPaymentStep()}
        {step === 'confirmation' && renderConfirmationStep()}
      </DialogContent>
    </Dialog>
  );
};

export default BookingSystem;
