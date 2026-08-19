import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecureUserRole } from '@/hooks/useSecureUserRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Store, Package, Eye, EyeOff, Pencil, ArrowLeft } from 'lucide-react';

/**
 * Local catalogue: onboard local businesses and their products.
 *
 * WHY THIS EXISTS SEPARATELY FROM THE PROVIDER MARKETPLACE
 * provider_profiles requires an auth account per provider and its RLS only lets
 * a provider insert their own row, so staff cannot list a business that will
 * never hold a login. local_businesses carries no auth dependency.
 *
 * TWO GATES, BOTH ENFORCED IN THE DATABASE, NOT HERE
 *   1. Consent. Publishing is impossible unless listing_consent is true. That is
 *      a CHECK constraint, so this screen cannot bypass it even by accident.
 *   2. Review. A catalogue manager creates and edits drafts. Only an admin can
 *      publish. The publish control below is hidden for non-admins, but the RLS
 *      policy is what actually stops it, so a hidden button is not the security.
 *
 * Nothing here is visible to the public until an admin publishes it.
 */

const CATEGORIES = [
  'Food and drink',
  'Skincare and body',
  'Wellness services',
  'Craft and homeware',
  'Clothing',
  'Books and media',
  'Other',
] as const;

const PRODUCT_TYPES = ['product', 'service', 'package', 'retreat', 'digital'] as const;

type Status = 'draft' | 'published' | 'archived';

interface Business {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  location: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  listing_consent: boolean;
  listing_consent_at: string | null;
  listing_consent_note: string | null;
  status: Status;
  created_at: string;
}

interface Product {
  id: string;
  business_id: string | null;
  name: string;
  description: string | null;
  category: string;
  provider: string;
  type: string;
  price_zar: number;
  image_url: string | null;
  status: Status;
}

const emptyBusiness = {
  name: '', description: '', category: '', location: '',
  contact_name: '', contact_email: '', contact_phone: '', website: '',
  listing_consent: false, listing_consent_note: '',
};

const emptyProduct = { name: '', description: '', category: '', type: 'product', price_zar: '', image_url: '' };

const statusBadge = (s: Status) => {
  if (s === 'published') return <Badge className="bg-emerald-600">Published</Badge>;
  if (s === 'archived') return <Badge variant="outline">Archived</Badge>;
  return <Badge variant="secondary">Draft</Badge>;
};

