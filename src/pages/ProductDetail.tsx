import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ArrowLeft, Heart, ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Mock product data - in real app, fetch from database
  const mockProducts = {
    "1": {
      id: "1",
      title: "Organic Wellness Tea Blend",
      price_zar: 89.99,
      price_wellcoins: 25,
      description: "A carefully crafted blend of organic herbs designed to promote relaxation and well-being. Perfect for evening unwinding or meditation sessions.",
      images: [
        "/lovable-uploads/2c1edd03-b748-4129-ad38-5ed1db48917e.png",
        "/lovable-uploads/3e329aa7-398b-4473-948d-2d5f9d54915a.png",
        "/lovable-uploads/4a01dcd5-fe18-4590-afd3-fe656ef63428.png"
      ],
      category: "Wellness Teas",
      inStock: true,
      ingredients: "Chamomile, Lavender, Lemon Balm, Passionflower, Organic Honey",
      benefits: [
        "Promotes relaxation and better sleep",
        "Reduces stress and anxiety",
        "Supports digestive health",
        "100% organic ingredients",
        "Ethically sourced"
      ],
      rating: 4.8,
      reviewCount: 127,
      stockCount: 45
    },
    "2": {
      id: "2", 
      title: "Natural Energy Booster Capsules",
      price_zar: 129.99,
      price_wellcoins: 35,
      description: "Plant-based energy support capsules made with natural adaptogens to help you maintain steady energy throughout the day without crashes.",
      images: [
        "/lovable-uploads/55337f01-2391-4c96-a2a3-0044cb84cd8b.png",
        "/lovable-uploads/65549a00-dea0-461e-9e85-fe455db1c706.png"
      ],
      category: "Supplements",
      inStock: true,
      ingredients: "Ashwagandha, Rhodiola Rosea, Ginseng, B-Vitamins, Green Tea Extract",
      benefits: [
        "Sustained natural energy",
        "Supports mental clarity",
        "Helps manage stress",
        "No artificial stimulants",
        "Third-party tested"
      ],
      rating: 4.6,
      reviewCount: 89,
      stockCount: 23
    }
  };

  useEffect(() => {
    const foundProduct = mockProducts[id];
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button asChild>
              <Link to="/2bewell-shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/2bewell-shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shop
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                <h1 className="font-heading font-bold text-3xl mb-4">{product.title}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-primary">
                    R{product.price_zar}
                  </div>
                  <div className="text-lg text-green-600">
                    or {product.price_wellcoins} WellCoins
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{product.description}</p>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  {product.inStock ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600">In Stock ({product.stockCount} available)</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-600">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Add to Cart */}
                <div className="flex gap-4 mb-8">
                  <AddToCartButton
                    item={{
                      id: product.id,
                      title: product.title,
                      price_zar: product.price_zar,
                      price_wellcoins: product.price_wellcoins,
                      image: product.images[0],
                      category: product.category
                    }}
                    className="flex-1"
                    disabled={!product.inStock}
                  />
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping on orders over R200</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <RefreshCw className="w-4 h-4" />
                    <span>Easy returns & exchanges</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Ingredients:</h4>
                      <p className="text-gray-600">{product.ingredients}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Category:</h4>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>
                      {product.reviewCount} reviews with an average rating of {product.rating}/5
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock reviews */}
                      <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-semibold">Sarah M.</span>
                          <span className="text-sm text-gray-500">2 weeks ago</span>
                        </div>
                        <p className="text-gray-600">
                          "Amazing product! Really helps me relax in the evenings. The taste is wonderful and I've been sleeping much better."
                        </p>
                      </div>
                      <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            <Star className="w-4 h-4 text-gray-300" />
                          </div>
                          <span className="font-semibold">Mike T.</span>
                          <span className="text-sm text-gray-500">1 month ago</span>
                        </div>
                        <p className="text-gray-600">
                          "Good quality tea blend. Takes a while to see effects but definitely worth it. Will order again."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;