
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { User, Heart, ArrowRight } from "lucide-react";

const WellnessExchangeSignup = () => {
  const [userType, setUserType] = useState<'provider' | 'consumer'>('consumer');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Provider form data
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  // Consumer form data
  const [wellnessGoals, setWellnessGoals] = useState<string[]>([]);
  const [preferredServices, setPreferredServices] = useState<string[]>([]);

  const availableSpecialties = [
    "Yoga", "Meditation", "Nutrition", "Massage Therapy", "Acupuncture",
    "Life Coaching", "Personal Training", "Reiki", "Aromatherapy", "Herbalism"
  ];

  const availableGoals = [
    "Stress Relief", "Weight Management", "Mental Health", "Physical Fitness",
    "Spiritual Growth", "Better Sleep", "Pain Management", "Energy Boost"
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Update the user's profile with user_type
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', user.id);

      if (profileError) throw profileError;

      if (userType === 'provider') {
        // Create provider profile
        const { error: providerError } = await supabase
          .from('provider_profiles')
          .insert({
            id: user.id,
            business_name: businessName,
            description,
            specialties,
            location,
            phone,
            website: website || null,
            experience_years: experienceYears ? parseInt(experienceYears) : null,
          });

        if (providerError) throw providerError;
      } else {
      // Create consumer profile with default 50 WellCoins
        const { error: consumerError } = await supabase
          .from('consumer_profiles')
          .insert({
            id: user.id,
            wellness_goals: wellnessGoals,
            preferred_services: preferredServices,
            location,
            wellcoin_balance: 50,
          });

        if (consumerError) throw consumerError;
      }

      toast.success("Profile created successfully! Welcome to the Wellness Exchange!");
      navigate("/wellness-exchange/marketplace");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-br from-background via-accent to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="font-heading font-semibold text-4xl sm:text-5xl mb-6 text-foreground tracking-tight">
                Join the Wellness Exchange
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Complete your profile to start connecting with our conscious wellness community
              </p>
            </div>

            <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-medium text-foreground tracking-tight">Choose Your Path</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-3">
                  Select how you'd like to participate in the wellness exchange
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <Card 
                    className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                      userType === 'provider' 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                    onClick={() => setUserType('provider')}
                  >
                    <CardContent className="p-8 text-center">
                      <User className="h-14 w-14 text-primary mx-auto mb-6" />
                      <h3 className="font-medium text-xl mb-3 text-foreground">Wellness Provider</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Offer your wellness services and grow your practice
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                      userType === 'consumer' 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                    onClick={() => setUserType('consumer')}
                  >
                    <CardContent className="p-8 text-center">
                      <Heart className="h-14 w-14 text-primary mx-auto mb-6" />
                      <h3 className="font-medium text-xl mb-3 text-foreground">Wellness Seeker</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Discover and book wellness services that nurture your growth
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {userType === 'provider' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Business Name *</Label>
                        <Input
                          id="business-name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Your wellness business name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tell us about your wellness practice..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-omni-green"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Specialties</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableSpecialties.map((specialty) => (
                            <div key={specialty} className="flex items-center space-x-2">
                              <Checkbox
                                id={specialty}
                                checked={specialties.includes(specialty)}
                                onCheckedChange={() => toggleArrayItem(specialties, setSpecialties, specialty)}
                              />
                              <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Province"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            type="number"
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(e.target.value)}
                            placeholder="5"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+27 XX XXX XXXX"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="consumer-location">Location *</Label>
                        <Input
                          id="consumer-location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, Province"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Wellness Goals</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableGoals.map((goal) => (
                            <div key={goal} className="flex items-center space-x-2">
                              <Checkbox
                                id={goal}
                                checked={wellnessGoals.includes(goal)}
                                onCheckedChange={() => toggleArrayItem(wellnessGoals, setWellnessGoals, goal)}
                              />
                              <Label htmlFor={goal} className="text-sm">{goal}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Services</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableSpecialties.map((service) => (
                            <div key={service} className="flex items-center space-x-2">
                              <Checkbox
                                id={`service-${service}`}
                                checked={preferredServices.includes(service)}
                                onCheckedChange={() => toggleArrayItem(preferredServices, setPreferredServices, service)}
                              />
                              <Label htmlFor={`service-${service}`} className="text-sm">{service}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    variant="premium"
                    size="lg"
                    className="w-full h-12 text-base"
                    disabled={loading}
                  >
                    {loading ? "Creating Profile..." : "Complete Registration"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WellnessExchangeSignup;
