import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { 
  WellnessProvider, 
  WellnessService, 
  WellnessPackage, 
  WellnessProduct, 
  WellnessExperience, 
  WellnessDeal,
  WellnessMarketplaceItem 
} from "@/types/marketplace";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

// Icons
import { 
  LayoutDashboard,
  Heart,
  Package,
  ShoppingBag,
  Sparkles,
  Tags,
  Calendar,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  MapPin,
  Phone,
  Mail,
  Camera,
  Upload,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  MessageCircle,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Coins,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Zap,
  PiggyBank,
  FileText,
  Briefcase,
  UserCheck,
  Award,
  Building,
  CalendarDays,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  Store,
  GiftIcon as Gift,
  Ticket,
  BookOpen,
  HelpCircle,
  LogOut,
  Palette
} from "lucide-react";
import { IMAGES } from "@/lib/images";

// Mock Data - Replace with real API calls
const mockProvider: WellnessProvider = {
  id: "provider-1",
  user_id: "user-1",
  business_name: "Serenity Wellness Studio",
  business_type: "business",
  description: "We offer holistic wellness solutions including yoga, meditation, breathwork, and energy healing to help you achieve balance and inner peace.",
  location: "Cape Town, South Africa",
  contact: {
    phone: "+27 21 123 4567",
    email: "hello@serenitywellness.co.za",
    website: "https://serenitywellness.co.za",
    social_media: {
      instagram: "@serenitywellness",
      facebook: "SerenityWellnessStudio"
    }
  },
  profile_image_url: IMAGES.sandy.profile,
  cover_image_url: IMAGES.wellness.retreat,
  specialties: ["Yoga", "Meditation", "Breathwork", "Energy Healing", "Sound Therapy"],
  certifications: ["RYT 500 Yoga Alliance", "Certified Meditation Teacher", "Reiki Master Level III"],
  years_experience: 8,
  is_verified: true,
  rating: 4.9,
  review_count: 127,
  wellcoin_balance: 2450,
  capabilities: {
    can_sell_services: true,
    can_sell_products: true,
    can_create_experiences: true,
    can_offer_deals: true,
    can_accept_wellcoins: true,
    has_ecommerce_enabled: true,
    has_booking_system: true
  },
  settings: {
    auto_approve_bookings: false,
    requires_deposit: true,
    deposit_percentage: 25,
    cancellation_window_hours: 24,
    timezone: "Africa/Johannesburg",
    business_hours: {
      monday: { open: "06:00", close: "20:00" },
      tuesday: { open: "06:00", close: "20:00" },
      wednesday: { open: "06:00", close: "20:00" },
      thursday: { open: "06:00", close: "20:00" },
      friday: { open: "06:00", close: "18:00" },
      saturday: { open: "08:00", close: "16:00" },
      sunday: { open: "08:00", close: "16:00" }
    }
  }
};

const mockAnalytics = {
  revenue: {
    total: 45200,
    thisMonth: 8750,
    lastMonth: 7400,
    growth: 18.2
  },
  bookings: {
    total: 234,
    thisMonth: 42,
    lastMonth: 36,
    growth: 16.7
  },
  clients: {
    total: 156,
    active: 89,
    new: 12,
    growth: 8.5
  },
  conversion: {
    rate: 72,
    views: 1240,
    bookings: 892
  },
  topServices: [
    { name: "Vinyasa Flow Yoga", bookings: 68, revenue: 8160 },
    { name: "Guided Meditation", bookings: 45, revenue: 4500 },
    { name: "Breathwork Session", bookings: 32, revenue: 4800 },
    { name: "Sound Healing", bookings: 28, revenue: 5600 }
  ],
  monthlyData: [
    { month: 'Jul', revenue: 6200, bookings: 32, clients: 28 },
    { month: 'Aug', revenue: 7100, bookings: 38, clients: 31 },
    { month: 'Sep', revenue: 6800, bookings: 35, clients: 29 },
    { month: 'Oct', revenue: 8200, bookings: 43, clients: 36 },
    { month: 'Nov', revenue: 7900, bookings: 41, clients: 34 },
    { month: 'Dec', revenue: 8750, bookings: 45, clients: 38 }
  ]
};

interface Booking {
  id: string;
  service_title: string;
  client_name: string;
  client_email: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  amount: number;
  payment_method: 'zar' | 'wellcoins';
}

const mockBookings: Booking[] = [
  {
    id: "1",
    service_title: "Vinyasa Flow Yoga",
    client_name: "Sarah Mitchell",
    client_email: "sarah@example.com",
    date: "2024-12-15",
    time: "09:00",
    status: "confirmed",
    amount: 120,
    payment_method: "zar"
  },
  {
    id: "2",
    service_title: "Guided Meditation",
    client_name: "James Wilson",
    client_email: "james@example.com",
    date: "2024-12-15",
    time: "18:30",
    status: "pending",
    amount: 350,
    payment_method: "wellcoins"
  }
];

const ModernProviderPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [provider] = useState<WellnessProvider>(mockProvider);
  const [analytics] = useState(mockAnalytics);
  const [bookings] = useState<Booking[]>(mockBookings);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  // Authentication check - only Sandy should access this portal
  useEffect(() => {
    if (!user) {
      toast.error("Access Denied", {
        description: "Please sign in to access the provider portal"
      });
      navigate('/auth');
      return;
    }
    
    // Only Sandy Mitchell should have access to the provider portal
    if (user.email !== 'sandy@omniwellness.co.za' && user.email !== 'admin@omniwellness.co.za') {
      toast.error("Access Denied", {
        description: "You don't have permission to access the provider portal"
      });
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    if (!provider) return 0;
    const fields = [
      provider.business_name,
      provider.description,
      provider.location,
      provider.contact.phone,
      provider.contact.email,
      provider.specialties.length > 0,
      provider.certifications.length > 0,
      provider.profile_image_url,
      provider.years_experience > 0,
      provider.contact.website
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [provider]);

  // Navigation items
  const navItems = [
    {
      group: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "analytics", label: "Analytics", icon: BarChart3 }
      ]
    },
    {
      group: "Content Management",
      items: [
        { id: "services", label: "Services", icon: Heart },
        { id: "packages", label: "Packages", icon: Package },
        { id: "products", label: "Products", icon: ShoppingBag },
        { id: "experiences", label: "Experiences", icon: Sparkles },
        { id: "deals", label: "Deals & Offers", icon: Tags }
      ]
    },
    {
      group: "Business",
      items: [
        { id: "bookings", label: "Bookings", icon: Calendar },
        { id: "clients", label: "Clients", icon: Users },
        { id: "payments", label: "Payments", icon: CreditCard },
        { id: "ecommerce", label: "E-commerce", icon: Store }
      ]
    },
    {
      group: "Account",
      items: [
        { id: "profile", label: "Profile", icon: User },
        { id: "settings", label: "Settings", icon: Settings }
      ]
    }
  ];

  // Stat Card Component
  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend = 'up',
    icon: Icon,
    color = 'blue',
    prefix = '',
    suffix = ''
  }: {
    title: string;
    value: number | string;
    change?: number;
    trend?: 'up' | 'down';
    icon: React.ElementType;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    prefix?: string;
    suffix?: string;
  }) => {
    const colorClasses = {
      blue: 'from-blue-500/10 to-indigo-500/10 border-blue-200/50',
      green: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/50',
      purple: 'from-purple-500/10 to-violet-500/10 border-purple-200/50',
      orange: 'from-orange-500/10 to-amber-500/10 border-orange-200/50',
      red: 'from-rose-500/10 to-red-500/10 border-rose-200/50'
    };

    const iconColors = {
      blue: 'text-blue-600',
      green: 'text-emerald-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-rose-600'
    };

    return (
      <Card className={`relative overflow-hidden border bg-gradient-to-br ${colorClasses[color]} hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
              </p>
              {change !== undefined && (
                <div className="flex items-center space-x-1">
                  {trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-rose-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {change > 0 ? '+' : ''}{change}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm ${iconColors[color]}`}>
              <Icon className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20 ring-4 ring-white/30">
                <AvatarImage src={provider.profile_image_url} />
                <AvatarFallback className="text-2xl font-bold bg-white/20">
                  {provider.business_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {provider.business_name}!</h1>
                <p className="text-lg text-white/90 mb-4">Here's what's happening with your wellness practice today</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-current text-amber-300" />
                    <span>{provider.rating} ({provider.review_count} reviews)</span>
                  </div>
                  {provider.is_verified && (
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center space-x-3">
                    <Coins className="h-6 w-6 text-amber-300" />
                    <div>
                      <p className="text-sm text-white/80">WellCoin Balance</p>
                      <p className="text-xl font-bold">{provider.wellcoin_balance} WC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex space-x-2">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Banner */}
      {profileCompletion < 100 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Complete Your Profile</h3>
                  <p className="text-gray-600 mt-1">
                    Complete profiles get 3x more bookings and higher search visibility
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{profileCompletion}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
                
                <div className="w-24 h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-amber-200" />
                    <circle
                      cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" fill="transparent"
                      strokeDasharray={`${2.51 * profileCompletion} 251.2`}
                      className="text-amber-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-amber-500" />
                  </div>
                </div>
                
                <Button 
                  onClick={() => setActiveSection('profile')} 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                >
                  Complete Profile
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={analytics.revenue.total}
          change={analytics.revenue.growth}
          trend="up"
          icon={DollarSign}
          color="green"
          prefix="R"
        />
        <StatCard
          title="Total Bookings"
          value={analytics.bookings.total}
          change={analytics.bookings.growth}
          trend="up"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Active Clients"
          value={analytics.clients.active}
          change={analytics.clients.growth}
          trend="up"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Conversion Rate"
          value={analytics.conversion.rate}
          icon={Target}
          color="orange"
          suffix="%"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly performance over the last 6 months</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">R{analytics.revenue.thisMonth.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{analytics.bookings.thisMonth}</div>
                  <div className="text-sm text-gray-600">Bookings</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">{analytics.conversion.rate}%</div>
                  <div className="text-sm text-gray-600">Conversion</div>
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Monthly Revenue</span>
                  <span>Last 6 Months</span>
                </div>
                {analytics.monthlyData.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-gray-600">R{month.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(month.revenue / 10000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Top Services */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your practice efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Plus, title: 'Add Service', desc: 'Create new offering', color: 'from-blue-500 to-blue-600' },
                { icon: Calendar, title: 'Set Availability', desc: 'Update schedule', color: 'from-purple-500 to-purple-600' },
                { icon: Camera, title: 'Upload Media', desc: 'Add photos/videos', color: 'from-emerald-500 to-emerald-600' },
                { icon: MessageCircle, title: 'Contact Clients', desc: 'Send updates', color: 'from-orange-500 to-orange-600' }
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full h-auto p-4 justify-start space-x-4 hover:bg-gray-50"
                  onClick={() => {
                    if (action.title === 'Add Service') setActiveSection('services');
                  }}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white shadow-sm`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.desc}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.topServices.map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 text-white font-bold text-sm flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">R{service.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest client appointments</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setActiveSection('bookings')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                      {booking.client_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{booking.client_name}</p>
                    <p className="text-sm text-gray-600">{booking.service_title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </Badge>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{booking.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    {booking.payment_method === 'wellcoins' ? `${booking.amount} WC` : `R${booking.amount}`}
                  </p>
                  <p className="text-sm text-gray-500">{booking.time}</p>
                </div>
              </div>
            ))}
            
            {bookings.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Your client bookings will appear here</p>
                <Button onClick={() => setActiveSection('bookings')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Availability
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key metrics and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: TrendingUp,
                title: "Revenue Growth",
                value: `+${analytics.revenue.growth}% this month`,
                color: "text-green-600",
                bg: "bg-green-50"
              },
              {
                icon: Users,
                title: "Client Retention",
                value: "89% returning clients",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: Star,
                title: "Service Rating",
                value: `${provider.rating}/5 average rating`,
                color: "text-amber-600",
                bg: "bg-amber-50"
              },
              {
                icon: Eye,
                title: "Profile Views",
                value: "1,240 views this month",
                color: "text-purple-600",
                bg: "bg-purple-50"
              }
            ].map((insight, i) => (
              <div key={i} className={`p-4 rounded-lg ${insight.bg}`}>
                <div className="flex items-center space-x-3">
                  <insight.icon className={`h-6 w-6 ${insight.color}`} />
                  <div>
                    <p className="font-semibold text-gray-900">{insight.title}</p>
                    <p className={`text-sm ${insight.color}`}>{insight.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Content Management Sections
  const ServicesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Services</h2>
          <p className="text-gray-600 mt-1">Manage your wellness service offerings</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600">Total Services</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">10</div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-gray-600">Inactive</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">R145</div>
            <div className="text-sm text-gray-600">Avg. Price</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Adding Your Services</h3>
            <p className="text-gray-600 mb-6">Create your first wellness service to start attracting clients</p>
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Loading component
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-8 space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="border-r bg-white">
          <SidebarHeader className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 text-white">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold">Provider Portal</h2>
                <p className="text-sm text-gray-500">Wellness Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            {navItems.map((group) => (
              <SidebarGroup key={group.group}>
                <SidebarGroupLabel className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.group}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeSection === item.id}
                          onClick={() => setActiveSection(item.id)}
                          className="w-full justify-start"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={provider.profile_image_url} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-teal-500 text-white font-bold">
                  {provider.business_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{provider.business_name}</p>
                <p className="text-xs text-gray-500 truncate">{provider.contact.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => navigate('/auth')}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/"><Home className="h-4 w-4" /></Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={() => setActiveSection('dashboard')}>
                      Provider Portal
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">{activeSection}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <div className="ml-auto flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2 text-sm">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold">{provider.wellcoin_balance} WC</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            {activeSection === 'dashboard' && <DashboardContent />}
            {activeSection === 'services' && <ServicesContent />}
            {activeSection === 'analytics' && (
              <div className="text-center py-24">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Advanced Analytics</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Comprehensive analytics including revenue trends, client insights, and performance metrics coming soon.
                </p>
                <Button>
                  <Bell className="h-4 w-4 mr-2" />
                  Notify When Ready
                </Button>
              </div>
            )}
            {/* Add other section content as needed */}
            {!['dashboard', 'services', 'analytics'].includes(activeSection) && (
              <div className="text-center py-24">
                <div className="p-8 rounded-full bg-gray-100 inline-block mb-6">
                  {navItems.flatMap(g => g.items).find(item => item.id === activeSection)?.icon && (
                    React.createElement(
                      navItems.flatMap(g => g.items).find(item => item.id === activeSection)!.icon,
                      { className: "h-16 w-16 text-gray-400" }
                    )
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4 capitalize">{activeSection} Management</h3>
                <p className="text-gray-600 mb-8">
                  This section is coming soon with advanced features for managing your {activeSection}.
                </p>
                <Button>
                  <Bell className="h-4 w-4 mr-2" />
                  Notify When Ready
                </Button>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ModernProviderPortal;