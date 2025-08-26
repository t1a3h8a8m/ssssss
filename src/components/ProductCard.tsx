import { useState } from "react";
import { Eye, ShoppingCart, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-card border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isSpecialOffer && (
            <Badge className="bg-gradient-secondary text-secondary-foreground font-semibold shadow-secondary">
              فروش ویژه
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-gradient-primary text-primary-foreground font-semibold shadow-primary">
              ویژه
            </Badge>
          )}
        </div>

        {/* Discount Badge */}
        {product.discountPercentage && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-sm font-bold">
            {product.discountPercentage}% تخفیف
          </div>
        )}

        {/* Hover Actions */}
        <div className={`absolute inset-0 bg-primary/80 flex items-center justify-center gap-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(product)}
            className="bg-card text-card-foreground hover:shadow-glow transition-all duration-300"
          >
            <Eye className="w-4 h-4 ml-2" />
            نمایش جزئیات
          </Button>
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 right-3 bg-warning text-warning-foreground px-2 py-1 rounded text-xs font-medium">
            تنها {product.stock} عدد باقی مانده
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute bottom-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
            ناموجود
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-card-foreground" dir="rtl">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground" dir="rtl">
            برند: {product.brand}
          </p>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1" dir="rtl">
            <Star className="w-3 h-3 fill-warning text-warning" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount} نظر)
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="space-y-1" dir="rtl">
          {product.isContactPrice ? (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                تماس بگیرید
              </span>
            </div>
          ) : (
            <>
              {product.originalPrice && product.discountPercentage ? (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                  <div className="text-sm font-bold text-primary">
                    {formatPrice(calculateDiscountedPrice())}
                  </div>
                </div>
              ) : (
                <div className="text-sm font-bold text-primary">
                  {formatPrice(product.price || 0)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0 || product.isContactPrice}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 disabled:opacity-50"
          size="sm"
        >
          {product.isContactPrice ? (
            <>
              <Phone className="w-4 h-4 ml-2" />
              تماس برای قیمت
            </>
          ) : product.stock === 0 ? (
            'ناموجود'
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 ml-2" />
              افزودن به سبد
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}