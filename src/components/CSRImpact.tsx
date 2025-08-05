import { Card, CardContent } from '@/components/ui/card';
import { TreePine, Heart, Award } from 'lucide-react';

export default function CSRImpact() {
  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Deal, Their Growth
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          1% of every deal funds Dr. Phil-afel Foundation projects – Section 18A tax certificate included.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <TreePine className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">247</div>
              <p className="text-sm text-gray-600">Trees Planted</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">89</div>
              <p className="text-sm text-gray-600">Families Supported</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">R47k</div>
              <p className="text-sm text-gray-600">Community Investment</p>
            </CardContent>
          </Card>
        </div>
        
        <p className="text-sm text-gray-600 mt-6">
          🌱 Every wellness deal creates positive impact in South African communities
        </p>
      </div>
    </section>
  );
}