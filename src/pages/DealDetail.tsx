import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Users, Wifi, Car, Coffee } from 'lucide-react';

const DealDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - this would come from your database/API in a real app
  const deal = {
    id: id,
    title: "The Wellness Retreat Package: 2-Nights with Spa & More for 2 at Cape Point Resort",
    location: "Cape Town",
    price: "R 2,999.00",
    originalPrice: "R 4,999.00",
    discount: "40%",
    rating: 4.2,
    reviews: 127,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
    ],
    description: "Romantic 2-Night Stay for 2 at Cape Point Wellness Resort! Celebrate wellness and relaxation with a luxurious 2-night getaway for two at Cape Point Wellness Resort, located on the pristine shores near Cape Point. With breathtaking ocean views and elegant accommodation, it's the perfect setting for wellness retreats, spa treatments, or rejuvenation escapes.",
    includes: [
      "2-night stay in a Deluxe Ocean View Room",
      "Daily wellness breakfast buffet for two",
      "30% Discount on spa treatments at Serenity Spa",
      "Complimentary yoga session - morning meditation or sunset session",
      "Welcome wellness smoothie on arrival"
    ],
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Car, name: "Free Parking" },
      { icon: Coffee, name: "Restaurant" },
      { icon: Users, name: "Spa & Wellness Center" }
    ],
    address: "1 Ocean Drive, Cape Point, Cape Town, 8001",
    validUntil: "31 March 2025"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/wellness-deals" className="text-cyan-500 hover:text-cyan-600">
            ← Back to Wellness Deals
          </Link>
          <span className="text-cyan-500">Next →</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="mb-4">
              <img 
                src={deal.images[selectedImage]} 
                alt={deal.title}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 mb-6">
              {deal.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`View ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index ? 'border-cyan-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  <button className="border-b-2 border-cyan-500 py-4 text-cyan-600 font-medium">
                    Description
                  </button>
                  <button className="py-4 text-gray-500 hover:text-gray-700">
                    Fine Print
                  </button>
                </nav>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {deal.description}
                </p>

                <h3 className="font-semibold text-lg mb-4">What's the Deal?</h3>
                <ul className="space-y-2 mb-6">
                  {deal.includes.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-semibold text-lg mb-4">How to Redeem your Voucher</h3>
                <p className="text-gray-700 mb-6">
                  Look over the fine print for information on how you can redeem your voucher
                </p>

                <h3 className="font-semibold text-lg mb-4">Facilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {deal.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <amenity.icon className="w-4 h-4" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Badge className="bg-pink-500 text-white mb-2">Save {deal.discount}</Badge>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{deal.title}</h1>
                  <p className="text-gray-600 text-sm mb-4">Option: The Wellness Package for Two</p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{deal.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">• {deal.reviews} reviews</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{deal.price}</span>
                    <span className="text-lg text-gray-500 line-through">{deal.originalPrice}</span>
                  </div>
                </div>

                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 mb-4">
                  BUY NOW
                </Button>

                <div className="bg-yellow-50 p-3 rounded mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Zero Deposit.</span>
                    <span>Only <strong>R999.50</strong> on your next two purchases, interest free.</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{deal.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Valid until {deal.validUntil}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-cyan-500 text-cyan-500 hover:bg-cyan-50">
                  Click for Partner Website
                </Button>

                {/* Map placeholder */}
                <div className="mt-6 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Map View</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;