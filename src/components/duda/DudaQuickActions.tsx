import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDudaSite } from '@/hooks/useDudaSite';
import { DudaSite } from '@/types/duda';
import { Rocket, Eye, ExternalLink, Loader2 } from 'lucide-react';

interface DudaQuickActionsProps {
  site: DudaSite | null;
  onSiteUpdated: () => void;
}

const DudaQuickActions = ({ site, onSiteUpdated }: DudaQuickActionsProps) => {
  const { loading, createSite, publishSite } = useDudaSite();
  const [businessName, setBusinessName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateSite = async () => {
    if (!businessName) return;
    
    await createSite(businessName);
    setCreateDialogOpen(false);
    onSiteUpdated();
  };

  const handlePublish = async () => {
    if (!site) return;
    
    const action = site.published ? 'unpublish' : 'publish';
    await publishSite(site.duda_site_name, action);
    onSiteUpdated();
  };

  const openDudaEditor = () => {
    if (!site) return;
    window.open(`https://editor.duda.co/editor/${site.duda_site_name}`, '_blank');
  };

  if (!site) {
    return (
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            <Rocket className="w-5 h-5 mr-2" />
            Create Your Website
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your Partner Website</DialogTitle>
            <DialogDescription>
              Enter your business name to get started
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Wellness Practice"
              />
            </div>
            <Button
              onClick={handleCreateSite}
              disabled={loading || !businessName}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Website'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={handlePublish}
        disabled={loading}
        variant={site.published ? 'outline' : 'default'}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {site.published ? 'Unpublishing...' : 'Publishing...'}
          </>
        ) : (
          <>
            <Rocket className="w-4 h-4 mr-2" />
            {site.published ? 'Unpublish Site' : 'Publish Site'}
          </>
        )}
      </Button>

      {site.duda_site_url && (
        <Button
          variant="outline"
          onClick={() => window.open(site.duda_site_url, '_blank')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview Site
        </Button>
      )}

      <Button
        variant="outline"
        onClick={openDudaEditor}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Edit in Duda
      </Button>
    </div>
  );
};

export default DudaQuickActions;
