import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  CheckCircle,
  XCircle,
  MapPin,
  Video
} from 'lucide-react';

interface BookingSystemProps {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  providerId: string;
  providerName: string;
  isOnline?: boolean;
}

interface BookingDetails {
  date: Date | undefined;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  paymentMethod: 'card' | 'wellcoins' | 'cash';
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const BookingSystem: React.FC<BookingSystemProps> = ({
  serviceId,
  serviceName,
  servicePrice,
  serviceDuration,
  providerId,
  providerName,
  isOnline = false
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'datetime' | 'details' | 'payment' | 'confirmation'>('datetime');
  const [booking, setBooking] = useState<BookingDetails>({
    date: undefined,
    time: '',
    customerName: user?.user_metadata?.full_name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    notes: '',
    paymentMethod: 'card'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setBooking(prev => ({ ...prev, date }));
  };

  const handleTimeSelect = (time: string) => {
    setBooking(prev => ({ ...prev, time }));
    if (booking.date && time) {
      setStep('details');
    }
  };

  const handleDetailsNext = () => {
    if (!booking.customerName || !booking.customerEmail) {
      toast.error("Please fill in your name and email");
      return;
    }
    setStep('payment');
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to complete booking");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you'd call your booking API here
      const bookingData = {
        serviceId,
        serviceName,
        providerId,
        providerName,
        ...booking,
        totalPrice: servicePrice,
        status: 'confirmed',
        bookingId: `BK${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      console.log('Booking created:', bookingData);
      
      setStep('confirmation');
      toast.success("Booking confirmed! Check your email for details.");
      
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
      console.error('Booking error:', error);
    } finally {
      setIsProcessing(false);
    }
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
      paymentMethod: 'card'
    });
    setIsOpen(false);
  };

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Date & Time</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Choose Date</Label>
            <Calendar
              mode="single"
              selected={booking.date}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
              className="rounded-md border"
            />
          </div>
          
          {/* Time Slots */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Choose Time</Label>
            {booking.date ? (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={booking.time === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className="justify-start"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Please select a date first</p>
            )}
          </div>
        </div>
      </div>
      
      {booking.date && booking.time && (
        <div className="bg-emerald-50 p-4 rounded-lg">
          <h4 className="font-medium text-emerald-800 mb-2">Booking Summary</h4>
          <div className="space-y-1 text-sm text-emerald-700">
            <p><strong>Service:</strong> {serviceName}</p>
            <p><strong>Provider:</strong> {providerName}</p>
            <p><strong>Date:</strong> {booking.date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Duration:</strong> {serviceDuration} minutes</p>
            <p><strong>Location:</strong> {isOnline ? 'Online (Zoom link will be provided)' : 'In-person'}</p>
            <p><strong>Price:</strong> R{servicePrice}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Your Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Full Name *</Label>
          <Input
            id="customerName"
            value={booking.customerName}
            onChange={(e) => setBooking(prev => ({ ...prev, customerName: e.target.value }))}
            placeholder="Your full name"
          />
        </div>
        
        <div>
          <Label htmlFor="customerPhone">Phone Number</Label>
          <Input
            id="customerPhone"
            value={booking.customerPhone}
            onChange={(e) => setBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
            placeholder="Your phone number"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="customerEmail">Email Address *</Label>
        <Input
          id="customerEmail"
          type="email"
          value={booking.customerEmail}
          onChange={(e) => setBooking(prev => ({ ...prev, customerEmail: e.target.value }))}
          placeholder="your.email@example.com"
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Special Requests or Notes</Label>
        <Textarea
          id="notes"
          value={booking.notes}
          onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any special requirements, health conditions, or preferences..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('datetime')}>
          Back
        </Button>
        <Button onClick={handleDetailsNext}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
      
      <div className="space-y-3">
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${booking.paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
          onClick={() => setBooking(prev => ({ ...prev, paymentMethod: 'card' }))}
        >
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5" />
            <div>
              <p className="font-medium">Credit/Debit Card</p>
              <p className="text-sm text-muted-foreground">Secure payment via Stripe</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${booking.paymentMethod === 'wellcoins' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
          onClick={() => setBooking(prev => ({ ...prev, paymentMethod: 'wellcoins' }))}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">W</div>
            <div>
              <p className="font-medium">WellCoins</p>
              <p className="text-sm text-muted-foreground">Pay with your wellness rewards</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${booking.paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
          onClick={() => setBooking(prev => ({ ...prev, paymentMethod: 'cash' }))}
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
            <div>
              <p className="font-medium">Pay in Person</p>
              <p className="text-sm text-muted-foreground">Pay cash or card at appointment</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount:</span>
          <span className="text-xl font-bold text-emerald-600">R{servicePrice}</span>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('details')}>
          Back
        </Button>
        <Button onClick={handleBookingSubmit} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-emerald-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-emerald-800 mb-2">Booking Confirmed!</h3>
        <p className="text-muted-foreground">Your appointment has been successfully booked.</p>
      </div>
      
      <div className="bg-emerald-50 p-4 rounded-lg text-left">
        <h4 className="font-medium text-emerald-800 mb-3">Booking Details</h4>
        <div className="space-y-2 text-sm text-emerald-700">
          <p><strong>Service:</strong> {serviceName}</p>
          <p><strong>Provider:</strong> {providerName}</p>
          <p><strong>Date:</strong> {booking.date?.toLocaleDateString()}</p>
          <p><strong>Time:</strong> {booking.time}</p>
          <p><strong>Location:</strong> {isOnline ? 'Online' : 'In-person'}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>📧 Confirmation email sent to {booking.customerEmail}</p>
        <p>📱 SMS reminder will be sent 24 hours before</p>
        {isOnline && <p>💻 Zoom link will be provided before the session</p>}
      </div>
      
      <Button onClick={resetBooking} className="w-full">
        Close
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Book Now
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {isOnline ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            <span>Book {serviceName}</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            {['datetime', 'details', 'payment', 'confirmation'].map((stepName, index) => (
              <React.Fragment key={stepName}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName ? 'bg-emerald-600 text-white' : 
                  ['datetime', 'details', 'payment', 'confirmation'].indexOf(step) > index ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-8 h-1 rounded-full ${
                    ['datetime', 'details', 'payment', 'confirmation'].indexOf(step) > index ? 'bg-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        {step === 'datetime' && renderDateTimeStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'payment' && renderPaymentStep()}
        {step === 'confirmation' && renderConfirmationStep()}
      </DialogContent>
    </Dialog>
  );
};

export default BookingSystem;