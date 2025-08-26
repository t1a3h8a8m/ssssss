import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, Phone, Check, X } from "lucide-react";
import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetails({ product, isOpen, onClose, onAddToCart }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('IRR', 'تومان');
  };

  const calculateDiscountedPrice = () => {
    if (product.originalPrice && product.discountPercentage) {
      return product.originalPrice - (product.originalPrice * product.discountPercentage / 100);
    }
    return product.price || 0;
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gradient-card">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {product.isSpecialOffer && (
                  <Badge className="bg-gradient-secondary text-secondary-foreground">
                    فروش ویژه
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    محصول ویژه
                  </Badge>
                )}
                {product.discountPercentage && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    {product.discountPercentage}% تخفیف
                  </Badge>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-card-foreground">{product.name}</h2>
                <p className="text-muted-foreground mt-1">برند: {product.brand}</p>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!) 
                            ? 'fill-warning text-warning' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} نظر)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <Card>
              <CardContent className="p-4">
                {product.isContactPrice ? (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-lg font-bold text-primary">تماس بگیرید</div>
                      <div className="text-sm text-muted-foreground">برای استعلام قیمت</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {product.originalPrice && product.discountPercentage ? (
                      <>
                        <div className="text-sm text-muted-foreground line-through">
                          قیمت اولیه: {formatPrice(product.originalPrice)}
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(calculateDiscountedPrice())}
                        </div>
                        <div className="text-sm text-success">
                          شما {formatPrice(product.originalPrice - calculateDiscountedPrice())} صرفه‌جویی کردید
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(product.price || 0)}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-success">موجود در انبار ({product.stock} عدد)</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-destructive" />
                  <span className="text-destructive">ناموجود</span>
                </>
              )}
            </div>

            {/* Add to Cart */}
            <Button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0 || product.isContactPrice}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              {product.isContactPrice ? (
                <>
                  <Phone className="w-5 h-5 ml-2" />
                  تماس برای سفارش
                </>
              ) : product.stock === 0 ? (
                'ناموجود'
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  افزودن به سبد خرید
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">توضیحات</TabsTrigger>
              <TabsTrigger value="specifications">مشخصات فنی</TabsTrigger>
              <TabsTrigger value="reviews">نظرات</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-card-foreground leading-relaxed">
                    {product.description}
                  </p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">برچسب‌ها:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-border pb-2">
                        <span className="font-medium text-card-foreground">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p>بخش نظرات به زودی اضافه خواهد شد</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}