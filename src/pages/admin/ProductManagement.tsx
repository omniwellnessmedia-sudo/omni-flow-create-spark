import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  Package, 
  Eye,
  DollarSign,
  RefreshCw,
  CheckSquare,
  XSquare
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price_zar: number;
  commission_rate: number;
  view_count: number;
  is_featured: boolean;
  is_trending: boolean;
  is_active: boolean;
  image_url: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, statusFilter]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('affiliate_program_id', 'cj')
        .order('created_at', { ascending: false });

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
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
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

  const updateProduct = async (productId: string, field: string, value: boolean) => {
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
        description: `Product ${value ? 'enabled' : 'disabled'} successfully`,
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

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const stats = {
    total: products.length,
    featured: products.filter(p => p.is_featured).length,
    trending: products.filter(p => p.is_trending).length,
    active: products.filter(p => p.is_active).length,
    missingImages: products.filter(p => !p.image_url).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600">{stats.featured}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{stats.trending}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{stats.active}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Missing Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <XSquare className="w-4 h-4 text-red-500" />
              <span className="text-2xl font-bold text-red-600">{stats.missingImages}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Manage featured, trending, and active status for {filteredProducts.length} products
                {selectedProducts.size > 0 && ` (${selectedProducts.size} selected)`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkUpdate('is_featured', true)}
                disabled={selectedProducts.size === 0 || updating}
              >
                <Star className="w-4 h-4 mr-2" />
                Mark Featured
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkUpdate('is_trending', true)}
                disabled={selectedProducts.size === 0 || updating}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Mark Trending
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkUpdate('is_active', false)}
                disabled={selectedProducts.size === 0 || updating}
              >
                <XSquare className="w-4 h-4 mr-2" />
                Deactivate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
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
              <SelectTrigger className="w-full md:w-[200px]">
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

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={selectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead className="text-center">Views</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-center">Trending</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
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
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R{product.price_zar?.toFixed(0) || 0}
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      {(product.commission_rate * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{product.view_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={product.is_featured}
                        onCheckedChange={(checked) =>
                          updateProduct(product.id, 'is_featured', checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={product.is_trending}
                        onCheckedChange={(checked) =>
                          updateProduct(product.id, 'is_trending', checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={product.is_active}
                        onCheckedChange={(checked) =>
                          updateProduct(product.id, 'is_active', checked)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
