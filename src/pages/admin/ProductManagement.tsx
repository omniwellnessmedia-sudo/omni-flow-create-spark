import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  Package, 
  Eye,
  RefreshCw,
  CheckSquare,
  XSquare,
  Upload,
  Download,
  FileSpreadsheet,
  Plus,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price_zar: number;
  commission_rate: number;
  view_count: number;
  is_featured: boolean;
  is_trending: boolean;
  is_active: boolean;
  image_url: string;
  affiliate_url: string;
  affiliate_program_id: string;
  advertiser_name?: string;
  brand?: string;
}

const PRODUCT_SOURCES = [
  { id: 'all', label: 'All Sources' },
  { id: 'cj', label: 'CJ Affiliate' },
  { id: 'awin', label: 'Awin' },
  { id: 'viator', label: 'Viator (Tours)' },
  { id: 'omni', label: 'Omni Products' },
  { id: 'csv_import', label: 'CSV Import' },
];

const PRODUCT_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'travel', label: 'Travel & Tours' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'health', label: 'Health & Beauty' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'tech', label: 'Tech & Gadgets' },
];

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price_zar: 0,
    commission_rate: 0.1,
    image_url: '',
    affiliate_url: '',
    affiliate_program_id: 'omni'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedSource, statusFilter]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('affiliate_products')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.advertiser_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter(p => p.affiliate_program_id === selectedSource);
    }

    if (statusFilter === 'featured') {
      filtered = filtered.filter(p => p.is_featured);
    } else if (statusFilter === 'trending') {
      filtered = filtered.filter(p => p.is_trending);
    } else if (statusFilter === 'active') {
      filtered = filtered.filter(p => p.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(p => !p.is_active);
    }

    setFilteredProducts(filtered);
  };

  const updateProduct = async (productId: string, field: string, value: boolean | string) => {
    try {
      const { error } = await supabase
        .from('affiliate_products')
        .update({ [field]: value })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, [field]: value } : p))
      );

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    }
  };

  const updateProductCategory = async (productId: string, category: string) => {
    await updateProduct(productId, 'category', category);
  };

  const bulkUpdate = async (field: string, value: boolean) => {
    if (selectedProducts.size === 0) {
      toast({
        title: 'No products selected',
        description: 'Please select products to update',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);
    try {
      const updates = Array.from(selectedProducts).map(id =>
        supabase
          .from('affiliate_products')
          .update({ [field]: value })
          .eq('id', id)
      );

      await Promise.all(updates);

      setProducts(prev =>
        prev.map(p =>
          selectedProducts.has(p.id) ? { ...p, [field]: value } : p
        )
      );

      toast({
        title: 'Bulk update complete',
        description: `Updated ${selectedProducts.size} products`,
      });

      setSelectedProducts(new Set());
    } catch (error) {
      console.error('Error bulk updating:', error);
      toast({
        title: 'Error',
        description: 'Failed to update products',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const addProduct = async () => {
    try {
      const { error } = await supabase
        .from('affiliate_products')
        .insert({
          ...newProduct,
          external_product_id: `omni_${Date.now()}`,
          is_active: true,
          is_featured: false,
          is_trending: false,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product added successfully',
      });

      setShowAddDialog(false);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price_zar: 0,
        commission_rate: 0.1,
        image_url: '',
        affiliate_url: '',
        affiliate_program_id: 'omni'
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product',
        variant: 'destructive',
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('affiliate_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0].map(h => h.trim().toLowerCase());
      
      const newProducts = rows.slice(1)
        .filter(row => row.length >= headers.length && row[0])
        .map(row => {
          const product: any = {
            external_product_id: `csv_${Date.now()}_${Math.random()}`,
            affiliate_program_id: 'csv_import',
            is_active: true,
          };
          
          headers.forEach((header, index) => {
            const value = row[index]?.trim();
            if (!value) return;

            switch (header) {
              case 'name':
              case 'title':
                product.name = value;
                break;
              case 'description':
                product.description = value;
                break;
              case 'category':
                product.category = value;
                break;
              case 'brand':
                product.brand = value;
                product.advertiser_name = value;
                break;
              case 'price_zar':
              case 'price':
                product.price_zar = parseFloat(value);
                break;
              case 'price_usd':
                product.price_usd = parseFloat(value);
                break;
              case 'price_eur':
                product.price_eur = parseFloat(value);
                break;
              case 'commission_rate':
              case 'commission':
                product.commission_rate = parseFloat(value) / 100;
                break;
              case 'image_url':
              case 'image':
                product.image_url = value;
                break;
              case 'affiliate_url':
              case 'url':
                product.affiliate_url = value;
                break;
              case 'featured':
                product.is_featured = value.toLowerCase() === 'true' || value === '1';
                break;
            }
          });

          return product;
        })
        .filter(p => p.name && p.price_zar && p.affiliate_url);

      if (newProducts.length === 0) {
        throw new Error('No valid products found in CSV');
      }

      const { error } = await supabase
        .from('affiliate_products')
        .insert(newProducts);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Imported ${newProducts.length} products successfully`,
      });

      fetchProducts();
    } catch (error: any) {
      console.error('Error importing CSV:', error);
      toast({
        title: 'Import Error',
        description: error.message || 'Failed to import products',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadCSVTemplate = () => {
    const template = [
      'name,description,category,brand,price_zar,price_usd,price_eur,commission_rate,image_url,affiliate_url,featured',
      'Sample Wellness Product,High quality organic product,Health & Beauty,BrandName,299.99,19.99,17.99,12,https://example.com/image.jpg,https://example.com/product,false'
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getSourceLabel = (sourceId: string) => {
    return PRODUCT_SOURCES.find(s => s.id === sourceId)?.label || sourceId;
  };

  const getSourceColor = (sourceId: string) => {
    const colors: Record<string, string> = {
      cj: 'bg-blue-100 text-blue-800',
      awin: 'bg-purple-100 text-purple-800',
      viator: 'bg-green-100 text-green-800',
      omni: 'bg-orange-100 text-orange-800',
      csv_import: 'bg-gray-100 text-gray-800',
    };
    return colors[sourceId] || 'bg-gray-100 text-gray-800';
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  
  const stats = {
    total: products.length,
    featured: products.filter(p => p.is_featured).length,
    trending: products.filter(p => p.is_trending).length,
    active: products.filter(p => p.is_active).length,
    cj: products.filter(p => p.affiliate_program_id === 'cj').length,
    awin: products.filter(p => p.affiliate_program_id === 'awin').length,
    viator: products.filter(p => p.affiliate_program_id === 'viator').length,
    omni: products.filter(p => p.affiliate_program_id === 'omni').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Featured</p>
              <p className="text-lg font-bold text-yellow-600">{stats.featured}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Trending</p>
              <p className="text-lg font-bold text-blue-600">{stats.trending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">CJ</p>
              <p className="text-lg font-bold">{stats.cj}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Awin</p>
              <p className="text-lg font-bold">{stats.awin}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Viator</p>
              <p className="text-lg font-bold">{stats.viator}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Omni</p>
              <p className="text-lg font-bold">{stats.omni}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Product + CSV Import */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <CardTitle className="text-base md:text-lg">Add Products</CardTitle>
              <CardDescription className="text-xs md:text-sm">Add new products or import via CSV</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Add an Omni product to the catalog</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Product description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={newProduct.category} onValueChange={v => setNewProduct({...newProduct, category: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_TYPES.filter(t => t.id !== 'all').map(type => (
                              <SelectItem key={type.id} value={type.label}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Price (ZAR)</Label>
                        <Input 
                          type="number"
                          value={newProduct.price_zar}
                          onChange={e => setNewProduct({...newProduct, price_zar: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Commission Rate (%)</Label>
                      <Input 
                        type="number"
                        value={newProduct.commission_rate * 100}
                        onChange={e => setNewProduct({...newProduct, commission_rate: (parseFloat(e.target.value) || 0) / 100})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        value={newProduct.image_url}
                        onChange={e => setNewProduct({...newProduct, image_url: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Affiliate/Product URL</Label>
                      <Input 
                        value={newProduct.affiliate_url}
                        onChange={e => setNewProduct({...newProduct, affiliate_url: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                    <Button onClick={addProduct} disabled={!newProduct.name || !newProduct.price_zar}>Add Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={downloadCSVTemplate}>
                <Download className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Template</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={importing}>
                <Upload className="w-4 h-4 mr-1" />
                {importing ? 'Importing...' : <span className="hidden sm:inline">Import CSV</span>}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <CardTitle className="text-base md:text-lg">Manage Products</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  {filteredProducts.length} products {selectedProducts.size > 0 && `(${selectedProducts.size} selected)`}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkUpdate('is_featured', true)}
                  disabled={selectedProducts.size === 0 || updating}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Feature
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkUpdate('is_trending', true)}
                  disabled={selectedProducts.size === 0 || updating}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkUpdate('is_active', false)}
                  disabled={selectedProducts.size === 0 || updating}
                >
                  <XSquare className="w-3 h-3 mr-1" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkUpdate('is_active', true)}
                  disabled={selectedProducts.size === 0 || updating}
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Activate
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          {/* Filters - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
            <div className="relative col-span-2 sm:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_SOURCES.map(source => (
                  <SelectItem key={source.id} value={source.id}>{source.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Table - Mobile Card View */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={selectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead className="w-14">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.slice(0, 50).map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{product.brand || product.advertiser_name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getSourceColor(product.affiliate_program_id)}`}>
                        {getSourceLabel(product.affiliate_program_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={product.category || 'Uncategorized'} 
                        onValueChange={(v) => updateProductCategory(product.id, v)}
                      >
                        <SelectTrigger className="h-8 text-xs w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c !== 'all').map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                          {PRODUCT_TYPES.filter(t => t.id !== 'all').map(type => (
                            <SelectItem key={type.id} value={type.label}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R{product.price_zar?.toFixed(0) || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={product.is_featured}
                        onCheckedChange={(checked) => updateProduct(product.id, 'is_featured', checked)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={product.is_active}
                        onCheckedChange={(checked) => updateProduct(product.id, 'is_active', checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.affiliate_url && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        {product.affiliate_program_id === 'omni' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <input
                type="checkbox"
                checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                onChange={selectAll}
                className="rounded"
              />
              <span className="text-sm text-muted-foreground">Select all</span>
            </div>
            {filteredProducts.slice(0, 20).map(product => (
              <Card key={product.id} className="p-3">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="rounded mt-1"
                  />
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge className={`text-[10px] ${getSourceColor(product.affiliate_program_id)}`}>
                        {getSourceLabel(product.affiliate_program_id)}
                      </Badge>
                      {product.category && (
                        <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                      )}
                    </div>
                    <p className="font-bold text-sm mt-1">R{product.price_zar?.toFixed(0) || 0}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 text-xs">
                      <Switch
                        checked={product.is_featured}
                        onCheckedChange={(checked) => updateProduct(product.id, 'is_featured', checked)}
                      />
                      Featured
                    </label>
                    <label className="flex items-center gap-1 text-xs">
                      <Switch
                        checked={product.is_active}
                        onCheckedChange={(checked) => updateProduct(product.id, 'is_active', checked)}
                      />
                      Active
                    </label>
                  </div>
                  {product.affiliate_program_id === 'omni' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your filters
            </div>
          )}

          {filteredProducts.length > 50 && (
            <p className="text-sm text-muted-foreground text-center">
              Showing first 50 of {filteredProducts.length} products. Use filters to narrow down.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;