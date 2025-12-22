import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, Search, ExternalLink, Eye, Star, 
  TrendingUp, MapPin, Clock, DollarSign, Globe,
  ToggleLeft, CheckCircle, AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ViatorTour {
  id: string;
  viator_product_code: string;
  title: string;
  description: string;
  location: string;
  price_from: number;
  currency: string;
  duration: any;
  rating: number;
  review_count: number;
  image_url: string;
  booking_url: string;
  category: string;
  is_active: boolean;
  last_synced_at: string;
}

interface AffiliateClick {
  id: string;
  created_at: string;
  destination_url: string;
  affiliate_program_id: string;
}

export default function AdminViatorTours() {
  const [tours, setTours] = useState<ViatorTour[]>([]);
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTours();
    fetchClicks();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('viator_tours')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const fetchClicks = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_clicks')
        .select('*')
        .eq('affiliate_program_id', 'viator')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setClicks(data || []);
    } catch (error) {
      console.error('Error fetching clicks:', error);
    }
  };

  const syncTours = async () => {
    try {
      setSyncing(true);
      toast.info('Syncing tours from Viator API...');

      const { data, error } = await supabase.functions.invoke('viator-tours', {
        body: { action: 'search_tours' }
      });

      if (error) throw error;

      toast.success(`Synced ${data?.cachedTours?.length || 0} tours from Viator`);
      fetchTours();
    } catch (error) {
      console.error('Error syncing tours:', error);
      toast.error('Failed to sync tours from Viator');
    } finally {
      setSyncing(false);
    }
  };

  const toggleTourStatus = async (tourId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('viator_tours')
        .update({ is_active: !currentStatus })
        .eq('id', tourId);

      if (error) throw error;

      setTours(tours.map(t => 
        t.id === tourId ? { ...t, is_active: !currentStatus } : t
      ));
      
      toast.success(`Tour ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour status');
    }
  };

  const bulkToggle = async (activate: boolean) => {
    try {
      const { error } = await supabase
        .from('viator_tours')
        .update({ is_active: activate })
        .neq('id', ''); // Update all

      if (error) throw error;

      setTours(tours.map(t => ({ ...t, is_active: activate })));
      toast.success(`All tours ${activate ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error bulk updating tours:', error);
      toast.error('Failed to update tours');
    }
  };

  // Filter tours
  const filteredTours = tours.filter(tour => {
    const matchesSearch = !searchQuery || 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && tour.is_active) ||
      (filterStatus === 'inactive' && !tour.is_active);

    return matchesSearch && matchesStatus;
  });

  // Stats
  const activeTours = tours.filter(t => t.is_active).length;
  const totalClicks = clicks.length;
  const todayClicks = clicks.filter(c => 
    new Date(c.created_at).toDateString() === new Date().toDateString()
  ).length;
  const avgRating = tours.length > 0 
    ? (tours.reduce((sum, t) => sum + (t.rating || 0), 0) / tours.length).toFixed(1)
    : '0';

  const formatDuration = (duration: any): string => {
    if (!duration) return 'Varies';
    try {
      const parsed = typeof duration === 'string' ? JSON.parse(duration) : duration;
      if (parsed.fixedDurationInMinutes) {
        return `${Math.floor(parsed.fixedDurationInMinutes / 60)}h`;
      }
      return 'Varies';
    } catch {
      return 'Varies';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Viator Tours Management
          </h2>
          <p className="text-muted-foreground">
            Manage and sync tours from Viator affiliate program
          </p>
        </div>
        <Button onClick={syncTours} disabled={syncing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from Viator'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tours</p>
                <p className="text-2xl font-bold">{tours.length}</p>
              </div>
              <Globe className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tours</p>
                <p className="text-2xl font-bold text-green-600">{activeTours}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{totalClicks}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  {avgRating}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tours" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tours">Tours ({tours.length})</TabsTrigger>
          <TabsTrigger value="clicks">Click Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tours" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tours..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => bulkToggle(true)}>
                    Activate All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => bulkToggle(false)}>
                    Deactivate All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tours Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading tours...
                </div>
              ) : filteredTours.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-semibold mb-2">No Tours Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {tours.length === 0 
                      ? 'Click "Sync from Viator" to fetch tours from the API'
                      : 'Try adjusting your search or filters'}
                  </p>
                  {tours.length === 0 && (
                    <Button onClick={syncTours} disabled={syncing}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                      Sync Tours
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Active</TableHead>
                        <TableHead>Tour</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTours.map((tour) => (
                        <TableRow key={tour.id}>
                          <TableCell>
                            <Switch
                              checked={tour.is_active}
                              onCheckedChange={() => toggleTourStatus(tour.id, tour.is_active)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img 
                                src={tour.image_url || '/placeholder.svg'}
                                alt={tour.title}
                                className="w-12 h-12 rounded object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                              <div className="min-w-0">
                                <p className="font-medium line-clamp-1">{tour.title}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {tour.category || 'Tour'}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3" />
                              {tour.location}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              ${tour.price_from?.toFixed(0)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {tour.rating?.toFixed(1) || '-'}
                              <span className="text-xs text-muted-foreground">
                                ({tour.review_count || 0})
                              </span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-sm">
                              <Clock className="w-3 h-3" />
                              {formatDuration(tour.duration)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(tour.booking_url, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clicks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Affiliate Clicks</CardTitle>
              <CardDescription>
                Track clicks on Viator affiliate links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clicks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No clicks recorded yet. Clicks will appear here when users click on tour links.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Destination URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clicks.slice(0, 20).map((click) => (
                      <TableRow key={click.id}>
                        <TableCell>
                          {new Date(click.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          <a 
                            href={click.destination_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {click.destination_url}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
