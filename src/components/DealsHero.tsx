import { Button } from '@/components/ui/button';

export default function DealsHero() {
  return (
    <section className="py-20 px-4 text-center">
      <h1 className="text-5xl font-bold text-wellness-primary mb-4">
        Conscious Wellness Deals
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Spas, retreats, classes & more – curated for impact and savings.
      </p>
      <Button 
        className="mt-6 px-8 py-3 bg-accent text-accent-foreground rounded-full font-semibold hover:bg-accent/90"
        size="lg"
      >
        Browse Today's Deals
      </Button>
    </section>
  );
}