import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Copy, 
  RefreshCw,
  Check
} from "lucide-react";

interface TimeSlot {
  id: string;
  service_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  is_available: boolean;
  max_bookings_per_slot: number;
}

interface Service {
  id: string;
  title: string;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday", short: "SUN" },
  { value: 1, label: "Monday", short: "MON" },
  { value: 2, label: "Tuesday", short: "TUE" },
  { value: 3, label: "Wednesday", short: "WED" },
  { value: 4, label: "Thursday", short: "THU" },
  { value: 5, label: "Friday", short: "FRI" },
  { value: 6, label: "Saturday", short: "SAT" },
];

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export const AdminSchedule = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("all");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // New slot form state
  const [newSlot, setNewSlot] = useState({
    day_of_week: 1,
    start_time: "09:00",
    end_time: "10:00",
    slot_duration_minutes: 60,
    max_bookings_per_slot: 1,
  });

  const fetchServices = useCallback(async () => {
    const result = await supabase
      .from("services")
      .select("id, title")
      .eq("is_active", true)
      .order("title");

    if (result.data) {
      setServices(result.data as Service[]);
    }
  }, []);

  const fetchTimeSlots = useCallback(async () => {
    setLoading(true);
    
    const baseQuery = selectedService === "all"
      ? supabase.from("service_time_slots").select("*").order("day_of_week").order("start_time")
      : supabase.from("service_time_slots").select("*").eq("service_id", selectedService).order("day_of_week").order("start_time");

    const { data, error } = await baseQuery;

    if (!error && data) {
      setTimeSlots(data as TimeSlot[]);
    }
    setLoading(false);
  }, [selectedService]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  const handleAddSlot = async () => {
    try {
      const slotData = {
        ...newSlot,
        service_id: selectedService === "all" ? null : selectedService,
        is_available: true,
      };

      const { error } = await supabase
        .from("service_time_slots")
        .insert(slotData);

      if (error) throw error;

      toast({
        title: "Time Slot Added",
        description: "The new time slot has been created.",
      });

      setIsAddDialogOpen(false);
      fetchTimeSlots();
    } catch (error: unknown) {
      console.error("Error adding time slot:", error);
      toast({
        title: "Error",
        description: (error as { message?: string })?.message || "Failed to add time slot",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from("service_time_slots")
        .delete()
        .eq("id", slotId);

      if (error) throw error;

      toast({
        title: "Time Slot Deleted",
        description: "The time slot has been removed.",
      });

      fetchTimeSlots();
    } catch (error) {
      console.error("Error deleting time slot:", error);
      toast({
        title: "Error",
        description: "Failed to delete time slot",
        variant: "destructive",
      });
    }
  };

  const handleToggleSlot = async (slot: TimeSlot) => {
    try {
      const { error } = await supabase
        .from("service_time_slots")
        .update({ is_available: !slot.is_available })
        .eq("id", slot.id);

      if (error) throw error;

      setTimeSlots((prev) =>
        prev.map((s) =>
          s.id === slot.id ? { ...s, is_available: !s.is_available } : s
        )
      );
    } catch (error) {
      console.error("Error toggling time slot:", error);
      toast({
        title: "Error",
        description: "Failed to update time slot",
        variant: "destructive",
      });
    }
  };

  const handleCopyToAllDays = async () => {
    const mondaySlots = timeSlots.filter((slot) => slot.day_of_week === 1);
    if (mondaySlots.length === 0) {
      toast({
        title: "No Monday Slots",
        description: "Please add time slots to Monday first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSlots: Omit<TimeSlot, "id">[] = [];
      
      for (const slot of mondaySlots) {
        for (let day = 2; day <= 5; day++) { // Tuesday to Friday
          newSlots.push({
            service_id: slot.service_id,
            day_of_week: day,
            start_time: slot.start_time,
            end_time: slot.end_time,
            slot_duration_minutes: slot.slot_duration_minutes,
            is_available: true,
            max_bookings_per_slot: slot.max_bookings_per_slot,
          });
        }
      }

      const { error } = await supabase
        .from("service_time_slots")
        .upsert(newSlots, { onConflict: "service_id,day_of_week,start_time" });

      if (error) throw error;

      toast({
        title: "Schedule Copied",
        description: "Monday schedule has been copied to Tuesday-Friday.",
      });

      fetchTimeSlots();
    } catch (error) {
      console.error("Error copying schedule:", error);
      toast({
        title: "Error",
        description: "Failed to copy schedule",
        variant: "destructive",
      });
    }
  };

  // Group slots by day
  const slotsByDay = DAYS_OF_WEEK.map((day) => ({
    ...day,
    slots: timeSlots.filter((slot) => slot.day_of_week === day.value),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Management
              </CardTitle>
              <CardDescription>
                Manage available time slots for bookings
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services (Global)</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={fetchTimeSlots}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="min-h-[44px]">
              <Plus className="w-4 h-4 mr-2" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Time Slot</DialogTitle>
              <DialogDescription>
                Create a new available time slot for bookings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select
                  value={newSlot.day_of_week.toString()}
                  onValueChange={(v) =>
                    setNewSlot({ ...newSlot, day_of_week: parseInt(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select
                    value={newSlot.start_time}
                    onValueChange={(v) =>
                      setNewSlot({ ...newSlot, start_time: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Select
                    value={newSlot.end_time}
                    onValueChange={(v) =>
                      setNewSlot({ ...newSlot, end_time: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newSlot.slot_duration_minutes}
                    onChange={(e) =>
                      setNewSlot({
                        ...newSlot,
                        slot_duration_minutes: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Bookings</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newSlot.max_bookings_per_slot}
                    onChange={(e) =>
                      setNewSlot({
                        ...newSlot,
                        max_bookings_per_slot: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSlot}>Add Slot</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={handleCopyToAllDays} className="min-h-[44px]">
          <Copy className="w-4 h-4 mr-2" />
          Copy Monday to Weekdays
        </Button>
      </div>

      {/* Weekly Schedule Grid */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {slotsByDay.map((day) => (
                <div key={day.value} className="border rounded-lg p-3">
                  <div className="text-center mb-3">
                    <Badge
                      variant={day.value === 0 || day.value === 6 ? "secondary" : "default"}
                      className="font-semibold"
                    >
                      {day.short}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {day.slots.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No slots
                      </p>
                    ) : (
                      day.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-2 rounded border text-xs ${
                            slot.is_available
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-100 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="font-medium">
                                {slot.start_time.slice(0, 5)}
                              </span>
                            </div>
                            <Switch
                              checked={slot.is_available}
                              onCheckedChange={() => handleToggleSlot(slot)}
                              className="scale-75"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {slot.slot_duration_minutes}min
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeleteSlot(slot.id)}
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedule;
