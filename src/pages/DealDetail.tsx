import { useParams, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Users, Wifi, Car, Coffee, ArrowLeft, ExternalLink } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import Footer from '@/components/Footer';
import type { WellnessDeal } from '@/types/marketplace';

// Format price with proper decimal places
const formatPrice = (price: number): string => {
  return `R ${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const DealDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Get deal from navigation state or use fallback
  const dealFromState = location.state?.deal as WellnessDeal | undefined;
  
  // Fallback mock deal if no state is passed
  const fallbackDeal = {
    id: id,
    title: "The Wellness Retreat Package: 2-Nights with Spa & More for 2 at Cape Point Resort",
    description: "Romantic 2-Night Stay for 2 at Cape Point Wellness Resort! Celebrate wellness and relaxation with a luxurious 2-night getaway for two at Cape Point Wellness Resort, located on the pristine shores near Cape Point. With breathtaking ocean views and elegant accommodation, it's the perfect setting for wellness retreats, spa treatments, or rejuvenation escapes.",
    location: "Cape Town, South Africa",
    deal_price_zar: 2999,
    original_price_zar: 4999,
    discount_percentage: 40,
    rating: 4.2,
    review_count: 127,
    images: [
      IMAGES.wellness.retreat,
      IMAGES.wellness.retreat3,
      IMAGES.tours.coastal,
      IMAGES.tours.mountain
    ],
    provider_name: "Cape Point Wellness Resort",
    category: "Retreats",
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    terms_conditions: [
      "Valid for 6 months from purchase date",
      "2-night stay in a Deluxe Ocean View Room",
      "Daily wellness breakfast buffet for two",
      "30% Discount on spa treatments at Serenity Spa",
      "Complimentary yoga session - morning meditation or sunset session"
    ]
  };

  const deal = dealFromState || fallbackDeal;
  
  const images = dealFromState?.images?.length ? dealFromState.images : fallbackDeal.images;
  const includes = dealFromState?.terms_conditions?.length ? dealFromState.terms_conditions : fallbackDeal.terms_conditions;
  
  const amenities = [
    { icon: Wifi, name: "Free Wi-Fi" },
    { icon: Car, name: "Free Parking" },
    { icon: Coffee, name: "Restaurant" },
    { icon: Users, name: "Spa & Wellness Center" }
  ];

  const validUntilDate = new Date(deal.valid_until || fallbackDeal.valid_until);
  const validUntilFormatted = validUntilDate.toLocaleDateString('en-ZA', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation />
      
      {/* Navigation */}
      <div className="bg-white border-b px-4 py-3 mt-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/wellness-deals" className="text-purple-600 hover:text-purple-700 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Wellness Deals
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="mb-4">
              <img 
                src={images[selectedImage]} 
                alt={deal.title}
                className="w-full h-80 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = IMAGES.wellness.retreat;
                }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 mb-6">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`View ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index ? 'border-purple-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.currentTarget.src = IMAGES.wellness.retreat;
                  }}
                />
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  <button className="border-b-2 border-purple-500 py-4 text-purple-600 font-medium">
                    Description
                  </button>
                  <button className="py-4 text-gray-500 hover:text-gray-700">
                    Fine Print
                  </button>
                </nav>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {deal.description || fallbackDeal.description}
                </p>

                <h3 className="font-semibold text-lg mb-4">What's Included</h3>
                <ul className="space-y-2 mb-6">
                  {includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-semibold text-lg mb-4">Facilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <amenity.icon className="w-4 h-4 text-purple-500" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-2">
                    Save {deal.discount_percentage || fallbackDeal.discount_percentage}%
                  </Badge>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{deal.title}</h1>
                  <p className="text-purple-600 text-sm font-medium mb-4">
                    {deal.provider_name || fallbackDeal.provider_name}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{deal.rating || fallbackDeal.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">• {deal.review_count || fallbackDeal.review_count} reviews</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-purple-600">
                      {formatPrice(deal.deal_price_zar || fallbackDeal.deal_price_zar)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(deal.original_price_zar || fallbackDeal.original_price_zar)}
                    </span>
                  </div>
                  <p className="text-green-600 font-medium">
                    You save {formatPrice((deal.original_price_zar || fallbackDeal.original_price_zar) - (deal.deal_price_zar || fallbackDeal.deal_price_zar))}
                  </p>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 mb-4">
                  BUY NOW
                </Button>

                <div className="text-sm text-gray-600 mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span>{deal.location || fallbackDeal.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>Valid until {validUntilFormatted}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-50">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Partner Website
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DealDetail;