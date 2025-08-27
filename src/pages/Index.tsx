import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilter } from "@/components/ProductFilter";
import { ProductDetails } from "@/components/ProductDetails";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Product, CartItem, FilterOptions, Category } from "@/types/product";
import { useSharedCart } from "../../../src/utils/cartUtils";
import productsData from "@/data/products.json";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // استفاده از hook مشترک سبد خرید
  const {
    cartItems,
    totalItems,
    totalPrice,
    addToCart: addItemToCart,
    updateQuantity,
    removeFromCart
  } = useSharedCart();
  
  // Data from JSON
  const categories: Category[] = productsData.categories;
  const allProducts: Product[] = productsData.products;
  
  // State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRange: [0, 100000000],
    sortBy: 'name'
  });

  // Initialize price range
  useEffect(() => {
    const prices = allProducts.filter(p => !p.isContactPrice && p.price).map(p => p.price!);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
    }
  }, [allProducts]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let results = allProducts;

    // Search filter
    if (searchQuery) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter(p => filters.categories.includes(p.category));
    }

    // Brand filter  
    if (filters.brands.length > 0) {
      results = results.filter(p => filters.brands.includes(p.brand));
    }

    // Price filter
    if (!filters.contactPrice) {
      results = results.filter(p => 
        p.isContactPrice || (p.price && p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
      );
    }

    // Stock filter
    if (filters.inStock) {
      results = results.filter(p => p.stock > 0);
    }

    // Special offers filter
    if (filters.specialOffers) {
      results = results.filter(p => p.isSpecialOffer);
    }

    // Contact price filter
    if (filters.contactPrice) {
      results = results.filter(p => p.isContactPrice);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => {
          if (a.isContactPrice) return 1;
          if (b.isContactPrice) return -1;
          return (a.price || 0) - (b.price || 0);
        });
        break;
      case 'price-desc':
        results.sort((a, b) => {
          if (a.isContactPrice) return 1;
          if (b.isContactPrice) return -1;
          return (b.price || 0) - (a.price || 0);
        });
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popularity':
        results.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default:
        results.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
    }

    return results;
  }, [allProducts, searchQuery, filters]);

  // Group products by category for tabs
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    categories.forEach(cat => {
      grouped[cat.id] = filteredProducts.filter(p => p.category === cat.id);
    });
    return grouped;
  }, [filteredProducts, categories]);

  // Cart functions
  const addToCart = (product: Product) => {
    if (product.isContactPrice) {
      window.location.href = 'tel:02188776655';
      return;
    }

    // بررسی موجودی
    const existingInCart = cartItems.find(item => item.id === product.id);
    if (existingInCart && existingInCart.quantity >= product.stock) {
      toast({
        title: "ناموجود",
        description: "موجودی کافی نیست",
        variant: "destructive"
      });
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.originalPrice && product.discountPercentage 
        ? product.originalPrice - (product.originalPrice * product.discountPercentage / 100)
        : product.price || 0,
      image: product.image,
      quantity: 1,
      stock: product.stock
    };

    addItemToCart(cartItem);

    toast({
      title: "اضافه شد",
      description: `${product.name} به سبد خرید اضافه شد`,
      variant: "default"
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout', { state: { items: cartItems } });
  };

  const handleCategoryClick = (categoryId: string) => {
    setFilters(prev => ({ ...prev, categories: [categoryId] }));
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemsCount={totalItems}
        onCartOpen={() => setIsCartOpen(true)}
        categories={categories}
        onCategoryClick={handleCategoryClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mode="store"
      />

      <Hero />

      {/* Products Section */}
      <main id="products-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" dir="rtl">محصولات ما</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" dir="rtl">
              مجموعه کاملی از پکیج‌های کولر سلولزی، قطعات یدکی و لوازم جانبی
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <ProductFilter
              products={allProducts}
              categories={categories}
              filters={filters}
              onFiltersChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length > 20 ? (
                <Tabs defaultValue={categories[0]?.id} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    {categories.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="text-sm"
                        dir="rtl"
                      >
                        {category.name}
                        <Badge variant="outline" className="mr-2">
                          {productsByCategory[category.id]?.length || 0}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {categories.map((category) => (
                    <TabsContent key={category.id} value={category.id}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {productsByCategory[category.id]?.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                            onViewDetails={(product) => {
                              setSelectedProduct(product);
                              setIsDetailsOpen(true);
                            }}
                          />
                        ))}
                      </div>
                      {productsByCategory[category.id]?.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">محصولی در این دسته‌بندی یافت نشد</p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onViewDetails={(product) => {
                        setSelectedProduct(product);
                        setIsDetailsOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">محصولی با این مشخصات یافت نشد</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setFilters({
                          categories: [],
                          brands: [],
                          priceRange: [0, 100000000],
                          sortBy: 'name'
                        });
                        setSearchQuery('');
                      }}
                    >
                      حذف فیلترها
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Features />

      <Footer />

      {/* Shopping Cart */}
      <ShoppingCart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Product Details */}
      <ProductDetails
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default Index;