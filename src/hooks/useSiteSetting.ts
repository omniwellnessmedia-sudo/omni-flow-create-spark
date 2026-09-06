import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Read one published row from site_settings.
 *
 * The fallback matters more than it looks. These settings drive public
 * calls to action, and a failed read must not blank a button or leave a
 * link pointing nowhere. So the caller supplies what the site shipped
 * with, and that is what renders until a real value arrives.
 *
 * Only rows with is_public are readable by a signed out visitor, which is
 * every visitor on the pages these settings drive.
 *
 * No em dashes in this file.
 */

const cache = new Map<string, string>();

export const useSiteSetting = (key: string, fallback: string): string => {
  const [value, setValue] = useState<string>(cache.get(key) ?? fallback);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data, error } = await (supabase
        .from('site_settings' as any)
        .select('value')
        .eq('key', key)
        .maybeSingle() as any);

      if (cancelled) return;

      // A refused or failed read keeps the fallback. There is nothing
      // useful to show a visitor about a settings table.
      if (error || !data) return;

      const next = (data as { value?: string }).value;
      if (typeof next === 'string' && next.trim()) {
        cache.set(key, next);
        setValue(next);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [key]);

  return value;
};
