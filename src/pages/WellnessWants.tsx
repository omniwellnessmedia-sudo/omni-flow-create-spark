import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MegaNavigation from "@/components/MegaNavigation";
import Footer from "@/components/Footer";
import WellnessExchangeNavigation from "@/components/WellnessExchangeNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  MapPin, 
  Clock, 
  Coins, 
  DollarSign, 
  MessageCircle,
  User,
  Calendar
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { format } from "date-fns";

interface Want {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget_wellcoins: number;
  budget_zar: number;
  expires_at: string;
  responses_count: number;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

const WellnessWants = () => {
  const { user } = useAuth();
  const [wants, setWants] = useState<Want[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [budgetWellcoins, setBudgetWellcoins] = useState("");
  const [budgetZar, setBudgetZar] = useState("");
  const [expiresIn, setExpiresIn] = useState("7"); // days

  const categories = [
    "Yoga", "Meditation", "Nutrition", "Massage Therapy", "Acupuncture",
    "Life Coaching", "Personal Training", "Reiki", "Aromatherapy", "Herbalism"
  ];

  useEffect(() => {
    fetchWants();
  }, []);

  const fetchWants = async () => {
    try {
      const { data, error } = await supabase
        .from('wants')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWants(data || []);
    } catch (error: any) {
      toast.error("Failed to load wants");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to post a want");
      return;
    }

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));

      const { error } = await supabase
        .from('wants')
        .insert({
          user_id: user.id,
          title,
          description,
          category: category || null,
          location: location || null,
          budget_wellcoins: budgetWellcoins ? parseInt(budgetWellcoins) : null,
          budget_zar: budgetZar ? parseFloat(budgetZar) : null,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;

      toast.success("Want posted successfully!");
      setShowCreateDialog(false);
      resetForm();
      fetchWants();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setBudgetWellcoins("");
    setBudgetZar("");
    setExpiresIn("7");
  };

  const handleRespondToWant = (wantId: string) => {
    if (!user) {
      toast.error("Please sign in to respond to wants");
      return;
    }
    
    // In a real app, this would open a response modal
    toast.success("Response sent! The want creator will contact you soon.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MegaNavigation />
        <main className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-omni-violet mx-auto mb-4"></div>
              <p className="text-gray-600">Loading wants...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MegaNavigation />
      <WellnessExchangeNavigation />
      <main className="pt-0">
        {/* Header */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
                  Community <span className="text-omni-violet">Wants</span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Post what you're looking for or browse community requests for wellness services
                </p>
              </div>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-omni-violet hover:bg-omni-indigo text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Want
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Post a Want</DialogTitle>
                    <DialogDescription>
                      Let the community know what wellness service you're looking for
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateWant} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="want-title">Title *</Label>
                      <Input
                        id="want-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What do you want?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="want-description">Description *</Label>
                      <Textarea
                        id="want-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what you're looking for..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="want-category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="want-location">Location</Label>
                        <Input
                          id="want-location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="budget-zar">Budget (ZAR)</Label>
                        <Input
                          id="budget-zar"
                          type="number"
                          value={budgetZar}
                          onChange={(e) => setBudgetZar(e.target.value)}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget-wellcoins">Budget (WellCoins)</Label>
                        <Input
                          id="budget-wellcoins"
                          type="number"
                          value={budgetWellcoins}
                          onChange={(e) => setBudgetWellcoins(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expires-in">Expires In</Label>
                      <Select value={expiresIn} onValueChange={setExpiresIn}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">1 week</SelectItem>
                          <SelectItem value="14">2 weeks</SelectItem>
                          <SelectItem value="30">1 month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full bg-omni-violet hover:bg-omni-indigo text-white">
                      Post Want
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Wants List */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {wants.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No wants posted yet</h3>
                <p className="text-gray-600 mb-6">Be the first to post what you're looking for!</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-omni-violet hover:bg-omni-indigo text-white"
                >
                  Post a Want
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {wants.map((want) => (
                  <Card key={want.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{want.title}</CardTitle>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {want.profiles.full_name}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Posted {format(new Date(want.created_at), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Expires {format(new Date(want.expires_at), 'MMM d')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-omni-violet/10 text-omni-violet">
                            {want.responses_count} response{want.responses_count !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <CardDescription className="text-gray-700 mb-4">
                        {want.description}
                      </CardDescription>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {want.category && (
                          <Badge variant="outline">{want.category}</Badge>
                        )}
                        {want.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {want.location}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {want.budget_zar && (
                            <div className="flex items-center text-green-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span className="font-semibold">Up to R{want.budget_zar}</span>
                            </div>
                          )}
                          {want.budget_wellcoins && (
                            <div className="flex items-center text-omni-orange">
                              <Coins className="h-4 w-4 mr-1" />
                              <span className="font-semibold">Up to {want.budget_wellcoins} WC</span>
                            </div>
                          )}
                        </div>

                        <Button 
                          onClick={() => handleRespondToWant(want.id)}
                          variant="outline"
                          size="sm"
                          className="hover:bg-omni-violet hover:text-white"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Respond
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WellnessWants;