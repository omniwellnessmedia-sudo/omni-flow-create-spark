import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, User, Calendar as CalendarIcon } from "lucide-react";
import { format, addDays, isSameDay, isAfter, isBefore } from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
}

interface BookingCalendarProps {
  serviceTitle: string;
  duration?: number; // minutes
  price_zar: number;
  price_wellcoins?: number;
  onBookingSelect: (date: Date, time: string) => void;
  availableDays?: number[]; // 0-6, Sunday-Saturday
  timeSlots?: TimeSlot[];
}

export const BookingCalendar = ({
  serviceTitle,
  duration = 60,
  price_zar,
  price_wellcoins,
  onBookingSelect,
  availableDays = [1, 2, 3, 4, 5], // Mon-Fri default
  timeSlots = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: false, booked: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: false, booked: true }
  ]
}: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);

  // Generate next 30 days for booking
  const today = new Date();
  const maxDate = addDays(today, 30);

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availableDays.includes(dayOfWeek) && 
           isAfter(date, today) && 
           isBefore(date, maxDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime) {
      onBookingSelect(selectedDate, selectedTime);
      setIsConfirming(true);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    // If selected date is today, filter out past times
    if (isSameDay(selectedDate, today)) {
      const currentHour = new Date().getHours();
      return timeSlots.filter(slot => {
        const slotHour = parseInt(slot.time.split(':')[0]);
        return slotHour > currentHour && slot.available;
      });
    }
    
    return timeSlots.filter(slot => slot.available);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Book Your Session
          </CardTitle>
          <CardDescription>
            Select your preferred date and time for "{serviceTitle}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <h3 className="font-semibold mb-4">Choose Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => !isDateAvailable(date)}
                className="rounded-md border"
              />
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Unavailable</span>
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <h3 className="font-semibold mb-4">
                Choose Time
                {selectedDate && (
                  <span className="text-sm font-normal text-gray-600 block">
                    for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </span>
                )}
              </h3>
              
              {!selectedDate ? (
                <div className="text-center py-8 text-gray-500">
                  Please select a date first
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableTimeSlots().map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {slot.time}
                    </Button>
                  ))}
                </div>
              )}

              {selectedDate && getAvailableTimeSlots().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No available time slots for this date
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      {selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{serviceTitle}</h4>
                <p className="text-sm text-gray-600">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{duration} minutes</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">R{price_zar}</div>
                {price_wellcoins && (
                  <div className="text-sm text-green-600">
                    or {price_wellcoins} WellCoins
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                onClick={handleConfirmBooking}
                className="w-full bg-rainbow-gradient hover:opacity-90 text-white"
                disabled={isConfirming}
              >
                {isConfirming ? "Processing..." : "Confirm Booking"}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                You'll receive a confirmation email with booking details
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Sessions can be rescheduled up to 24 hours before the appointment</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Cancellations within 24 hours are subject to a 50% cancellation fee</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Please arrive 5-10 minutes early for your appointment</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <span>Virtual sessions require a stable internet connection and quiet environment</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};