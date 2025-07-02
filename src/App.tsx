
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import Podcast from "./pages/Podcast";
import Contact from "./pages/Contact";
import AITools from "./pages/AITools";
import BusinessConsulting from "./pages/BusinessConsulting";
import MediaProduction from "./pages/MediaProduction";
import SocialMediaStrategy from "./pages/SocialMediaStrategy";
import WebDevelopment from "./pages/WebDevelopment";
import TwoBeWell from "./pages/TwoBeWell";
import TwoBeWellShop from "./pages/TwoBeWellShop";
import PartnerPortal from "./pages/PartnerPortal";
import WellnessExchange from "./pages/WellnessExchange";
import WellnessMarketplace from "./pages/WellnessMarketplace";
import WellnessWants from "./pages/WellnessWants";
import WellnessCommunity from "./pages/WellnessCommunity";
import ProviderDashboard from "./pages/ProviderDashboard";
import Auth from "./pages/Auth";
import WellnessExchangeSignup from "./pages/WellnessExchangeSignup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/business-consulting" element={<BusinessConsulting />} />
            <Route path="/services/media-production" element={<MediaProduction />} />
            <Route path="/services/social-media-strategy" element={<SocialMediaStrategy />} />
            <Route path="/services/web-development" element={<WebDevelopment />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/2bewell" element={<TwoBeWell />} />
            <Route path="/2bewell-shop" element={<TwoBeWellShop />} />
            <Route path="/partner-portal" element={<PartnerPortal />} />
            <Route path="/wellness-exchange" element={<WellnessExchange />} />
            <Route path="/wellness-exchange/marketplace" element={<WellnessMarketplace />} />
            <Route path="/wellness-exchange/wants" element={<WellnessWants />} />
            <Route path="/wellness-exchange/community" element={<WellnessCommunity />} />
            <Route path="/wellness-exchange/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/wellness-exchange/provider-signup" element={<WellnessExchangeSignup />} />
            <Route path="/wellness-exchange/consumer-signup" element={<WellnessExchangeSignup />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
