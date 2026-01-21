import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar, Users, Mail, Phone, User, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TourAvailabilityCalendar from './TourAvailabilityCalendar';

interface RequestToBookFormProps {
  tourId: string;
  tourTitle: string;
  pricePerPerson: number;
  maxParticipants?: number;
  minNoticeHours?: number;
  operatorId?: string;
  onSuccess?: (requestId: string) => void;
  onCancel?: () => void;
}

type FlexibilityType = 'specific' | 'flexible_week' | 'any_weekend' | 'any_weekday' | 'fully_flexible';

const flexibilityOptions: { value: FlexibilityType; label: string; description: string }[] = [
  { value: 'specific', label: 'Specific Date', description: 'I need this exact date' },
  { value: 'flexible_week', label: 'Flexible (Same Week)', description: 'Any day within the same week works' },
  { value: 'any_weekend', label: 'Any Weekend', description: 'Any Saturday or Sunday' },
  { value: 'any_weekday', label: 'Any Weekday', description: 'Monday to Friday' },
  { value: 'fully_flexible', label: 'Fully Flexible', description: 'I\'m open to any available date' }
];

const RequestToBookForm: React.FC<RequestToBookFormProps> = ({
  tourId,
  tourTitle,
  pricePerPerson,
  maxParticipants = 20,
  minNoticeHours = 48,
  operatorId,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'dates' | 'details' | 'confirm'>('dates');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Form state
  const [preferredDates, setPreferredDates] = useState<Date[]>([]);
  const [flexibility, setFlexibility] = useState<FlexibilityType>('specific');
  const [participants, setParticipants] = useState(2);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  const handleDateSelect = (date: Date) => {
    if (flexibility === 'specific') {
      setPreferredDates([date]);
    } else {
      // Allow up to 3 preferred dates for flexible bookings
      if (preferredDates.some(d => d.getTime() === date.getTime())) {
        setPreferredDates(preferredDates.filter(d => d.getTime() !== date.getTime()));
      } else if (preferredDates.length < 3) {
        setPreferredDates([...preferredDates, date].sort((a, b) => a.getTime() - b.getTime()));
      } else {
        toast({
          title: 'Maximum 3 dates',
          description: 'You can select up to 3 preferred dates',
          variant: 'destructive'
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!contactName || !contactEmail || preferredDates.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // Calculate operator response deadline (48 hours from now)
      const responseDeadline = addDays(new Date(), 2);

      const { data, error } = await supabase
        .from('booking_requests')
        .insert({
          tour_id: tourId,
          consumer_id: user?.id || null,
          preferred_dates: preferredDates.map(d => format(d, 'yyyy-MM-dd')),
          flexibility,
          participants,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone || null,
          special_requirements: specialRequirements || null,
          operator_id: operatorId || null,
          operator_response_deadline: responseDeadline.toISOString(),
          status: 'pending'
        })
        .select('id')
        .single();

      if (error) throw error;

      setRequestId(data.id);
      setSubmitted(true);
      
      toast({
        title: 'Booking Request Submitted! 🎉',
        description: 'The operator will review and respond within 48 hours.',
      });

      onSuccess?.(data.id);

    } catch (err) {
      console.error('Error submitting booking request:', err);
      toast({
        title: 'Submission failed',
        description: 'Please try again or contact us directly',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const estimatedTotal = pricePerPerson * participants;

  if (submitted) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
          <p className="text-muted-foreground mb-4">
            Your booking request for <strong>{tourTitle}</strong> has been sent to the operator.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mb-4 text-left">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-primary" />
                <span>The operator will review your request within 48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>You'll receive an email at <strong>{contactEmail}</strong> with their response</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-primary" />
                <span>Once confirmed, you'll be asked to pay a deposit to secure your spot</span>
              </li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            Reference ID: {requestId}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {(['dates', 'details', 'confirm'] as const).map((s, i) => (
          <React.Fragment key={s}>
            <button
              onClick={() => {
                if (s === 'dates' || (s === 'details' && preferredDates.length > 0) || (s === 'confirm' && contactName && contactEmail)) {
                  setStep(s);
                }
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === s 
                  ? 'bg-primary text-primary-foreground' 
                  : (s === 'dates' || (s === 'details' && preferredDates.length > 0) || (s === 'confirm' && contactName && contactEmail))
                    ? 'bg-primary/20 text-primary hover:bg-primary/30'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {i + 1}
            </button>
            {i < 2 && <div className="w-8 h-0.5 bg-muted" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Date Selection */}
      {step === 'dates' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Your Preferred Date(s)
            </CardTitle>
            <CardDescription>
              Choose when you'd like to take this tour. The operator will confirm availability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Flexibility Selection */}
            <div>
              <Label>How flexible are you?</Label>
              <Select value={flexibility} onValueChange={(v) => {
                setFlexibility(v as FlexibilityType);
                if (v === 'specific' && preferredDates.length > 1) {
                  setPreferredDates([preferredDates[0]]);
                }
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {flexibilityOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Participants */}
            <div>
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Participants
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setParticipants(Math.max(1, participants - 1))}
                >
                  -
                </Button>
                <span className="text-lg font-semibold w-8 text-center">{participants}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setParticipants(Math.min(maxParticipants, participants + 1))}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground">
                  (max {maxParticipants})
                </span>
              </div>
            </div>

            {/* Calendar */}
            <div className="pt-2">
              <Label className="mb-2 block">
                {flexibility === 'specific' ? 'Select your date' : 'Select up to 3 preferred dates'}
              </Label>
              <TourAvailabilityCalendar
                tourId={tourId}
                minNoticeHours={minNoticeHours}
                selectedDate={preferredDates[0] || null}
                participants={participants}
                onDateSelect={(date) => handleDateSelect(date)}
              />
            </div>

            {/* Selected Dates */}
            {preferredDates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {preferredDates.map((date, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {format(date, 'EEE, MMM d')}
                    <button 
                      onClick={() => setPreferredDates(preferredDates.filter((_, j) => j !== i))}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={preferredDates.length === 0}
              onClick={() => setStep('details')}
            >
              Continue to Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Contact Details */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Contact Details
            </CardTitle>
            <CardDescription>
              We'll use this to confirm your booking and send updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+27 XX XXX XXXX"
              />
            </div>

            <div>
              <Label htmlFor="requirements" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Special Requirements or Questions
              </Label>
              <Textarea
                id="requirements"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Dietary requirements, mobility needs, questions for the guide..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('dates')}>
                Back
              </Button>
              <Button 
                className="flex-1" 
                disabled={!contactName || !contactEmail}
                onClick={() => setStep('confirm')}
              >
                Review & Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Review Your Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">{tourTitle}</h4>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Preferred Date(s):</div>
                <div className="font-medium">
                  {preferredDates.map(d => format(d, 'MMM d, yyyy')).join(', ')}
                </div>
                
                <div className="text-muted-foreground">Flexibility:</div>
                <div className="font-medium">
                  {flexibilityOptions.find(o => o.value === flexibility)?.label}
                </div>
                
                <div className="text-muted-foreground">Participants:</div>
                <div className="font-medium">{participants} {participants === 1 ? 'person' : 'people'}</div>
                
                <div className="text-muted-foreground">Contact:</div>
                <div className="font-medium">{contactName}</div>
                
                <div className="text-muted-foreground">Email:</div>
                <div className="font-medium">{contactEmail}</div>
              </div>

              {specialRequirements && (
                <div>
                  <div className="text-muted-foreground text-sm">Notes:</div>
                  <div className="text-sm">{specialRequirements}</div>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Estimated Total:</span>
                <span>R{estimatedTotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Final price will be confirmed by the operator. A deposit may be required.
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <strong className="text-yellow-700 dark:text-yellow-400">Request-to-Book</strong>
                  <p className="text-muted-foreground">
                    This is a booking request. The operator will confirm availability within 48 hours. 
                    No payment is required until your booking is confirmed.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Booking Request'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Button */}
      {onCancel && (
        <Button variant="ghost" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
};

export default RequestToBookForm;
