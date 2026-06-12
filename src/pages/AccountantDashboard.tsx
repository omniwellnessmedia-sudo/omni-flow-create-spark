import { Suspense, lazy, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { EntitySwitcher } from "@/components/admin/accounting/EntitySwitcher";
import { ComplianceCalendar } from "@/components/admin/accounting/ComplianceCalendar";

const AdminAccounting = lazy(() => import("@/pages/admin/AdminAccounting"));

const AccountantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // entityFilter is undefined for "All entities"; otherwise an entities.id UUID.
  // Held here so AdminAccounting + ComplianceCalendar can react to the switch.
  const [entityFilter, setEntityFilter] = useState<string | undefined>(undefined);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-lg leading-tight truncate">Accountant Portal</h1>
              <p className="text-xs text-muted-foreground truncate">Read-only financial view · Omni Wellness Media</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <EntitySwitcher value={entityFilter} onChange={setEntityFilter} />
            <span className="text-xs text-muted-foreground hidden lg:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <ComplianceCalendar />

        <Suspense fallback={<div className="text-center text-muted-foreground py-12">Loading financial data…</div>}>
          <AdminAccounting entityFilter={entityFilter} />
        </Suspense>
      </main>
    </div>
  );
};

export default AccountantDashboard;
