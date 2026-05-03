import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ProUpgradeCard from "./ProUpgradeCard";

interface CRMDashboardProps {
  bookings: any[];
  isPro: boolean;
}

interface ClientSummary {
  consumerId: string;
  name: string;
  totalBookings: number;
  totalSpend: number;
  lastBookingDate: string;
  daysSinceLast: number;
}

const CRMDashboard = ({ bookings, isPro }: CRMDashboardProps) => {
  const [clientProfiles, setClientProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!isPro || bookings.length === 0) return;
    const consumerIds = [...new Set(bookings.map((b) => b.consumer_id))];
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", consumerIds)
      .then(({ data }) => {
        const map: Record<string, any> = {};
        (data || []).forEach((p) => {
          map[p.id] = p;
        });
        setClientProfiles(map);
      });
  }, [bookings, isPro]);

  const clients: ClientSummary[] = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    bookings.forEach((b) => {
      if (!grouped[b.consumer_id]) grouped[b.consumer_id] = [];
      grouped[b.consumer_id].push(b);
    });

    return Object.entries(grouped)
      .map(([id, bks]) => {
        const sorted = [...bks].sort(
          (a, b) =>
            new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
        );
        const latest = sorted[0];
        const profile = clientProfiles[id] || {};
        const daysSince = Math.floor(
          (Date.now() - new Date(latest.booking_date).getTime()) / 86400000
        );
        return {
          consumerId: id,
          name: profile.full_name || "Anonymous Client",
          totalBookings: bks.length,
          totalSpend: bks.reduce((s: number, b: any) => s + (b.amount_zar || 0), 0),
          lastBookingDate: latest.booking_date,
          daysSinceLast: daysSince,
        };
      })
      .sort((a, b) => b.totalBookings - a.totalBookings);
  }, [bookings, clientProfiles]);

  const repeatClients = clients.filter((c) => c.totalBookings > 1).length;
  const needsFollowUpCount = clients.filter((c) => c.daysSinceLast > 30).length;

  if (!isPro) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="blur-sm pointer-events-none select-none opacity-60 space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-36" />
                  <div className="h-2 bg-muted rounded w-24" />
                </div>
                <div className="h-6 w-16 bg-muted rounded shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-sm">
            <ProUpgradeCard featureName="Client CRM" />
          </div>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="font-heading text-lg mb-2">No clients yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Client data will appear here as bookings come in. Share your profile
            to attract your first booking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Clients", value: clients.length, icon: Users, cls: "text-primary" },
          { label: "Repeat Clients", value: repeatClients, icon: TrendingUp, cls: "text-green-600" },
          { label: "Need Follow-up", value: needsFollowUpCount, icon: AlertCircle, cls: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <s.icon className={`h-4 w-4 mx-auto mb-1.5 ${s.cls}`} />
              <p className="font-heading text-2xl">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client list */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Client Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {clients.map((client) => {
            const initials = client.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const needsFollowUp = client.daysSinceLast > 30;
            const isVip = client.totalBookings >= 3;

            return (
              <div
                key={client.consumerId}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <p className="text-sm font-medium truncate">{client.name}</p>
                    {isVip && (
                      <Badge className="text-[9px] px-1.5 bg-amber-100 text-amber-800 border-amber-200">
                        VIP
                      </Badge>
                    )}
                    {needsFollowUp && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 border-amber-200 text-amber-700 bg-amber-50"
                      >
                        <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                        Follow up
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>
                      {client.totalBookings} session
                      {client.totalBookings !== 1 ? "s" : ""}
                    </span>
                    {client.totalSpend > 0 && (
                      <span>R{client.totalSpend.toLocaleString()} total</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(client.lastBookingDate), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-heading text-lg leading-none">{client.totalBookings}</p>
                  <p className="text-[10px] text-muted-foreground">sessions</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMDashboard;