const LocalCatalogue = () => {
  const { toast } = useToast();
  const { isAdmin, userId } = useSecureUserRole();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Business | null>(null);

  const [bizOpen, setBizOpen] = useState(false);
  const [bizEditing, setBizEditing] = useState<Business | null>(null);
  const [bizForm, setBizForm] = useState({ ...emptyBusiness });

  const [prodOpen, setProdOpen] = useState(false);
  const [prodForm, setProdForm] = useState({ ...emptyProduct });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Cast: src/integrations/supabase/types.ts is generated and predates this
      // migration. Regenerate the types and these casts can go.
      const db = supabase as unknown as {
        from: (t: string) => any;
      };
      const [{ data: b, error: be }, { data: p, error: pe }] = await Promise.all([
        db.from('local_businesses').select('*').order('created_at', { ascending: false }),
        db.from('products').select('*').not('business_id', 'is', null),
      ]);
      if (be) throw be;
      if (pe) throw pe;
      setBusinesses((b ?? []) as Business[]);
      setProducts((p ?? []) as Product[]);
    } catch (err) {
      toast({
        title: 'Could not load the catalogue',
        description: 'Something went wrong on our side. Please refresh, and if it keeps happening say so.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const productsFor = useMemo(
    () => (id: string) => products.filter((p) => p.business_id === id),
    [products]
  );

  const openNewBusiness = () => {
    setBizEditing(null);
    setBizForm({ ...emptyBusiness });
    setBizOpen(true);
  };

  const openEditBusiness = (b: Business) => {
    setBizEditing(b);
    setBizForm({
      name: b.name, description: b.description ?? '', category: b.category ?? '',
      location: b.location ?? '', contact_name: b.contact_name ?? '',
      contact_email: b.contact_email ?? '', contact_phone: b.contact_phone ?? '',
      website: b.website ?? '', listing_consent: b.listing_consent,
      listing_consent_note: b.listing_consent_note ?? '',
    });
    setBizOpen(true);
  };

  const saveBusiness = async () => {
    if (!bizForm.name.trim()) {
      toast({ title: 'Business name is required', variant: 'destructive' });
      return;
    }
    if (bizForm.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bizForm.contact_email.trim())) {
      toast({ title: 'Check the contact email', description: 'That address does not look complete.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const db = supabase as unknown as { from: (t: string) => any };
      const consentChanged = bizForm.listing_consent && !bizEditing?.listing_consent;
      const payload: Record<string, unknown> = {
        name: bizForm.name.trim(),
        description: bizForm.description.trim() || null,
        category: bizForm.category || null,
        location: bizForm.location.trim() || null,
        contact_name: bizForm.contact_name.trim() || null,
        contact_email: bizForm.contact_email.trim() || null,
        contact_phone: bizForm.contact_phone.trim() || null,
        website: bizForm.website.trim() || null,
        listing_consent: bizForm.listing_consent,
        listing_consent_note: bizForm.listing_consent_note.trim() || null,
      };
      // Stamp who recorded consent and when, at the moment it is first recorded.
      if (consentChanged) {
        payload.listing_consent_at = new Date().toISOString();
        payload.listing_consent_recorded_by = userId;
      }
      if (!bizForm.listing_consent) {
        payload.listing_consent_at = null;
        payload.listing_consent_recorded_by = null;
      }

      const { error } = bizEditing
        ? await db.from('local_businesses').update(payload).eq('id', bizEditing.id)
        : await db.from('local_businesses').insert({ ...payload, status: 'draft' });
      if (error) throw error;

      toast({ title: bizEditing ? 'Business updated' : 'Business saved as a draft' });
      setBizOpen(false);
      await load();
    } catch {
      toast({
        title: 'Could not save',
        description: 'Something went wrong on our side. Your details are still here, please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const saveProduct = async () => {
    if (!selected) return;
    if (!prodForm.name.trim() || !prodForm.price_zar) {
      toast({ title: 'Name and price are required', variant: 'destructive' });
      return;
    }
    const price = Number(prodForm.price_zar);
    if (!Number.isFinite(price) || price < 0) {
      toast({ title: 'Check the price', description: 'Please enter a number in rands.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const db = supabase as unknown as { from: (t: string) => any };
      const { error } = await db.from('products').insert({
        business_id: selected.id,
        name: prodForm.name.trim(),
        description: prodForm.description.trim() || null,
        category: prodForm.category || selected.category || 'Other',
        provider: selected.name,
        type: prodForm.type,
        price_zar: price,
        image_url: prodForm.image_url.trim() || null,
        status: 'draft',
      });
      if (error) throw error;
      toast({ title: 'Product saved as a draft' });
      setProdForm({ ...emptyProduct });
      setProdOpen(false);
      await load();
    } catch {
      toast({
        title: 'Could not save the product',
        description: 'Something went wrong on our side. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  /** Admin only. The RLS policy is what enforces this, not the hidden button. */
  const setStatus = async (table: 'local_businesses' | 'products', id: string, status: Status) => {
    try {
      const db = supabase as unknown as { from: (t: string) => any };
      const payload: Record<string, unknown> = { status };
      if (table === 'local_businesses' && status === 'published') {
        payload.published_at = new Date().toISOString();
        payload.published_by = userId;
      }
      const { error } = await db.from(table).update(payload).eq('id', id);
      if (error) throw error;
      toast({ title: status === 'published' ? 'Published' : 'Moved back to draft' });
      await load();
    } catch {
      toast({
        title: 'Could not change the status',
        description: 'Publishing requires recorded consent and an admin account.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ------------------------------------------------ one business, with products */
  if (selected) {
    const list = productsFor(selected.id);
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" onClick={() => setSelected(null)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> All businesses
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" /> {selected.name}
                </CardTitle>
                <CardDescription>
                  {[selected.category, selected.location].filter(Boolean).join(' · ') || 'No category or location yet'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(selected.status)}
                <Button variant="outline" size="sm" onClick={() => openEditBusiness(selected)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selected.listing_consent && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                <strong>Not publishable yet.</strong> This business has not been recorded as having given
                permission to be listed. Tick the consent box on the business once you have that permission.
              </div>
            )}
            {isAdmin && selected.listing_consent && (
              <div className="flex gap-2">
                {selected.status !== 'published' ? (
                  <Button size="sm" onClick={() => setStatus('local_businesses', selected.id, 'published')}>
                    <Eye className="mr-2 h-4 w-4" /> Publish business
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setStatus('local_businesses', selected.id, 'draft')}>
                    <EyeOff className="mr-2 h-4 w-4" /> Unpublish
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products ({list.length})</h2>
          <Button size="sm" onClick={() => setProdOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add product
          </Button>
        </div>

        <div className="mt-3 space-y-3">
          {list.length === 0 && (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No products yet. Add the first one.
            </p>
          )}
          {list.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    R{Number(p.price_zar).toFixed(2)} · {p.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(p.status)}
                  {isAdmin && selected.status === 'published' && (
                    p.status !== 'published' ? (
                      <Button size="sm" variant="outline" onClick={() => setStatus('products', p.id, 'published')}>
                        Publish
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setStatus('products', p.id, 'draft')}>
                        Unpublish
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={prodOpen} onOpenChange={setProdOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a product</DialogTitle>
              <DialogDescription>Saved as a draft. An admin publishes it.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="p-name">Product name *</Label>
                <Input id="p-name" className="mt-1.5" value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="p-desc">Description</Label>
                <Textarea id="p-desc" rows={3} className="mt-1.5" value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="p-price">Price in rands *</Label>
                  <Input id="p-price" type="number" min="0" step="0.01" className="mt-1.5"
                    value={prodForm.price_zar}
                    onChange={(e) => setProdForm({ ...prodForm, price_zar: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="p-type">Type</Label>
                  <Select value={prodForm.type} onValueChange={(v) => setProdForm({ ...prodForm, type: v })}>
                    <SelectTrigger id="p-type" className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="p-image">Image URL</Label>
                <Input id="p-image" className="mt-1.5" placeholder="https://"
                  value={prodForm.image_url}
                  onChange={(e) => setProdForm({ ...prodForm, image_url: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProdOpen(false)}>Cancel</Button>
              <Button onClick={saveProduct} disabled={saving}>
                {saving ? 'Saving...' : 'Save as draft'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BusinessDialog
          open={bizOpen} onOpenChange={setBizOpen} form={bizForm} setForm={setBizForm}
          onSave={saveBusiness} saving={saving} editing={!!bizEditing}
        />
      </div>
    );
  }

  /* ------------------------------------------------------------- business list */
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Local catalogue</h1>
          <p className="text-sm text-muted-foreground">
            Onboard local businesses and their products. Everything starts as a draft.
          </p>
        </div>
        <Button onClick={openNewBusiness}>
          <Plus className="mr-2 h-4 w-4" /> Add business
        </Button>
      </div>

      {!isAdmin && (
        <p className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
          You can add and edit businesses and products. Publishing to the public marketplace is done by an
          admin, after checking that permission to be listed has been recorded.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {businesses.length === 0 && (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No businesses yet. Add the first one.
          </p>
        )}
        {businesses.map((b) => (
          <Card key={b.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setSelected(b)}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-medium">
                  <Store className="h-4 w-4 flex-none text-muted-foreground" />
                  {b.name}
                </p>
                <p className="mt-0.5 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" /> {productsFor(b.id).length}
                  </span>
                  {b.location && <span>{b.location}</span>}
                  {!b.listing_consent && <span className="text-amber-700">Consent not recorded</span>}
                </p>
              </div>
              {statusBadge(b.status)}
            </CardContent>
          </Card>
        ))}
      </div>

      <BusinessDialog
        open={bizOpen} onOpenChange={setBizOpen} form={bizForm} setForm={setBizForm}
        onSave={saveBusiness} saving={saving} editing={!!bizEditing}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ sub-form */

const BusinessDialog = ({
  open, onOpenChange, form, setForm, onSave, saving, editing,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  form: typeof emptyBusiness;
  setForm: (f: typeof emptyBusiness) => void;
  onSave: () => void;
  saving: boolean;
  editing: boolean;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editing ? 'Edit business' : 'Add a business'}</DialogTitle>
        <DialogDescription>
          Saved as a draft and not visible to anyone outside this screen until an admin publishes it.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="b-name">Business name *</Label>
          <Input id="b-name" className="mt-1.5" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="b-desc">What they do</Label>
          <Textarea id="b-desc" rows={3} className="mt-1.5" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="b-cat">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger id="b-cat" className="mt-1.5"><SelectValue placeholder="Choose one" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="b-loc">Area</Label>
            <Input id="b-loc" className="mt-1.5" placeholder="Muizenberg" value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="b-cname">Contact person</Label>
            <Input id="b-cname" className="mt-1.5" value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="b-phone">Phone</Label>
            <Input id="b-phone" className="mt-1.5" value={form.contact_phone}
              onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="b-email">Email</Label>
            <Input id="b-email" type="email" className="mt-1.5" value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="b-web">Website</Label>
            <Input id="b-web" className="mt-1.5" placeholder="https://" value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
        </div>

        {/* The consent gate. Publishing is impossible without this, and that is
            enforced by a database constraint rather than by this checkbox. */}
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <label className="flex items-start gap-2.5 text-sm text-amber-950">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4"
              checked={form.listing_consent}
              onChange={(e) => setForm({ ...form, listing_consent: e.target.checked })}
            />
            <span>
              <strong>This business has given permission to be listed.</strong> Tick this only once they
              have actually agreed. A conversation about listing them is not permission. Until this is
              ticked the listing cannot be published.
            </span>
          </label>
          {form.listing_consent && (
            <div className="mt-3">
              <Label htmlFor="b-consent-note" className="text-amber-950">How was permission given?</Label>
              <Input id="b-consent-note" className="mt-1.5 bg-white"
                placeholder="WhatsApp from the owner, 19 Aug"
                value={form.listing_consent_note}
                onChange={(e) => setForm({ ...form, listing_consent_note: e.target.value })} />
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : editing ? 'Save changes' : 'Save as draft'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default LocalCatalogue;
