import DealsHero from '@/components/DealsHero';
import DealGrid from '@/components/DealGrid';
import LoyaltyStrip from '@/components/LoyaltyStrip';
import CSRImpact from '@/components/CSRImpact';

export default function WellnessDeals() {
  return (
    <div className="min-h-screen bg-white">
      <DealsHero />
      <DealGrid />
      <LoyaltyStrip />
      <CSRImpact />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Omni Wellness</h3>
              <p className="text-gray-300 text-sm">
                Bridging wellness, outreach & media. Empowering South Africa's journey to health & consciousness.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/wellness-deals" className="hover:text-white">Wellness Deals</a></li>
                <li><a href="/services" className="hover:text-white">Services</a></li>
                <li><a href="/about" className="hover:text-white">About</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Spa & Beauty</a></li>
                <li><a href="#" className="hover:text-white">Fitness Classes</a></li>
                <li><a href="#" className="hover:text-white">Wellness Retreats</a></li>
                <li><a href="#" className="hover:text-white">Mindfulness</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Partner With Us</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-300">
            <p>&copy; 2024 Omni Wellness Media. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}