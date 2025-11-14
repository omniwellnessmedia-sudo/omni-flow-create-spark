import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Eye, Image as ImageIcon, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useStorageImages } from '@/hooks/useStorageImages';
import { toast } from 'sonner';

interface Tour {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  destination: string;
  duration: string;
  price_from: number;
  max_participants: number;
  hero_image_url: string;
  image_gallery: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  difficulty_level: string;
  active: boolean;
  category_id?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminTours = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  const { images: storageImages, loading: imagesLoading } = useStorageImages({
    bucket: 'provider-images',
    folders: ['General Images', 'Tours', 'Retreats', 'Experiences'],
  });

  useEffect(() => {
    checkAdminAccess();
    fetchTours();
    fetchCategories();
  }, []);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'admin' || r.role === 'super_admin');
    
    if (!isAdmin) {
      toast.error('Admin access required');
      navigate('/');
    }
  };

  const fetchTours = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tours')
      .select('*, category:tour_categories(name, slug)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch tours');
      console.error(error);
    } else {
      setTours(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('tour_categories')
      .select('*')
      .order('name');
    
    setCategories(data || []);
  };

  const handleSaveTour = async (tourData: Partial<Tour>) => {
    try {
      if (editingTour?.id) {
        // Update existing tour
        const { error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', editingTour.id);

        if (error) throw error;
        toast.success('Tour updated successfully');
      } else {
        // Create new tour - ensure all required fields
        const newTour = {
          ...tourData,
          slug: tourData.title?.toLowerCase().replace(/\s+/g, '-') || 'new-tour',
          category_id: tourData.category_id || categories[0]?.id || null,
          destination: tourData.destination || '',
          duration: tourData.duration || '7 days',
          price_from: tourData.price_from || 0,
          title: tourData.title || 'New Tour',
          subtitle: tourData.subtitle || '',
          overview: tourData.overview || '',
          max_participants: tourData.max_participants || 12,
        };

        const { error } = await supabase
          .from('tours')
          .insert([newTour]);

        if (error) throw error;
        toast.success('Tour created successfully');
      }

      setIsDialogOpen(false);
      setEditingTour(null);
      fetchTours();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Failed to save tour');
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete tour');
    } else {
      toast.success('Tour deleted successfully');
      fetchTours();
    }
  };

  const TourForm = ({ tour }: { tour: Tour | null }) => {
    const [formData, setFormData] = useState<Partial<Tour>>(
      tour || {
        title: '',
        subtitle: '',
        overview: '',
        destination: '',
        duration: '7 days',
        price_from: 0,
        max_participants: 12,
        hero_image_url: '',
        image_gallery: [],
        highlights: [],
        inclusions: [],
        exclusions: [],
        difficulty_level: 'all_levels',
        active: true,
      }
    );

    return (
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
        <div>
          <Label htmlFor="title">Tour Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Table Mountain Wellness Retreat"
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Transform your wellness journey"
          />
        </div>

        <div>
          <Label htmlFor="overview">Overview *</Label>
          <Textarea
            id="overview"
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            rows={4}
            placeholder="Detailed tour description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="Cape Town, South Africa"
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration *</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="7 days"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (ZAR) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price_from}
              onChange={(e) => setFormData({ ...formData, price_from: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="participants">Max Participants *</Label>
            <Input
              id="participants"
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Hero Image</Label>
          <div className="flex gap-2 items-center">
            <Input
              value={formData.hero_image_url}
              onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
              placeholder="Image URL"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedImages([formData.hero_image_url || '']);
                setImagePickerOpen(true);
              }}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>
          {formData.hero_image_url && (
            <img src={formData.hero_image_url} alt="Preview" className="mt-2 h-32 object-cover rounded" />
          )}
        </div>

        <div>
          <Label>Image Gallery ({formData.image_gallery?.length || 0} images)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedImages(formData.image_gallery || []);
              setImagePickerOpen(true);
            }}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Select Images
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSaveTour(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save Tour
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tours Management</h1>
            <p className="text-muted-foreground">Create and manage wellness tours & retreats</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTour(null)}>
                <Plus className="w-4 h-4 mr-2" />
                New Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{editingTour ? 'Edit Tour' : 'Create New Tour'}</DialogTitle>
                <DialogDescription>
                  Add wellness tours, retreats, and experiences
                </DialogDescription>
              </DialogHeader>
              <TourForm tour={editingTour} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="tours" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tours">Tours ({tours.length})</TabsTrigger>
            <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="tours">
            <Card>
              <CardHeader>
                <CardTitle>All Tours</CardTitle>
                <CardDescription>Manage your wellness experiences</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading tours...</div>
                ) : tours.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tours yet. Create your first tour to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tours.map((tour) => (
                        <TableRow key={tour.id}>
                          <TableCell className="font-medium">{tour.title}</TableCell>
                          <TableCell>{tour.destination}</TableCell>
                          <TableCell>R{tour.price_from.toLocaleString()}</TableCell>
                          <TableCell>{tour.duration}</TableCell>
                          <TableCell>
                            <Badge variant={tour.active ? 'default' : 'secondary'}>
                              {tour.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/experience/${tour.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTour(tour);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTour(tour.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Tour Categories</CardTitle>
                <CardDescription>Organize tours by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-sm text-muted-foreground">{cat.slug}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Image Picker Dialog */}
        <Dialog open={imagePickerOpen} onOpenChange={setImagePickerOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Select Images from Storage</DialogTitle>
              <DialogDescription>
                Choose images from your Supabase storage
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-4 max-h-[500px] overflow-y-auto">
              {imagesLoading ? (
                <div className="col-span-4 text-center py-8">Loading images...</div>
              ) : (
                storageImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square cursor-pointer group"
                    onClick={() => {
                      const newImages = selectedImages.includes(img.url)
                        ? selectedImages.filter(u => u !== img.url)
                        : [...selectedImages, img.url];
                      setSelectedImages(newImages);
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover rounded border-2 transition-all"
                      style={{
                        borderColor: selectedImages.includes(img.url) ? '#10b981' : 'transparent'
                      }}
                    />
                    {selectedImages.includes(img.url) && (
                      <div className="absolute inset-0 bg-green-500/20 rounded flex items-center justify-center">
                        <div className="bg-green-500 text-white rounded-full p-2">✓</div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.name}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImagePickerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                if (editingTour) {
                  setEditingTour({ ...editingTour, image_gallery: selectedImages });
                }
                setImagePickerOpen(false);
              }}>
                Confirm ({selectedImages.length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminTours;
