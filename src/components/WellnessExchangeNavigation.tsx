import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Store, 
  Heart, 
  Users, 
  User, 
  Plus, 
  Search, 
  MessageCircle,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const WellnessExchangeNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Marketplace",
      path: "/wellness-exchange/marketplace",
      icon: Store,
      description: "Browse services"
    },
    {
      label: "Wants",
      path: "/wellness-exchange/wants",
      icon: Heart,
      description: "Community requests"
    },
    {
      label: "Community",
      path: "/wellness-exchange/community",
      icon: Users,
      description: "Connect & share"
    },
    {
      label: "Search",
      path: "/wellness-exchange/search",
      icon: Search,
      description: "Find services"
    },
    {
      label: "Add Service",
      path: "/wellness-exchange/add-service",
      icon: Plus,
      description: "List your service"
    },
    {
      label: "Add Want",
      path: "/wellness-exchange/add-want",
      icon: MessageCircle,
      description: "Request something"
    },
    {
      label: "Dashboard",
      path: "/wellness-exchange/provider-dashboard",
      icon: BarChart3,
      description: "Provider dashboard"
    },
    {
      label: "Account",
      path: "/wellness-exchange/account",
      icon: User,
      description: "My account"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <h2 className="font-heading font-bold text-xl">
              <span className="bg-rainbow-gradient bg-clip-text text-transparent">
                Wellness Exchange
              </span>
            </h2>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    isActive(item.path) 
                      ? "bg-rainbow-gradient text-white" 
                      : "hover:bg-gray-100"
                  )}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Mobile Navigation Dropdown */}
          <div className="lg:hidden">
            <select
              value={location.pathname}
              onChange={(e) => navigate(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-omni-blue focus:border-omni-blue sm:text-sm rounded-md"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessExchangeNavigation;