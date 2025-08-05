import { Card, CardContent } from '@/components/ui/card';
import { Coins, Gift, Plane } from 'lucide-react';

export default function LoyaltyStrip() {
  return (
    <section className="bg-wellness-light py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-wellness-primary mb-4">
          Earn Points. Travel Further.
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Every purchase earns Vernost-powered loyalty points – redeem for retreats, flights or CSR donations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-wellness-secondary">
            <CardContent className="p-6 text-center">
              <Coins className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-wellness-primary mb-2">Earn Points</h3>
              <p className="text-sm text-muted-foreground">
                Get 5% back in points on every wellness purchase
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-wellness-secondary">
            <CardContent className="p-6 text-center">
              <Gift className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-wellness-primary mb-2">Redeem Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Use points for discounts on future bookings
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-wellness-secondary">
            <CardContent className="p-6 text-center">
              <Plane className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-wellness-primary mb-2">Travel More</h3>
              <p className="text-sm text-muted-foreground">
                Redeem for wellness retreats and getaways
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}