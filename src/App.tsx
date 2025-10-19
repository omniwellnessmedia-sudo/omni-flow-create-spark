import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/AuthProvider';
import { CartProvider } from '@/components/CartProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

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
const ServiceDetail = React.lazy(() => import('@/pages/ServiceDetail'));
const SearchServices = React.lazy(() => import('@/pages/SearchServices'));
const AddWant = React.lazy(() => import('@/pages/AddWant'));

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
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Wellness Exchange Routes */}
                  <Route path="/wellness-exchange" element={<WellnessExchange />} />
                  <Route path="/wellness-exchange/marketplace" element={<WellnessMarketplace />} />
                  <Route path="/wellness-exchange/account" element={<WellnessAccount />} />
                  <Route path="/wellness-exchange/wants" element={<WellnessWants />} />
                  <Route path="/wellness-exchange/community" element={<WellnessCommunity />} />
                  
                  {/* Marketplace & Services */}
                  <Route path="/marketplace" element={<UnifiedMarketplace />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/service/:id" element={<SimpleServiceDetail />} />
                  <Route path="/service-detail/:id" element={<ServiceDetail />} />
                  <Route path="/service-detail/:serviceId" element={<ServiceDetailFixed />} />
                  <Route path="/search-services" element={<SearchServices />} />
                  <Route path="/add-want" element={<AddWant />} />
                  <Route path="/two-be-well-shop" element={<TwoBeWellShop />} />
                  <Route path="/wellness-deals" element={<WellnessDeals />} />
                  
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
                  <Route path="/tours-retreats" element={<ToursRetreats />} />
                  
                  {/* Transaction & Payment */}
                  <Route path="/transaction" element={<TransactionPage />} />
                  
                  {/* Catch-all redirect to homepage */}
                  <Route path="*" element={<Index />} />
                </Routes>
              </Suspense>
              
              {/* Global Toast Notifications */}
              <Toaster 
                position="top-right" 
                toastOptions={{
                  duration: 4000,
                  className: 'bg-white border border-gray-200 shadow-lg',
                }} 
              />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;