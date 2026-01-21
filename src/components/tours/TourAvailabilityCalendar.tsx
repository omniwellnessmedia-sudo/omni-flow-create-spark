import React, { useState, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Users, Clock, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AvailabilityData {
  date: Date;
  status: 'available' | 'limited' | 'fully_booked' | 'blocked' | 'tentative' | 'past';
  availableCapacity: number;
  totalCapacity: number;
  startTime?: string;
  endTime?: string;
}

interface TourAvailabilityCalendarProps {
  tourId: string;
  minNoticeHours?: number;
  onDateSelect: (date: Date, availability: AvailabilityData) => void;
  selectedDate?: Date | null;
  participants?: number;
  className?: string;
}

const TourAvailabilityCalendar: React.FC<TourAvailabilityCalendarProps> = ({
  tourId,
  minNoticeHours = 48,
  onDateSelect,
  selectedDate,
  participants = 1,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Map<string, AvailabilityData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate minimum booking date based on notice hours
  const minBookingDate = addDays(new Date(), Math.ceil(minNoticeHours / 24));

  useEffect(() => {
    fetchAvailability();
  }, [tourId, currentMonth]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);

    try {
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(addMonths(currentMonth, 2)); // Fetch 3 months ahead

      const { data, error: fetchError } = await supabase
        .from('tour_operator_availability')
        .select('*')
        .eq('tour_id', tourId)
        .gte('available_date', format(startDate, 'yyyy-MM-dd'))
        .lte('available_date', format(endDate, 'yyyy-MM-dd'));

      if (fetchError) throw fetchError;

      const availabilityMap = new Map<string, AvailabilityData>();
      
      // Process fetched availability data
      data?.forEach((item) => {
        const date = new Date(item.available_date);
        const dateKey = format(date, 'yyyy-MM-dd');
        const availableCapacity = Math.max(0, (item.max_capacity || 10) - (item.booked_capacity || 0));
        
        let status: AvailabilityData['status'] = 'available';
        if (item.status === 'blocked') {
          status = 'blocked';
        } else if (item.status === 'tentative') {
          status = 'tentative';
        } else if (availableCapacity === 0) {
          status = 'fully_booked';
        } else if (availableCapacity <= 3) {
          status = 'limited';
        }

        availabilityMap.set(dateKey, {
          date,
          status,
          availableCapacity,
          totalCapacity: item.max_capacity || 10,
          startTime: item.start_time,
          endTime: item.end_time
        });
      });

      setAvailability(availabilityMap);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const getDayStatus = (date: Date): AvailabilityData => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is in the past
    if (isBefore(date, today)) {
      return {
        date,
        status: 'past',
        availableCapacity: 0,
        totalCapacity: 0
      };
    }

    // Check if date is before minimum notice period
    if (isBefore(date, minBookingDate)) {
      return {
        date,
        status: 'blocked',
        availableCapacity: 0,
        totalCapacity: 0
      };
    }

    // Return stored availability or default to available
    return availability.get(dateKey) || {
      date,
      status: 'available',
      availableCapacity: 10, // Default capacity
      totalCapacity: 10
    };
  };

  const getStatusColor = (status: AvailabilityData['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30 border-green-500/30';
      case 'limited':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/30';
      case 'tentative':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/30 border-blue-500/30';
      case 'fully_booked':
        return 'bg-red-500/10 text-red-400 cursor-not-allowed border-red-500/20';
      case 'blocked':
      case 'past':
        return 'bg-muted/50 text-muted-foreground cursor-not-allowed';
      default:
        return 'bg-muted';
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get the day of week the month starts on (0 = Sunday)
    const startDay = monthStart.getDay();
    
    // Create empty cells for days before month starts
    const emptyCells = Array(startDay).fill(null);

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-10" />
        ))}
        
        {/* Day cells */}
        {days.map((day) => {
          const dayStatus = getDayStatus(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isSelectable = dayStatus.status !== 'past' && 
                              dayStatus.status !== 'blocked' && 
                              dayStatus.status !== 'fully_booked' &&
                              dayStatus.availableCapacity >= participants;

          return (
            <TooltipProvider key={day.toISOString()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => isSelectable && onDateSelect(day, dayStatus)}
                    disabled={!isSelectable}
                    className={cn(
                      'h-10 w-full rounded-md border text-sm font-medium transition-all',
                      getStatusColor(dayStatus.status),
                      isSelected && 'ring-2 ring-primary ring-offset-2',
                      isSelectable && 'cursor-pointer',
                      !isSameMonth(day, currentMonth) && 'opacity-50'
                    )}
                  >
                    <span className="flex flex-col items-center">
                      <span>{format(day, 'd')}</span>
                      {dayStatus.status === 'limited' && (
                        <span className="text-[10px] leading-none">{dayStatus.availableCapacity} left</span>
                      )}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {dayStatus.status === 'available' && (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-green-500" />
                      {dayStatus.availableCapacity} spots available
                    </span>
                  )}
                  {dayStatus.status === 'limited' && (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-yellow-500" />
                      Only {dayStatus.availableCapacity} spots left!
                    </span>
                  )}
                  {dayStatus.status === 'tentative' && (
                    <span>Subject to operator confirmation</span>
                  )}
                  {dayStatus.status === 'fully_booked' && (
                    <span className="text-red-500">Fully booked</span>
                  )}
                  {dayStatus.status === 'blocked' && (
                    <span>Requires {minNoticeHours}h advance notice</span>
                  )}
                  {dayStatus.status === 'past' && (
                    <span>Date has passed</span>
                  )}
                  {dayStatus.startTime && dayStatus.endTime && (
                    <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {dayStatus.startTime} - {dayStatus.endTime}
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          disabled={isBefore(startOfMonth(currentMonth), startOfMonth(new Date()))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-4 text-destructive">
          <AlertCircle className="h-5 w-5 mx-auto mb-2" />
          {error}
        </div>
      )}

      {/* Calendar */}
      {!loading && !error && renderCalendar()}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs pt-2 border-t">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" />
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30" />
          <span>Request Only</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-muted/50" />
          <span>Unavailable</span>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              {getDayStatus(selectedDate).startTime && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {getDayStatus(selectedDate).startTime} - {getDayStatus(selectedDate).endTime}
                </p>
              )}
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {getDayStatus(selectedDate).availableCapacity} spots
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourAvailabilityCalendar;
