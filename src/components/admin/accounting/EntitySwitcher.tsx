import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

export interface Entity {
  id: string;
  slug: string;
  name: string;
  entity_type: "commercial" | "npc" | "tourism" | "brand" | "education";
  brand_color: string;
}

const ALL = "__all__";

/**
 * EntitySwitcher — single drop-down at the top of the Accountant Portal that
 * scopes every tab below to one entity (Omni, TTCT, Foundation, ROAM, …) or
 * "All entities". The selected entity id is held by the parent and passed into
 * AdminAccounting via the `entityFilter` prop.
 */
export function EntitySwitcher({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (entityId: string | undefined) => void;
}) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await (supabase as any)
        .from("entities")
        .select("id, slug, name, entity_type, brand_color")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (!mounted) return;
      setEntities((data as Entity[]) || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = (v: string) => onChange(v === ALL ? undefined : v);

  return (
    <Select value={value ?? ALL} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-[220px]">
        <Building2 className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
        <SelectValue placeholder="All entities" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All entities</SelectItem>
        {entities.map((e) => (
          <SelectItem key={e.id} value={e.id}>
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: e.brand_color }}
              />
              {e.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default EntitySwitcher;
