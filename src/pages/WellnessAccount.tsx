import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import {
  User,
  Heart,
  Star,
  Calendar,
  Coins,
  MapPin,
  Settings,
  LogOut,
  Compass,
  BookOpen,
  MessageCircle,
  Edit3,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const quickLinks = [
  { icon: Compass, label: "Browse Services", href: "/services", color: "text-omni-blue" },
  { icon: BookOpen, label: "Read Blog", href: "/blog", color: "text-omni-green" },
  { icon: Calendar, label: "Book a Tour", href: "/tours-retreats", color: "text-omni-orange" },
  { icon: MessageCircle, label: "Contact Us", href: "/contact", color: "text-omni-violet" },
];

const WellnessAccount = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{
    id: string;
    full_name: string;
    email: string;
    user_type: string;
    bio?: string;
    location?: string;
    avatar_url?: string;
  } | null>(null);
  const [wellCoinBalance, setWellCoinBalance] = useState(0);
  const [toursBooked, setToursBooked] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", bio: "", location: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setUserProfile(profile);

      const table = profile?.user_type === "provider" ? "provider_profiles" : "consumer_profiles";
      const { data: walletData } = await supabase
        .from(table)
        .select("wellcoin_balance")
        .eq("id", user.id)
        .maybeSingle();

      setWellCoinBalance(walletData?.wellcoin_balance || 0);

      // Real "Tours Booked" count for the stats strip (was hardcoded 0)
      const { count: tourCount } = await supabase
        .from("tour_bookings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setToursBooked(tourCount || 0);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const openEdit = () => {
    setEditForm({
      full_name: userProfile?.full_name || "",
      bio: userProfile?.bio || "",
      location: userProfile?.location || "",
    });
    setEditOpen(true);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name.trim() || null,
          bio: editForm.bio.trim() || null,
          location: editForm.location.trim() || null,
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated");
      setEditOpen(false);
      // Refetch authoritative server state instead of trusting optimistic merge — a DB trigger may have normalised values
      await fetchUserData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const displayName = userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Wellness Member";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-ZA", { month: "long", year: "numeric" })
    : "Recently";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedNavigation />

      <main id="main-content" className="flex-1">
        {/* ── PROFILE HERO ── */}
        <div className="relative">
          {/* Cover strip */}
          <div className="h-40 sm:h-48 bg-gradient-to-r from-primary/30 via-omni-violet/20 to-omni-orange/20 overflow-hidden">
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(circle at 30% 50%, hsl(var(--primary)/0.4) 0%, transparent 60%), radial-gradient(circle at 80% 30%, hsl(var(--omni-violet)/0.3) 0%, transparent 50%)"
              }}
            />
          </div>

          {/* Avatar + identity */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end gap-5 -mt-14 mb-4 relative z-10">
              <div className="relative shrink-0">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-xl">
                  <AvatarImage src={userProfile?.avatar_url || user?.user_metadata?.avatar_url} alt={displayName} />
                  <AvatarFallback className="text-2xl font-heading bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {wellCoinBalance > 0 && (
                  <span className="absolute -bottom-1 -right-1 bg-omni-orange rounded-full p-1 border-2 border-background">
                    <Coins className="h-3.5 w-3.5 text-white" />
                  </span>
                )}
              </div>

              <div className="pb-1 flex-1 min-w-0">
                <h1 className="font-heading text-2xl sm:text-3xl leading-tight">{displayName}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                  {userProfile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {userProfile.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Member since {memberSince}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex gap-2 pb-1">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={openEdit}>
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Bio */}
            {userProfile?.bio ? (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mb-4">
                {userProfile.bio}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic mb-4">
                Add a bio to let the community know a little about you.
              </p>
            )}

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="gap-1 bg-green-100 text-green-800 border-green-200">
                <ShieldCheck className="h-3 w-3" />
                Verified Member
              </Badge>
              {wellCoinBalance >= 100 && (
                <Badge className="gap-1 bg-amber-100 text-amber-800 border-amber-200">
                  <Sparkles className="h-3 w-3" />
                  WellCoin Holder
                </Badge>
              )}
              {userProfile?.user_type === "provider" && (
                <Badge className="gap-1 bg-primary/10 text-primary border-primary/20">
                  <Star className="h-3 w-3" />
                  Service Provider
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <Separator className="mb-8" />

          {/* ── STATS STRIP ── */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "WellCoins", value: wellCoinBalance, icon: Coins, color: "text-omni-orange" },
              { label: "Tours Booked", value: toursBooked, icon: Compass, color: "text-primary" },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl border border-border/50 bg-card p-4 sm:p-5 text-center">
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <div className="font-heading text-2xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

            {/* WellCoin wallet */}
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="h-5 w-5 text-omni-orange" />
                <h2 className="font-heading text-lg">WellCoin Wallet</h2>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-heading text-4xl text-primary">{wellCoinBalance}</span>
                <span className="text-sm text-muted-foreground">WC</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {wellCoinBalance === 50
                  ? "Welcome bonus applied! Use WellCoins to pay for services."
                  : "Earn WellCoins by booking services and leaving reviews."}
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/services")}>
                Spend WellCoins
              </Button>
            </div>

            {/* Profile completeness */}
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg">Your Profile</h2>
              </div>
              <div className="space-y-3 text-sm">
                <ProfileRow icon={ShieldCheck} label="Email verified" done={!!user?.email_confirmed_at} />
                <ProfileRow icon={User} label="Display name" done={!!userProfile?.full_name} />
                <ProfileRow icon={MapPin} label="Location" done={!!userProfile?.location} />
                <ProfileRow icon={BookOpen} label="Bio added" done={!!userProfile?.bio} />
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 gap-1.5" onClick={openEdit}>
                <Edit3 className="h-3.5 w-3.5" />
                Complete Profile
              </Button>
            </div>
          </div>

          {/* ── QUICK LINKS ── */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 mb-6">
            <h2 className="font-heading text-lg mb-4">Explore Omni</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border/40 hover:border-border transition-all group"
                >
                  <link.icon className={`h-6 w-6 ${link.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-medium text-center leading-snug">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── ACCOUNT SETTINGS ── */}
          <div className="rounded-2xl border border-border/50 bg-card">
            <div className="px-6 py-4 border-b border-border/50">
              <h2 className="font-heading text-lg flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account
              </h2>
            </div>
            <div className="divide-y divide-border/40">
              <SettingsRow icon={User} label="Account details" sub={user?.email || ""} />
              <SettingsRow icon={ShieldCheck} label="Privacy & Security" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-red-50 transition-colors group"
              >
                <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-red-600">Sign out</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Display Name</Label>
              <Input
                value={editForm.full_name}
                onChange={(e) => setEditForm((p) => ({ ...p, full_name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Location</Label>
              <Input
                value={editForm.location}
                onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Cape Town, South Africa"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Bio</Label>
              <Textarea
                value={editForm.bio}
                onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell the community a little about yourself…"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveProfile} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProfileRow = ({ icon: Icon, label, done }: { icon: React.ElementType; label: string; done: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-green-100' : 'bg-muted'}`}>
      <Icon className={`h-3.5 w-3.5 ${done ? 'text-green-600' : 'text-muted-foreground'}`} />
    </div>
    <span className={done ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    {done && <ShieldCheck className="h-3.5 w-3.5 text-green-500 ml-auto" />}
  </div>
);

const SettingsRow = ({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub?: string }) => (
  <div className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer">
    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium">{label}</div>
      {sub && <div className="text-xs text-muted-foreground truncate">{sub}</div>}
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </div>
);

export default WellnessAccount;
