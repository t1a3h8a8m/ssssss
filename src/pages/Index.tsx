import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Zap, Shield, Truck } from "lucide-react";
import { Header as Header } from "../../../src/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilter } from "@/components/ProductFilter";
import { ProductDetails } from "@/components/ProductDetails";
import { ShoppingCart } from "@/components/ShoppingCart";
import { Product, CartItem, FilterOptions, Category } from "@/types/product";
import { useSharedCart } from "../../../src/utils/cartUtils";
import productsData from "@/data/products.json";
import { useToast } from "@/hooks/use-toast";
import heroBackground from "@/assets/hero-background.jpg";

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

      {/* Hero Section */}
      <section 
        className="bg-gradient-hero text-white py-20 relative overflow-hidden bg-cover bg-center bg-no-repeat mt-16 sm:mt-20"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-secondary text-secondary-foreground px-4 py-2 text-sm font-semibold">
                بزرگترین مرکز فروش قطعات کولر سلولزی
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight" dir="rtl">
                سانتی گراد استور
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed" dir="rtl">
                مرکز تخصصی فروش پکیج‌ها و قطعات یدکی کولر سلولزی
                <br />
                با بهترین کیفیت و قیمت‌های مناسب
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary-light text-secondary-foreground px-8 py-3 text-lg font-semibold hover:shadow-secondary transition-all duration-300"
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="w-5 h-5 ml-2" />
                مشاهده محصولات
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg"
                onClick={() => window.location.href = 'tel:02188776655'}
              >
                تماس برای مشاوره
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold text-lg mb-2">گارانتی معتبر</h3>
                <p className="text-sm text-white/80">تمام محصولات دارای گارانتی معتبر</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Truck className="w-12 h-12 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold text-lg mb-2">ارسال سریع</h3>
                <p className="text-sm text-white/80">ارسال رایگان برای خریدهای بالای 5 میلیون</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <Star className="w-12 h-12 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold text-lg mb-2">کیفیت برتر</h3>
                <p className="text-sm text-white/80">محصولات اورجینال با بالاترین کیفیت</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-16">
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
      </section>

      {/* Footer */}
      <footer className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right" dir="rtl">
            <div>
              <h3 className="font-bold text-lg mb-4">سانتی گراد استور</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                بیش از ده سال تجربه در زمینه فروش و نصب کولرهای سلولزی
                با بهترین کیفیت و خدمات پس از فروش
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">تماس با ما</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>📞 021-88776655</p>
                <p>📧 info@santigradstore.com</p>
                <p>📍 تهران، میدان انقلاب، خیابان کریمخان زند</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">خدمات ما</h3>
              <div className="space-y-2 text-sm text-white/80">
                <p>• فروش پکیج‌های کولر سلولزی</p>
                <p>• قطعات یدکی اورجینال</p>
                <p>• مشاوره و نصب</p>
                <p>• خدمات پس از فروش</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center">
            <p className="text-sm text-white/60">
              © 2024 سانتی گراد استور. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </footer>

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