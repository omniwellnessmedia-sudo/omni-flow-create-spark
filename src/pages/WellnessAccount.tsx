import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNavigation from "@/components/MobileNavigation";
import { User, Settings, Heart, Star, Calendar, Coins, Gift } from "lucide-react";
import { toast } from "sonner";

const WellnessAccount = () => {
  const { user, signOut } = useAuth();

  const handleStartTrial = () => {
    toast.success("7-day free trial activated! Welcome to Omni Wellness!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation />
      
      <main className="pt-20 pb-20 lg:pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl">
              My <span className="bg-rainbow-gradient bg-clip-text text-transparent">Account</span>
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
                  className="bg-rainbow-gradient hover:opacity-90 text-white"
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
                    <Badge variant="secondary">Consumer</Badge>
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
                  <div className="text-3xl font-bold text-omni-orange mb-2">10 WC</div>
                  <p className="text-sm text-gray-600">Welcome bonus included</p>
                  <Button variant="outline" className="mt-4 w-full">
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
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    My Wants
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Bookings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
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
    </div>
  );
};

export default WellnessAccount;