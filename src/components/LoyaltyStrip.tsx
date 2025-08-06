import { Card, CardContent } from '@/components/ui/card';
import { Coins, Gift, Plane } from 'lucide-react';

export default function LoyaltyStrip() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Local Wellness Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover wellness experiences in your area and across South Africa
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=200&h=200&fit=crop" 
                alt="Cape Town Wellness" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Cape Town Wellness</h3>
          </div>
          
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop" 
                alt="Johannesburg Wellness" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Johannesburg Wellness</h3>
          </div>
          
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop" 
                alt="Pretoria Wellness" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Pretoria Wellness</h3>
          </div>
          
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop" 
                alt="KwaZulu-Natal Wellness" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">KwaZulu-Natal Wellness</h3>
          </div>
          
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=200&h=200&fit=crop" 
                alt="Western Cape Wellness" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Western Cape Wellness</h3>
          </div>
        </div>
      </div>
    </section>
  );
}