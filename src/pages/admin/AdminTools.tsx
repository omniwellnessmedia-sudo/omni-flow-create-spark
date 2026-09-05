import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSecureUserRole } from '@/hooks/useSecureUserRole';
import { UserPlus, RefreshCw, CheckCircle, AlertCircle, Users, Info, Database, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import sandyMitchellData from '@/data/sandyMitchellProfile';

/**
 * Admin tools: granting access, and seeding a provider.
 *
 * WHAT WAS REMOVED, AND WHY IT MATTERED
 *
 * 1. AUTO-CURATION. This page carried a "Run Auto-Curation" button calling
 *    auto_curate_featured_products(), which sets is_featured on every active
 *    product with commission above 15 per cent and any image at all.
 *    is_featured is exactly the flag src/config/catalogueGate.ts uses to
 *    decide what shoppers see, so one click published unvetted stock to the
 *    live storefront, ranked by what we earn rather than by whether anyone
 *    had looked at the picture. That is how catalogue photography of a
 *    topless model came to sit beside a mirror and a laptop battery on a
 *    public page in the 28 August audit. The same button was removed from
 *    Product Curation at the time and this copy was missed. Featuring is now
 *    only ever done by a person in /admin/products, one product at a time.
 *    The migration that revokes the function accompanies this change.
 *
 * 2. "ADD TEAM ADMINS". A one click button whose label said Chad, Zenith and
 *    Feroza but whose code granted admin to two hardcoded addresses that are
 *    neither: a transposed spelling of the company address, and an external
 *    yoga provider. A button that grants standing access to addresses the
 *    label does not name is not a shortcut, so it is gone. Access is granted
 *    below, one person and one role at a time, by someone who types the
 *    address and picks the role.
 *
 * WHO CAN GRANT. Writing user_roles requires super_admin: the RLS policy is
 * "Super admins can manage user roles". A plain admin previously got a
 * generic "Failed to add admin user" here, which is indistinguishable from a
 * typo in the email. This screen now says which of the two happened.
 *
 * No em dashes in this file.
 */

/** The roles that actually gate anything in this application. */
const ASSIGNABLE_ROLES = [
  {
    role: 'catalogue_manager',
    label: 'Catalogue manager',
    detail: 'The catalogue, product approvals and the events desk. No accounting, leads or role changes.',
  },
  {
    role: 'accountant',
    label: 'Accountant',
    detail: 'Read only access to the financial screens.',
  },
  {
    role: 'admin',
    label: 'Admin',
    detail: 'The whole dashboard except granting roles.',
  },
] as const;

interface RoleRow {
  id: string;
  user_id: string;
  role: string;
  email?: string | null;
}

const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('catalogue_manager');
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [rowsProblem, setRowsProblem] = useState<string | null>(null);
  const [rowsLoading, setRowsLoading] = useState(true);
  const { toast } = useToast();
  const { roles: myRoles, loading: roleLoading } = useSecureUserRole();
  const isSuperAdmin = (myRoles as string[]).includes('super_admin');

  const loadRoles = async () => {
    setRowsLoading(true);
    setRowsProblem(null);
    const db = supabase as any;
    const { data, error } = await db
      .from('user_roles')
      .select('id, user_id, role')
      .order('role');

    if (error) {
      setRowsProblem(error.message);
      setRows([]);
      setRowsLoading(false);
      return;
    }

    // Attach emails where the profile is readable. A missing profile is not
    // an error worth failing the list over; the user id still identifies the
    // row for anyone who needs to chase it.
    const ids = Array.from(new Set((data ?? []).map((r: RoleRow) => r.user_id)));
    let emails: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: profiles } = await db.from('profiles').select('id, email').in('id', ids);
      emails = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.email]));
    }
    setRows((data ?? []).map((r: RoleRow) => ({ ...r, email: emails[r.user_id] ?? null })));
    setRowsLoading(false);
  };

  useEffect(() => {
    loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grantRole = async () => {
    const address = email.trim().toLowerCase();
    if (!address) {
      toast({ title: 'Enter the person’s email address', variant: 'destructive' });
      return;
    }
    setLoading(true);

    // The whole operation happens server side. Resolving the address here
    // could never work: public.profiles has one SELECT policy for signed in
    // users, "Users can view their own profile" USING (auth.uid() = id), so
    // a client side lookup finds nobody but yourself and returns no error,
    // which this screen used to report as "they need to sign up first".
    const { data, error } = await (supabase as any).rpc('grant_role_by_email', {
      p_email: address,
      p_role: role,
    });
    setLoading(false);

    if (error) {
      toast({ title: 'Could not grant the role', description: error.message, variant: 'destructive' });
      return;
    }

    const status = (data as { status?: string } | null)?.status;
    if (status === 'granted') {
      toast({ title: 'Access granted', description: `${address} is now a ${role.replace('_', ' ')}.` });
      setEmail('');
      loadRoles();
      return;
    }
    if (status === 'already_had_it') {
      toast({ title: 'They already have that role' });
      setEmail('');
      loadRoles();
      return;
    }
    if (status === 'no_account') {
      toast({
        title: 'No account with that address',
        description: 'They need to sign up at /auth first, with this exact address.',
        variant: 'destructive',
      });
      return;
    }
    if (status === 'forbidden') {
      toast({
        title: 'Only a super admin can grant roles',
        description: 'Ask Tumelo to make the change, or to give this account super admin.',
        variant: 'destructive',
      });
      return;
    }
    toast({ title: 'Could not grant that role', description: `The database returned: ${status}`, variant: 'destructive' });
  };

  const revokeRole = async (row: RoleRow) => {
    const who = row.email ?? `account ${row.user_id.slice(0, 8)}`;
    // Removing access is destructive and silent otherwise: the row simply
    // vanishes and the person loses the screen next time they load it.
    if (!window.confirm(`Remove the ${row.role.replace('_', ' ')} role from ${who}?`)) return;

    const { data, error } = await (supabase as any).rpc('revoke_role', {
      p_user_id: row.user_id,
      p_role: row.role,
    });
    if (error) {
      toast({ title: 'Could not remove the role', description: error.message, variant: 'destructive' });
      return;
    }
    const status = (data as { status?: string } | null)?.status;
    if (status === 'revoked') {
      toast({ title: 'Access removed' });
      loadRoles();
      return;
    }
    if (status === 'last_super_admin') {
      toast({
        title: 'That is the last super admin',
        description: 'Removing it would leave nobody able to grant or remove roles. Give someone else super admin first.',
        variant: 'destructive',
      });
      return;
    }
    if (status === 'forbidden') {
      toast({ title: 'Only a super admin can remove roles', variant: 'destructive' });
      return;
    }
    toast({ title: 'Nothing was removed', description: `The database returned: ${status}`, variant: 'destructive' });
  };

  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const seedSandyProvider = async () => {
    // This writes a provider profile under YOUR account and publishes six
    // priced listings. Both were previously one unconfirmed click away.
    if (!window.confirm(
      'This creates or OVERWRITES the provider profile on your own account ' +
      '(business name, description, contact details, verified flag and wellcoin ' +
      'balance) and adds six of Sandy Mitchell\'s services as drafts. Continue?'
    )) return;

    setLoading(true);
    setSeedResult(null);
    try {
      const { profile, services: sandyServices } = sandyMitchellData;

      // Use the current admin's auth ID — RLS requires id = auth.uid() for inserts
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to seed provider data');

      const providerId = user.id;

      const { data: existing } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('id', providerId)
        .maybeSingle();

      if (existing) {
        const { error: updateError } = await supabase
          .from('provider_profiles')
          .update({
            business_name: profile.business_name,
            description: profile.description,
            specialties: profile.specialties,
            location: profile.location,
            phone: profile.phone,
            website: profile.website,
            experience_years: profile.years_experience,
            certifications: profile.certifications,
            profile_image_url: profile.profile_image_url,
            verified: true,
            wellcoin_balance: 2840,
          })
          .eq('id', providerId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('provider_profiles')
          .insert({
            id: providerId,
            business_name: profile.business_name,
            description: profile.description,
            specialties: profile.specialties,
            location: profile.location,
            phone: profile.phone,
            website: profile.website,
            experience_years: profile.years_experience,
            certifications: profile.certifications,
            profile_image_url: profile.profile_image_url,
            verified: true,
            wellcoin_balance: 2840,
          });

        if (insertError) throw insertError;
      }

      let servicesCreated = 0;
      const failed: string[] = [];
      for (const svc of sandyServices) {
        const { data: existingSvc } = await supabase
          .from('services')
          .select('id')
          .eq('provider_id', providerId)
          .eq('title', svc.title)
          .maybeSingle();

        if (existingSvc) {
          servicesCreated++;
          continue;
        }

        const { error: svcError } = await supabase
          .from('services')
          .insert({
            provider_id: providerId,
            title: svc.title,
            description: svc.description,
            category: svc.category,
            price_zar: svc.price_zar,
            price_wellcoins: svc.price_wellcoins,
            duration_minutes: svc.duration_minutes,
            location: svc.location || profile.location,
            is_online: svc.is_online,
            images: svc.images,
            // Seeded listings arrive as drafts. Publishing a priced service
            // to the marketplace is a decision, not a side effect of seeding.
            active: false,
          });

        if (!svcError) servicesCreated++;
        else {
          failed.push(`${svc.title}: ${svcError.message}`);
          console.error('Service insert error:', svc.title, svcError);
        }
      }

      setSeedResult({
        success: failed.length === 0,
        message: failed.length === 0
          ? `Provider "${profile.business_name}" seeded with ${servicesCreated} services, saved as drafts under your account. Publish them in the catalogue when you are ready.`
          : `${servicesCreated} services saved, ${failed.length} failed: ${failed.join('; ')}`,
      });

      toast({
        title: 'Provider Seeded',
        description: `Sandy's profile and ${servicesCreated} services are now live in Supabase`,
      });
    } catch (error) {
      console.error('Seed error:', error);
      setSeedResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      toast({
        title: 'Seed Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Tools</h2>
        <p className="text-muted-foreground">Who can get into what, and provider seeding</p>
      </div>

      {/* Said before anyone fills in the form, because the database will
          refuse the write and a generic failure reads like a typo. */}
      {!roleLoading && !isSuperAdmin && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              You can see who has access, but not change it
            </p>
            <p className="mt-1 text-sm text-amber-900">
              Granting and removing roles requires the super admin role. Ask Tumelo
              to make the change, or to give this account super admin.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Who can get in
          </CardTitle>
          <CardDescription>
            Everyone signs up at /auth first with the address you type here. Roles
            take effect the next time they load the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="grant-email">Email address</Label>
              <Input
                id="grant-email"
                type="email"
                placeholder="person@example.com"
                value={email}
                disabled={!isSuperAdmin}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && isSuperAdmin && grantRole()}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grant-role">Role</Label>
              <select
                id="grant-role"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={role}
                disabled={!isSuperAdmin}
                onChange={(e) => setRole(e.target.value)}
              >
                {ASSIGNABLE_ROLES.map((r) => (
                  <option key={r.role} value={r.role}>{r.label}</option>
                ))}
              </select>
            </div>
            <Button onClick={grantRole} disabled={loading || !isSuperAdmin}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Grant
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {ASSIGNABLE_ROLES.find((r) => r.role === role)?.detail}
          </p>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Current access</h4>
              <Button variant="ghost" size="sm" onClick={loadRoles} disabled={rowsLoading}>
                <RefreshCw className={`h-3.5 w-3.5 ${rowsLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {rowsProblem ? (
              <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                Could not read who has access: {rowsProblem}
              </p>
            ) : rowsLoading ? (
              <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
            ) : rows.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Nobody has a role yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {rows.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {r.email ?? <span className="text-muted-foreground">account {r.user_id.slice(0, 8)}</span>}
                      </p>
                      <Badge variant="outline" className="mt-1 text-[11px]">{r.role.replace('_', ' ')}</Badge>
                    </div>
                    {isSuperAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => revokeRole(r)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="flex items-center gap-1.5 text-xs font-medium">
              <Info className="h-3.5 w-3.5" />
              Nothing is featured on the storefront from this page
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Products reach shoppers only when a person approves them in Product
              Curation, one at a time, having looked at the picture.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Provider Onboarding Seed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Provider Onboarding
          </CardTitle>
          <CardDescription>
            Seed provider profiles and services into the database from static data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-1">Sandy Mitchell, Dru Yoga Cape Town</h4>
            <p className="text-xs text-muted-foreground">
              6 services, certifications, profile image, contact details. This
              creates the profile under your own account, because the row is keyed
              on the signed in user.
            </p>
          </div>
          <Button onClick={seedSandyProvider} disabled={loading}>
            {loading ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Seeding...</>
            ) : (
              <><Database className="w-4 h-4 mr-2" />Seed Sandy's Profile</>
            )}
          </Button>

          {seedResult && (
            <div className={`p-4 rounded-lg ${seedResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="flex items-center gap-2">
                {seedResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">{seedResult.message}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTools;
