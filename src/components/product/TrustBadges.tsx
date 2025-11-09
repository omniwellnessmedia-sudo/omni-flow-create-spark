import { Shield, Truck, Users, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const badges = [
  {
    icon: Truck,
    title: 'Quality Products',
    description: 'Curated wellness items',
    color: 'text-green-600'
  },
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: 'Via CJ Affiliate',
    color: 'text-blue-600'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Supporting local wellness',
    color: 'text-purple-600'
  },
  {
    icon: Heart,
    title: '100% Wellness Focused',
    description: 'Conscious selection',
    color: 'text-rose-600'
  }
];

export const TrustBadges = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <Card key={index} className="border-muted/50 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full bg-muted/50 ${badge.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
