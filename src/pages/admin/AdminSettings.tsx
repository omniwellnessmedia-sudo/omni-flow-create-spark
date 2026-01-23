import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFeatureFlags, FeatureFlag } from "@/hooks/useFeatureFlags";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Calendar, 
  CreditCard, 
  Users, 
  ShoppingBag, 
  Mail,
  ToggleLeft,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle
} from "lucide-react";

interface CalComGlobalSetting {
  setting_key: string;
  setting_value: string;
  description: string | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  booking: <Calendar className="w-4 h-4" />,
  payments: <CreditCard className="w-4 h-4" />,
  access: <Users className="w-4 h-4" />,
  marketplace: <ShoppingBag className="w-4 h-4" />,
  marketing: <Mail className="w-4 h-4" />,
  general: <Settings className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  booking: "bg-blue-100 text-blue-800",
  payments: "bg-green-100 text-green-800",
  access: "bg-purple-100 text-purple-800",
  marketplace: "bg-orange-100 text-orange-800",
  marketing: "bg-pink-100 text-pink-800",
  general: "bg-gray-100 text-gray-800",
};

export const AdminSettings = () => {
  const { flags, loading, toggleFlag, refetch } = useFeatureFlags();
  const { toast } = useToast();
  
  // Cal.com settings state
  const [calComSettings, setCalComSettings] = useState<CalComGlobalSetting[]>([]);
  const [calComUsername, setCalComUsername] = useState("");
  const [calComDefaultEvent, setCalComDefaultEvent] = useState("");
  const [calComEmbedMode, setCalComEmbedMode] = useState("popup");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Cal.com global settings
  useEffect(() => {
    const fetchCalComSettings = async () => {
      const { data, error } = await supabase
        .from("calcom_global_settings")
        .select("*");

      if (!error && data) {
        setCalComSettings(data);
        data.forEach((setting) => {
          if (setting.setting_key === "calcom_username") {
            setCalComUsername(setting.setting_value);
          } else if (setting.setting_key === "default_event_slug") {
            setCalComDefaultEvent(setting.setting_value);
          } else if (setting.setting_key === "embed_mode") {
            setCalComEmbedMode(setting.setting_value);
          }
        });
      }
    };

    fetchCalComSettings();
  }, []);

  const handleSaveCalComSettings = async () => {
    setIsSaving(true);
    try {
      const updates = [
        { setting_key: "calcom_username", setting_value: calComUsername },
        { setting_key: "default_event_slug", setting_value: calComDefaultEvent },
        { setting_key: "embed_mode", setting_value: calComEmbedMode },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("calcom_global_settings")
          .update({ 
            setting_value: update.setting_value,
            updated_by: (await supabase.auth.getUser()).data.user?.id,
            updated_at: new Date().toISOString()
          })
          .eq("setting_key", update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Settings Saved",
        description: "Cal.com settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving Cal.com settings:", error);
      toast({
        title: "Error",
        description: "Failed to save Cal.com settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Group flags by category
  const flagsByCategory = flags.reduce((acc, flag) => {
    const category = flag.category || "general";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(flag);
    return acc;
  }, {} as Record<string, FeatureFlag[]>);

  const categoryOrder = ["booking", "payments", "access", "marketplace", "marketing", "general"];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Feature Flags Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ToggleLeft className="w-5 h-5" />
                Feature Management
              </CardTitle>
              <CardDescription>
                Enable or disable platform features. Changes take effect immediately.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categoryOrder.map((category) => {
              const categoryFlags = flagsByCategory[category];
              if (!categoryFlags?.length) return null;

              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={categoryColors[category]}>
                      {categoryIcons[category]}
                      <span className="ml-1 capitalize">{category}</span>
                    </Badge>
                  </div>
                  <div className="grid gap-3">
                    {categoryFlags.map((flag) => (
                      <div
                        key={flag.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{flag.display_name}</span>
                            {flag.is_enabled ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {flag.description}
                          </p>
                        </div>
                        <Switch
                          checked={flag.is_enabled}
                          onCheckedChange={() => toggleFlag(flag.feature_key)}
                          className="min-w-[44px] min-h-[24px]"
                        />
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cal.com Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Cal.com Configuration
          </CardTitle>
          <CardDescription>
            Configure your Cal.com integration for booking sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="calcom-username">Cal.com Username</Label>
              <Input
                id="calcom-username"
                placeholder="omniwellnessmedia"
                value={calComUsername}
                onChange={(e) => setCalComUsername(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your Cal.com username or organization name
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-event">Default Event Type</Label>
              <Input
                id="default-event"
                placeholder="discovery-call"
                value={calComDefaultEvent}
                onChange={(e) => setCalComDefaultEvent(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The default event type slug for general bookings
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="embed-mode">Default Embed Mode</Label>
            <Select value={calComEmbedMode} onValueChange={setCalComEmbedMode}>
              <SelectTrigger id="embed-mode" className="w-full md:w-[300px]">
                <SelectValue placeholder="Select embed mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popup">Popup (Recommended)</SelectItem>
                <SelectItem value="modal">Modal</SelectItem>
                <SelectItem value="inline">Inline Embed</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How the Cal.com booking widget appears on service pages
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Tip:</strong> Create these event types in your{" "}
                <a
                  href="https://app.cal.com/event-types"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Cal.com dashboard
                </a>
                :
              </p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>discovery-call (30 min)</li>
                <li>social-media-strategy (60 min)</li>
                <li>web-consultation (45 min)</li>
                <li>media-production (60 min)</li>
                <li>business-strategy (60 min)</li>
              </ul>
            </div>
            <Button onClick={handleSaveCalComSettings} disabled={isSaving}>
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Features</span>
              <span className="font-medium">{flags.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Enabled Features</span>
              <span className="font-medium text-green-600">
                {flags.filter((f) => f.is_enabled).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Disabled Features</span>
              <span className="font-medium text-gray-500">
                {flags.filter((f) => !f.is_enabled).length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
