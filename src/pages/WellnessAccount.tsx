import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import Footer from "@/components/Footer";
import { User, Settings, Heart, Star, Calendar, Coins, Gift } from "lucide-react";
import { toast } from "sonner";

const WellnessAccount = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{
    id: string;
    full_name: string;
    email: string;
    user_type: string;
    specialties?: string[];
    bio?: string;
    location?: string;
  } | null>(null);
  const [wellCoinBalance, setWellCoinBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);

      // Fetch WellCoin balance based on user type
      if (profile?.user_type === 'provider') {
        const { data: providerProfile } = await supabase
          .from('provider_profiles')
          .select('wellcoin_balance')
          .eq('id', user.id)
          .single();
        
        setWellCoinBalance(providerProfile?.wellcoin_balance || 0);
      } else {
        const { data: consumerProfile } = await supabase
          .from('consumer_profiles')
          .select('wellcoin_balance')
          .eq('id', user.id)
          .single();
        
        setWellCoinBalance(consumerProfile?.wellcoin_balance || 0);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = () => {
    toast.success("7-day free trial activated! Welcome to Omni Wellness!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-omni-blue mx-auto mb-4"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation />
      
      <main className="pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl">
              My <span className="text-gradient-rainbow">Account</span>
            </h1>
            <p className="text-gray-600 mt-1">Manage your wellness journey</p>
          </div>

          {/* 7-Day Trial Promotion */}
          <Card className="mb-6 bg-gradient-to-r from-omni-orange/10 to-omni-yellow/10 border-omni-orange/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Gift className="h-8 w-8 text-omni-orange mr-4" />
                  <div>
                    <h3 className="font-bold text-lg">🎯 Exclusive: 7-Day Free Trial</h3>
                    <p className="text-gray-600">Access all Omni Wellness premium services</p>
                  </div>
                </div>
                <Button 
                  onClick={handleStartTrial}
                  className="bg-gradient-rainbow hover:opacity-90 text-white"
                >
                  Activate Trial
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Member Since</label>
                    <p className="text-lg">Welcome to the community!</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {userProfile?.user_type === 'provider' ? 'Provider' : 'Consumer'}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WellCoin Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="h-5 w-5 mr-2 text-omni-orange" />
                  WellCoin Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-omni-orange mb-2">{wellCoinBalance} WC</div>
                  <p className="text-sm text-gray-600">
                    {wellCoinBalance === 50 ? "Welcome bonus included!" : "Your current balance"}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full"
                    onClick={() => toast.info("Coming soon! WellCoin top-up feature.")}
                  >
                    Add WellCoins
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/wellness-exchange/wants')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    My Wants
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/wellness-exchange/transactions')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Transactions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => toast.info("Reviews feature coming soon!")}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Journey */}
            <Card>
              <CardHeader>
                <CardTitle>Wellness Journey</CardTitle>
                <CardDescription>Your progress and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">🌱</div>
                  <p className="text-sm text-gray-600 mb-4">Just getting started!</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Services Booked</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Community Posts</span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WellnessAccount;