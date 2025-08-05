import { Card, CardContent } from '@/components/ui/card';
import { TreePine, Heart, Award } from 'lucide-react';

export default function CSRImpact() {
  return (
    <section className="bg-accent-light py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-accent mb-4">
          Your Deal, Their Growth
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          1% of every deal funds Dr. Phil-afel Foundation projects – Section 18A tax certificate included.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-accent-secondary">
            <CardContent className="p-6 text-center">
              <TreePine className="w-12 h-12 text-wellness-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-accent mb-2">247</div>
              <p className="text-sm text-muted-foreground">Trees Planted</p>
            </CardContent>
          </Card>
          
          <Card className="border-accent-secondary">
            <CardContent className="p-6 text-center">
              <Heart className="w-12 h-12 text-wellness-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-accent mb-2">89</div>
              <p className="text-sm text-muted-foreground">Families Supported</p>
            </CardContent>
          </Card>
          
          <Card className="border-accent-secondary">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-wellness-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-accent mb-2">R47k</div>
              <p className="text-sm text-muted-foreground">Community Investment</p>
            </CardContent>
          </Card>
        </div>
        
        <p className="text-sm text-muted-foreground mt-6">
          🌱 Every wellness deal creates positive impact in South African communities
        </p>
      </div>
    </section>
  );
}