import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Wand2, UserPlus, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [autoCurationResults, setAutoCurationResults] = useState<any>(null);
  const { toast } = useToast();

  const runAutoCuration = async () => {
    setLoading(true);
    setAutoCurationResults(null);
    
    try {
      // Call the auto-curation function
      const { error } = await supabase.rpc('auto_curate_featured_products');
      
      if (error) throw error;

      // Fetch updated stats
      const { data: featured, error: featuredError } = await supabase
        .from('affiliate_products')
        .select('id', { count: 'exact', head: true })
        .eq('is_featured', true);

      const { data: trending, error: trendingError } = await supabase
        .from('affiliate_products')
        .select('id', { count: 'exact', head: true })
        .eq('is_trending', true);

      if (featuredError || trendingError) throw featuredError || trendingError;

      setAutoCurationResults({
        success: true,
        featuredCount: featured?.length || 0,
        trendingCount: trending?.length || 0,
      });

      toast({
        title: 'Auto-curation complete',
        description: 'Products have been automatically curated based on performance',
      });
    } catch (error) {
      console.error('Error running auto-curation:', error);
      toast({
        title: 'Error',
        description: 'Failed to run auto-curation',
        variant: 'destructive',
      });
      setAutoCurationResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdminUser = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newAdminEmail.trim())
        .single();

      if (userError || !userData) {
        toast({
          title: 'User not found',
          description: 'This user needs to sign up first',
          variant: 'destructive',
        });
        return;
      }

      // Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.id,
          role: 'admin',
        });

      if (roleError) {
        if (roleError.code === '23505') {
          toast({
            title: 'Already an admin',
            description: 'This user already has admin access',
            variant: 'destructive',
          });
        } else {
          throw roleError;
        }
        return;
      }

      toast({
        title: 'Admin added',
        description: `${newAdminEmail} now has admin access`,
      });

      setNewAdminEmail('');
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to add admin user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addPredefinedAdmins = async () => {
    setLoading(true);
    const adminEmails = [
      'omnimediawellness@gmail.com',
      'sandy@druyogacapetown.co.za',
    ];

    let successCount = 0;
    let alreadyAdminCount = 0;
    let notFoundCount = 0;

    for (const email of adminEmails) {
      try {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (userError) throw userError;

        if (!userData) {
          notFoundCount++;
          continue;
        }

        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userData.id,
            role: 'admin',
          });

        if (roleError) {
          if (roleError.code === '23505') {
            alreadyAdminCount++;
          } else {
            throw roleError;
          }
        } else {
          successCount++;
        }
      } catch (error) {
        console.error(`Error adding admin ${email}:`, error);
      }
    }

    toast({
      title: 'Admin setup complete',
      description: `Added: ${successCount}, Already admin: ${alreadyAdminCount}, Not found: ${notFoundCount}`,
    });

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Tools</h2>
        <p className="text-muted-foreground">Manage product curation and admin users</p>
      </div>

      {/* Auto-Curation Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Auto-Curate Products
          </CardTitle>
          <CardDescription>
            Automatically mark products as featured (commission {'>'} 15% + good images) and trending (top viewed)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runAutoCuration} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Run Auto-Curation
              </>
            )}
          </Button>

          {autoCurationResults && (
            <div className={`p-4 rounded-lg ${
              autoCurationResults.success 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {autoCurationResults.success ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-600">Curation Complete</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500">Featured</Badge>
                      <span>{autoCurationResults.featuredCount} products marked as featured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-500">Trending</Badge>
                      <span>{autoCurationResults.trendingCount} products marked as trending</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-600">Curation Failed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{autoCurationResults.error}</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Admin Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Manage Admin Users
          </CardTitle>
          <CardDescription>
            Add team members as administrators (they must sign up first)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Add Admin by Email</Label>
            <div className="flex gap-2">
              <Input
                id="admin-email"
                type="email"
                placeholder="user@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAdminUser()}
              />
              <Button onClick={addAdminUser} disabled={loading}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Quick action: Add predefined team admins (Chad, Zenith, Ferozza)
            </p>
            <Button 
              variant="outline" 
              onClick={addPredefinedAdmins} 
              disabled={loading}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Admins
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTools;
