import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  ArrowLeft,
  Menu,
  Coins,
  Users,
  Heart,
  MessageSquare,
  User,
  LogOut,
  Store,
  Search,
  Plus
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { IMAGES } from "@/lib/images";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Store, label: "Marketplace", path: "/wellness-exchange/marketplace" },
    { icon: Heart, label: "Wants", path: "/wellness-exchange/wants" },
    { icon: MessageSquare, label: "Community", path: "/wellness-exchange/community" },
    { icon: Users, label: "Partners", path: "/partners" },
    { icon: Coins, label: "WellCoins", path: "/wellness-exchange/transactions" },
    { icon: User, label: "My Account", path: "/wellness-exchange/account" },
  ];

  const quickActions = [
    { icon: Plus, label: "Add Service", path: "/wellness-exchange/add-service" },
    { icon: Search, label: "Find Service", path: "/wellness-exchange/search" },
    { icon: Heart, label: "Post Want", path: "/wellness-exchange/add-want" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Link to="/wellness-exchange/marketplace" className="flex items-center">
            <img 
              src={IMAGES.logos.omniPrimary} 
              alt="Omni Wellness" 
              className="h-8 w-8"
            />
            <span className="ml-2 font-semibold text-gradient-rainbow">
              Wellness Exchange
            </span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="border-b pb-4 mb-4">
                  <h2 className="font-semibold text-lg">Wellness Exchange</h2>
                  {user && (
                    <p className="text-sm text-gray-600">{user.email}</p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="font-medium text-sm text-gray-600 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {quickActions.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <item.icon className="h-5 w-5 text-omni-blue mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Main Navigation */}
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-600 mb-3">Navigation</h3>
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? "bg-omni-blue/10 text-omni-blue"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Sign Out */}
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={signOut}
                    className="w-full flex items-center justify-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t lg:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-omni-blue/10 text-omni-blue"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;