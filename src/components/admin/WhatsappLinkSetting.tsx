import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecureUserRole } from '@/hooks/useSecureUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Save, AlertTriangle } from 'lucide-react';
import { classifyWhatsapp } from '@/lib/whatsapp';
import ReadFailureNotice from '@/components/admin/ReadFailureNotice';

/**
 * Where every WhatsApp button on the site points.
 *
 * This existed only in code. The link was a WhatsApp Channel, which is
 * broadcast only, while the buttons said "WhatsApp us", so people who
 * tried to message us could not, and we never saw that they had tried.
 * Changing it meant a developer and a deploy.
 *
 * The screen shows what the buttons will actually say, because that is
 * derived from the link rather than written by hand. Paste a wa.me number
 * and the same buttons start saying "WhatsApp us" and start carrying a
 * prefilled message.
 *
 * No em dashes in this file.
 */

const SETTING_KEY = 'whatsapp_url';

const WhatsappLinkSetting = () => {
  const { roles, loading: rolesLoading } = useSecureUserRole();
  const { toast } = useToast();
  const isSuperAdmin = roles.includes('super_admin');

  const [stored, setStored] = useState<string>('');
  const [draft, setDraft] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoadError(null);
    const { data, error } = await (supabase
      .from('site_settings' as any)
      .select('value')
      .eq('key', SETTING_KEY)
      .maybeSingle() as any);

    if (error) {
      setLoadError(error.message);
    } else if (data) {
      const value = (data as { value?: string }).value ?? '';
      setStored(value);
      setDraft(value);
    } else {
      // The row is seeded by migration. Absent means the migration has not
      // run, which is worth saying plainly rather than showing a blank box
      // somebody then saves over.
      setLoadError('No whatsapp_url row exists yet. Run the site_settings migration.');
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const current = classifyWhatsapp(stored);
  const proposed = classifyWhatsapp(draft);
  const changed = draft.trim() !== stored.trim();

  const save = async () => {
    if (saving) return;

    const next = draft.trim();
    if (!next) {
      toast({
        title: 'Not saving an empty link',
        description: 'Every WhatsApp button on the site reads this. Blank would hide all of them.',
        variant: 'destructive',
      });
      return;
    }

    if (proposed.kind === 'unknown') {
      toast({
        title: 'That does not look like a WhatsApp link',
        description: 'Use wa.me/27821234567 for a chat, or a whatsapp.com/channel link for the channel.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    const { error } = await (supabase
      .from('site_settings' as any)
      .update({ value: next })
      .eq('key', SETTING_KEY) as any);
    setSaving(false);

    if (error) {
      toast({ title: 'Not saved', description: error.message, variant: 'destructive' });
      return;
    }

    setStored(next);
    toast({
      title: 'WhatsApp link updated',
      description: `Buttons across the site now read "${proposed.label}".`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          WhatsApp link
        </CardTitle>
        <CardDescription>
          Where every WhatsApp button on the public site points. The button text is
          taken from the link, so it always describes what the link actually does.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loadError && (
          <ReadFailureNotice what="the WhatsApp setting" reason={loadError} onRetry={load} />
        )}

        {!loading && !loadError && (
          <>
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm font-medium">Right now</p>
              <p className="mt-1 break-all text-xs text-muted-foreground">{stored}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Buttons read: {current.label}</Badge>
                {current.canMessageUs ? (
                  <Badge className="bg-green-100 text-green-800">People can message you</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800">
                    Broadcast only, nobody can reply
                  </Badge>
                )}
              </div>
              {!current.canMessageUs && (
                <p className="mt-3 flex items-start gap-2 text-xs text-amber-800">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none" />
                  A channel is a feed people follow. To take enquiries on WhatsApp,
                  paste a wa.me link with your business number, for example
                  wa.me/27821234567.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp-url">WhatsApp link</Label>
              <Input
                id="whatsapp-url"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={!isSuperAdmin || rolesLoading}
                placeholder="https://wa.me/27821234567"
              />
              {changed && draft.trim() && (
                <p className="text-xs text-muted-foreground">
                  After saving, buttons will read <strong>{proposed.label}</strong>
                  {proposed.canMessageUs
                    ? ' and carry a message naming the service the person was looking at.'
                    : ' and will not claim people can message you.'}
                </p>
              )}
            </div>

            {isSuperAdmin ? (
              <Button onClick={save} disabled={!changed || saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save link'}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                You can see this link, but not change it. Changing where a public
                call to action points is held to super admin.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsappLinkSetting;
