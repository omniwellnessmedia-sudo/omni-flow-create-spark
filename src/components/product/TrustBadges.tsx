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
    title: 'Secure Payment',
    description: 'Trusted checkout',
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <Card key={index} className="glass-card hover-lift border-border/20 transition-all duration-300">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ${badge.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-foreground">{badge.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{badge.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
