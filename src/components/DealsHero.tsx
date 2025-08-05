import { Button } from '@/components/ui/button';

export default function DealsHero() {
  return (
    <section className="py-20 px-4 text-center relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-wellness-primary/10 to-accent/10"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-wellness-primary">
          Conscious Wellness Deals
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          Bridging wellness, community & savings. Curated experiences that uplift, educate & inspire positive change across South Africa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="px-8 py-4 bg-wellness-primary hover:bg-wellness-primary/90 text-white rounded-full font-semibold text-lg shadow-lg"
            size="lg"
          >
            Browse Today's Deals
          </Button>
          <Button 
            variant="outline"
            className="px-8 py-4 border-wellness-primary text-wellness-primary hover:bg-wellness-primary hover:text-white rounded-full font-semibold text-lg"
            size="lg"
          >
            How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}