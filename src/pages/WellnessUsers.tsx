import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileNavigation from "@/components/MobileNavigation";
import { Search, Filter, MapPin, Users, MessageSquare, Heart, Star } from "lucide-react";

const WellnessUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const mockUsers = [
    {
      id: "1",
      name: "Sarah Chen",
      type: "provider",
      specialty: "Yoga Instructor",
      location: "Cape Town",
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b602?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "2", 
      name: "Marcus Johnson",
      type: "consumer",
      interests: ["Meditation", "Hiking"],
      location: "Stellenbosch",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "Dr. Amara Okafor", 
      type: "provider",
      specialty: "Holistic Healer",
      location: "Johannesburg",
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "4",
      name: "Emma Rodriguez",
      type: "consumer", 
      interests: ["Pilates", "Nutrition"],
      location: "Durban",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.type === 'provider' && user.specialty?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.type === 'consumer' && user.interests?.some(interest => 
                           interest.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilter = filterType === "all" || user.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation />
      
      <main className="pt-20 pb-20 lg:pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl">
              Find <span className="bg-rainbow-gradient bg-clip-text text-transparent">Users</span>
            </h1>
            <p className="text-gray-600 mt-1">Connect with wellness providers and community members</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users, specialties, or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="provider">Providers</SelectItem>
                <SelectItem value="consumer">Community Members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="text-center p-4">
              <Users className="h-6 w-6 mx-auto mb-2 text-omni-blue" />
              <div className="text-2xl font-bold">248</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </Card>
            <Card className="text-center p-4">
              <Star className="h-6 w-6 mx-auto mb-2 text-omni-orange" />
              <div className="text-2xl font-bold">127</div>
              <div className="text-sm text-gray-600">Providers</div>
            </Card>
            <Card className="text-center p-4">
              <Heart className="h-6 w-6 mx-auto mb-2 text-omni-pink" />
              <div className="text-2xl font-bold">121</div>
              <div className="text-sm text-gray-600">Community</div>
            </Card>
            <Card className="text-center p-4">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-omni-purple" />
              <div className="text-2xl font-bold">89</div>
              <div className="text-sm text-gray-600">Active Today</div>
            </Card>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={user.image} 
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge variant={user.type === 'provider' ? 'default' : 'secondary'}>
                          {user.type === 'provider' ? 'Provider' : 'Member'}
                        </Badge>
                      </div>
                      
                      {user.type === 'provider' ? (
                        <div className="mt-2">
                          <p className="text-omni-blue font-medium">{user.specialty}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{user.rating} ({user.reviews} reviews)</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className="text-gray-600">Interests:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.interests?.map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center mt-3 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {user.location}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" className="bg-rainbow-gradient hover:opacity-90 text-white">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-lg mb-2">No users found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all users
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WellnessUsers;