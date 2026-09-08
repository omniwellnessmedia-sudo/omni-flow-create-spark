import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import ReadFailureNotice from '@/components/admin/ReadFailureNotice';

/**
 * Product curation: the one screen that decides what a shopper sees.
 *
 * Nothing from the affiliate feed reaches the public storefront unless it is
 * marked "Show on site" here (src/config/catalogueGate.ts enforces it). This
 * screen is therefore the safety control, not a nice to have, and it is built
 * for one job: letting a person look at a product and decide.
 *
 * WHAT WAS REMOVED AND WHY. This page used to carry an Auto-Curate button
 * calling auto_curate_featured_products(), which featured every active
 * product with a commission above 15% and any image at all. That selects by
 * how much we earn rather than by whether the product belongs on a wellness
 * site, and it is how catalogue photography of a topless model came to sit
 * beside a R5,438 mirror and a laptop battery on a live page. One click
 * would undo the curation gate entirely, so the button is gone. The database
 * function still exists and is simply never called; removing it needs a
 * migration and is noted for the next database change.
 *
 * Images are shown large on purpose. The listings that caused harm were not
 * detectable from their names, only from their pictures.
 *
 * No em dashes in this file.
 */

interface FeedProduct {
  id: string;
  name: string;
  image_url: string | null;
  price_zar: number | null;
  category: string | null;
  brand: string | null;
  is_featured: boolean;
  is_active: boolean;
}

type View = 'review' | 'live';

const ProductCuration = () => {
  const [products, setProducts] = useState<FeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<View>('review');
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from('affiliate_products')
      .select('id, name, image_url, price_zar, category, brand, is_featured, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(300);
    if (error) {
      // A refused read used to fall through to an empty grid and
      // "Showing on site (0)", which reads as "nothing to approve" on the
      // one screen that decides what shoppers see.
      setLoadError(error.message);
      toast({ title: 'Could not load products', description: error.message, variant: 'destructive' });
      setProducts([]);
      setLoading(false);
      return;
    }
    setProducts((data as FeedProduct[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setVisibility = async (product: FeedProduct, show: boolean) => {
    setBusyId(product.id);
    const { error } = await supabase
      .from('affiliate_products')
      .update({ is_featured: show })
      .eq('id', product.id);
    if (error) {
      toast({ title: 'Could not update', description: error.message, variant: 'destructive' });
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_featured: show } : p))
      );
      toast({ title: show ? 'Now visible to shoppers' : 'Removed from the shop' });
    }
    setBusyId(null);
  };

  const liveCount = products.filter((p) => p.is_featured).length;

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products
      .filter((p) => (view === 'live' ? p.is_featured : !p.is_featured))
      .filter((p) =>
        q
          ? `${p.name} ${p.brand ?? ''} ${p.category ?? ''}`.toLowerCase().includes(q)
          : true
      );
  }, [products, view, search]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div>
        <p
          className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-muted-foreground"
          style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
        >
          <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full bg-[#4FAE3F]" />
          Marketplace · Curation
        </p>
        <h1 className="mt-1 font-wwpl-display text-3xl font-medium">What shoppers can see</h1>
        <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
          Products from our affiliate partners do not appear on the website until someone
          here approves them. Look at the picture and the name, and only show what you would
          be happy to see next to our own work.
        </p>
      </div>

      <Card className="mt-5 border-amber-200 bg-amber-50/60">
        <CardContent className="flex items-start gap-3 py-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <p className="text-sm text-amber-900">
            The shop is empty until products are approved here. That is deliberate. The feed
            comes from a third party and has previously included items that do not belong on
            a wellness site, so nothing publishes on its own.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border p-1">
          <button
            onClick={() => setView('review')}
            className={`rounded-full px-4 py-1.5 text-sm ${view === 'review' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}
          >
            To review
          </button>
          <button
            onClick={() => setView('live')}
            className={`rounded-full px-4 py-1.5 text-sm ${view === 'live' ? 'bg-muted font-medium' : 'text-muted-foreground'}`}
          >
            Showing on site ({liveCount})
          </button>
        </div>
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name, brand or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : loadError ? (
        <div className="mt-6">
          <ReadFailureNotice what="the product feed" reason={loadError} onRetry={fetchProducts} />
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          {view === 'live'
            ? 'Nothing is showing on the site yet. Approve products from the To review tab.'
            : 'Nothing left to review here.'}
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <Card key={p.id} className="flex flex-col overflow-hidden">
              {/* Large on purpose: the problem listings were only identifiable
                  from their photograph, never from their name. */}
              <div className="aspect-square w-full bg-muted">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <CardContent className="flex flex-1 flex-col gap-2 py-4">
                <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[p.brand, p.category].filter(Boolean).join(' · ') || 'Uncategorised'}
                </p>
                <p className="text-sm font-semibold">
                  {p.price_zar ? `R${Number(p.price_zar).toFixed(2)}` : 'No price'}
                </p>
                <div className="mt-auto pt-2">
                  {p.is_featured ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={busyId === p.id}
                      onClick={() => setVisibility(p, false)}
                    >
                      <EyeOff className="mr-2 h-4 w-4" /> Remove from shop
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={busyId === p.id}
                      onClick={() => setVisibility(p, true)}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Show on site
                    </Button>
                  )}
                </div>
                {p.is_featured && (
                  <Badge variant="secondary" className="w-fit">Visible to shoppers</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export { ProductCuration };
export default ProductCuration;
