
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/contexts/CartContext";
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
import Videography from "./pages/services/Videography";
import DocumentaryProduction from "./pages/services/DocumentaryProduction";
import CustomArt from "./pages/services/CustomArt";
import Consultation from "./pages/services/Consultation";
import TwoBeWell from "./pages/TwoBeWell";
import TwoBeWellShop from "./pages/TwoBeWellShop";
import PartnerPortal from "./pages/PartnerPortal";
import WellnessExchange from "./pages/WellnessExchange";
import WellnessMarketplace from "./pages/WellnessMarketplace";
import WellnessWants from "./pages/WellnessWants";
import WellnessCommunity from "./pages/WellnessCommunity";
import WellnessAccount from "./pages/WellnessAccount";
import WellnessUsers from "./pages/WellnessUsers";
import AddService from "./pages/AddService";
import SearchServices from "./pages/SearchServices";
import AddWant from "./pages/AddWant";
import ProviderDashboard from "./pages/ProviderDashboard";
import Auth from "./pages/Auth";
import TransactionPage from "./pages/TransactionPage";
import WellnessExchangeSignup from "./pages/WellnessExchangeSignup";
import PartnersDirectory from "./pages/PartnersDirectory";
import PartnerProfile from "./pages/PartnerProfile";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
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
          <Route path="/services/videography" element={<Videography />} />
          <Route path="/services/documentary-production" element={<DocumentaryProduction />} />
          <Route path="/services/custom-art" element={<CustomArt />} />
          <Route path="/services/consultation" element={<Consultation />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/2bewell" element={<TwoBeWell />} />
            <Route path="/2bewell-shop" element={<TwoBeWellShop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/wellness-exchange" element={<WellnessExchange />} />
            <Route path="/wellness-exchange/marketplace" element={<WellnessMarketplace />} />
            <Route path="/wellness-exchange/wants" element={<WellnessWants />} />
            <Route path="/wellness-exchange/community" element={<WellnessCommunity />} />
            <Route path="/wellness-exchange/account" element={<WellnessAccount />} />
            <Route path="/wellness-exchange/users" element={<WellnessUsers />} />
            <Route path="/wellness-exchange/search" element={<SearchServices />} />
            <Route path="/wellness-exchange/add-service" element={<AddService />} />
            <Route path="/wellness-exchange/add-want" element={<AddWant />} />
            <Route path="/wellness-exchange/transactions" element={<TransactionPage />} />
            <Route path="/wellness-exchange/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/wellness-exchange/provider-signup" element={<WellnessExchangeSignup />} />
            <Route path="/wellness-exchange/consumer-signup" element={<WellnessExchangeSignup />} />
            <Route path="/partners" element={<PartnersDirectory />} />
            <Route path="/partners/:id" element={<PartnerProfile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
