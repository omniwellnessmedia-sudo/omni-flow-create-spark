import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/AuthProvider';
import { CartProvider } from '@/components/CartProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load components for better performance
const Index = React.lazy(() => import('@/pages/Index'));
const WellnessExchange = React.lazy(() => import('@/pages/WellnessExchange'));
const WellnessMarketplace = React.lazy(() => import('@/pages/WellnessMarketplace'));
const UnifiedMarketplace = React.lazy(() => import('@/pages/UnifiedMarketplace'));
const WellnessAccount = React.lazy(() => import('@/pages/WellnessAccount'));
const WellnessWants = React.lazy(() => import('@/pages/WellnessWants'));
const WellnessCommunity = React.lazy(() => import('@/pages/WellnessCommunity'));
const SimpleServiceDetail = React.lazy(() => import('@/pages/SimpleServiceDetail'));
const ServiceDetailFixed = React.lazy(() => import('@/pages/ServiceDetailFixed'));
const IndividualProviderProfile = React.lazy(() => import('@/pages/IndividualProviderProfile'));
const SandyMitchellProfile = React.lazy(() => import('@/pages/SandyMitchellProfile'));
const AddService = React.lazy(() => import('@/pages/AddService'));
const CommunityBlog = React.lazy(() => import('@/pages/CommunityBlog'));
const ProviderDashboard = React.lazy(() => import('@/pages/ProviderDashboard'));
const ModernProviderPortal = React.lazy(() => import('@/pages/ModernProviderPortal'));
const ToursRetreats = React.lazy(() => import('@/pages/ToursRetreats'));
const TransactionPage = React.lazy(() => import('@/pages/TransactionPage'));
const TwoBeWellShop = React.lazy(() => import('@/pages/TwoBeWellShop'));
const WellnessDeals = React.lazy(() => import('@/pages/WellnessDeals'));
const AuthPage = React.lazy(() => import('@/pages/Auth'));
const TestPage = React.lazy(() => import('@/pages/TestPage'));
const TestSimple = React.lazy(() => import('@/pages/TestSimple'));
const About = React.lazy(() => import('@/pages/About'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Services = React.lazy(() => import('@/pages/Services'));
const PrivacyPolicy = React.lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService'));
const ServiceDetail = React.lazy(() => import('@/pages/ServiceDetail'));
const SearchServices = React.lazy(() => import('@/pages/SearchServices'));
const AddWant = React.lazy(() => import('@/pages/AddWant'));
const TwoBeWell = React.lazy(() => import('@/pages/TwoBeWell'));
const TravelWellConnectedStore = React.lazy(() => import('@/pages/TravelWellConnectedStore'));
const DataProducts = React.lazy(() => import('@/pages/DataProducts'));
const ProductDetail = React.lazy(() => import('@/pages/ProductDetail'));
const DealDetail = React.lazy(() => import('@/pages/DealDetail'));
const Checkout = React.lazy(() => import('@/pages/Checkout'));
const OrderConfirmation = React.lazy(() => import('@/pages/OrderConfirmation'));
const PaymentSuccess = React.lazy(() => import('@/pages/PaymentSuccess'));
const PaymentCancelled = React.lazy(() => import('@/pages/PaymentCancelled'));
const Blog = React.lazy(() => import('@/pages/Blog'));
const BlogEditor = React.lazy(() => import('@/pages/BlogEditor'));
const BlogPost = React.lazy(() => import('@/pages/BlogPost'));
const Podcast = React.lazy(() => import('@/pages/Podcast'));
const Portfolio = React.lazy(() => import('@/pages/Portfolio'));
const Resources = React.lazy(() => import('@/pages/Resources'));
const WellnessExchangeSignup = React.lazy(() => import('@/pages/WellnessExchangeSignup'));
const BusinessConsulting = React.lazy(() => import('@/pages/BusinessConsulting'));
const MediaProduction = React.lazy(() => import('@/pages/MediaProduction'));
const WebDevelopment = React.lazy(() => import('@/pages/WebDevelopment'));
const SocialMediaStrategy = React.lazy(() => import('@/pages/SocialMediaStrategy'));
const AITools = React.lazy(() => import('@/pages/AITools'));
const TourCategory = React.lazy(() => import('@/pages/TourCategory'));
const TourDetail = React.lazy(() => import('@/pages/TourDetail'));
const PartnersDirectory = React.lazy(() => import('@/pages/PartnersDirectory'));
const PartnerProfile = React.lazy(() => import('@/pages/PartnerProfile'));
const PartnerPortal = React.lazy(() => import('@/pages/PartnerPortal'));
const ExerciseLibrary = React.lazy(() => import('@/pages/ExerciseLibrary'));
const DeviceCompatibility = React.lazy(() => import('@/pages/DeviceCompatibility'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const TechnicalOverview = React.lazy(() => import('@/pages/TechnicalOverview'));
const RoamBuddyAPITest = React.lazy(() => import('@/pages/RoamBuddyAPITest'));
const RoamBuddyIntegrationTest = React.lazy(() => import('@/pages/RoamBuddyIntegrationTest'));
const RoamBuddyStore = React.lazy(() => import('@/pages/RoamBuddyStore'));
const AffiliateMarketplace = React.lazy(() => import('@/pages/AffiliateMarketplace'));
const AffiliatePerformance = React.lazy(() => import('@/pages/admin/AffiliatePerformance'));
const AffiliatePayouts = React.lazy(() => import('@/pages/admin/AffiliatePayouts'));
const CJAffiliateProducts = React.lazy(() => import('@/pages/CJAffiliateProducts'));
const CJProductDetail = React.lazy(() => import('@/pages/CJProductDetail'));
const StoreCollections = React.lazy(() => import('@/pages/StoreCollections'));
const StoreProductDetail = React.lazy(() => import('@/pages/StoreProductDetail'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
      <h2 className="text-xl font-semibold text-gray-700">Loading Omni Wellness...</h2>
      <p className="text-gray-500">Preparing your wellness experience</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Main Platform Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/test-simple" element={<TestSimple />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Wellness Exchange Routes */}
                  <Route path="/wellness-exchange" element={<WellnessExchange />} />
                  <Route path="/wellness-exchange/marketplace" element={<WellnessMarketplace />} />
                  <Route path="/wellness-exchange/service/:id" element={<ServiceDetail />} />
                  <Route path="/wellness-exchange/account" element={<WellnessAccount />} />
                  <Route path="/wellness-exchange/wants" element={<WellnessWants />} />
                  <Route path="/wellness-exchange/community" element={<WellnessCommunity />} />
                  <Route path="/wellness-exchange/search" element={<SearchServices />} />
                  <Route path="/wellness-exchange/add-service" element={<AddService />} />
                  <Route path="/wellness-exchange/add-want" element={<AddWant />} />
                  <Route path="/wellness-exchange/provider-dashboard" element={<ProviderDashboard />} />
                  <Route path="/wellness-exchange-signup" element={<WellnessExchangeSignup />} />
                  <Route path="/wellness-community" element={<WellnessCommunity />} />

                  {/* Marketplace & Services */}
                  <Route path="/marketplace" element={<UnifiedMarketplace />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/service/:id" element={<SimpleServiceDetail />} />
                  <Route path="/service-detail/:id" element={<ServiceDetail />} />
                  <Route path="/service-detail/:serviceId" element={<ServiceDetailFixed />} />
                  <Route path="/search-services" element={<SearchServices />} />
                  <Route path="/add-want" element={<AddWant />} />

                  {/* E-commerce & Products */}
                  <Route path="/two-be-well" element={<TwoBeWell />} />
                  <Route path="/two-be-well-shop" element={<TwoBeWellShop />} />
                  <Route path="/cj-affiliate-products" element={<CJAffiliateProducts />} />
                  <Route path="/cj-products/:id" element={<CJProductDetail />} />
                  <Route path="/store" element={<StoreCollections />} />
                  <Route path="/store/collections/:handle" element={<StoreCollections />} />
                  <Route path="/store/product/:id" element={<StoreProductDetail />} />
                  <Route path="/wellness-deals" element={<WellnessDeals />} />
                  <Route path="/travel-well-connected-store" element={<TravelWellConnectedStore />} />
                  <Route path="/data-products" element={<DataProducts />} />
                  <Route path="/product-detail/:id" element={<ProductDetail />} />
                  <Route path="/deal-detail/:id" element={<DealDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-cancelled" element={<PaymentCancelled />} />

                  {/* Provider Routes */}
                  <Route path="/provider-directory" element={<IndividualProviderProfile />} />
                  <Route path="/provider/sandy-mitchell" element={<SandyMitchellProfile />} />
                  <Route path="/provider/:id" element={<IndividualProviderProfile />} />
                  
                  {/* Provider Dashboard & Management */}
                  <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                  <Route path="/provider-portal" element={<ModernProviderPortal />} />
                  <Route path="/add-service" element={<AddService />} />
                  
                  {/* Community & Content */}
                  <Route path="/community" element={<CommunityBlog />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog-editor" element={<BlogEditor />} />
                  <Route path="/blog-post/:slug" element={<BlogPost />} />
                  <Route path="/podcast" element={<Podcast />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/resources" element={<Resources />} />

                  {/* Travel & Tours */}
                  <Route path="/tours-retreats" element={<ToursRetreats />} />
                  <Route path="/tour-category/:category" element={<TourCategory />} />
                  <Route path="/tour-detail/:id" element={<TourDetail />} />

                  {/* Business Services */}
                  <Route path="/business-consulting" element={<BusinessConsulting />} />
                  <Route path="/media-production" element={<MediaProduction />} />
                  <Route path="/web-development" element={<WebDevelopment />} />
                  <Route path="/social-media-strategy" element={<SocialMediaStrategy />} />

                  {/* AI & Technology */}
                  <Route path="/ai-tools" element={<AITools />} />

                  {/* Affiliate Marketplace */}
                  <Route path="/affiliate-marketplace" element={<AffiliateMarketplace />} />

                  {/* Partners */}
                  <Route path="/partners-directory" element={<PartnersDirectory />} />
                  <Route path="/partner-profile/:id" element={<PartnerProfile />} />
                  <Route path="/partner-portal" element={<PartnerPortal />} />

                  {/* Health & Fitness */}
                  <Route path="/exercise-library" element={<ExerciseLibrary />} />
                  <Route path="/device-compatibility" element={<DeviceCompatibility />} />

                  {/* Transaction & Payment */}
                  <Route path="/transaction" element={<TransactionPage />} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin-dashboard" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/technical-overview" element={
                    <ProtectedRoute requireAdmin={true}>
                      <TechnicalOverview />
                    </ProtectedRoute>
                  } />
                  <Route path="/api-test/roambuddy" element={
                    <ProtectedRoute requireAdmin={true}>
                      <RoamBuddyAPITest />
                    </ProtectedRoute>
                  } />
                  <Route path="/integration-test" element={
                    <ProtectedRoute requireAdmin={true}>
                      <RoamBuddyIntegrationTest />
                    </ProtectedRoute>
                  } />
                  <Route path="/roambuddy-store" element={
                    <ProtectedRoute requireAdmin={true}>
                      <RoamBuddyStore />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/affiliate-performance" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AffiliatePerformance />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/affiliate-payouts" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AffiliatePayouts />
                    </ProtectedRoute>
                  } />

                  {/* Error Handling */}
                  <Route path="/404" element={<NotFound />} />

                  {/* Catch-all redirect to homepage */}
                  <Route path="*" element={<Index />} />
                </Routes>
              </Suspense>
              
              {/* Global Toast Notifications */}
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;