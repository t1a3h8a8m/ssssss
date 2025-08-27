import { Eye, ShoppingCart, Phone } from "lucide-react";
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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const calculateDiscountedPrice = () => {
    if (product.originalPrice && product.discountPercentage) {
      return product.originalPrice - (product.originalPrice * product.discountPercentage / 100);
    }
    return product.price || 0;
  };

  const finalPrice = calculateDiscountedPrice();

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(product)}
          >
            <Eye className="w-4 h-4 ml-2" />
            مشاهده جزئیات
          </Button>
        </div>

        {product.discountPercentage && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            {product.discountPercentage}%
          </Badge>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex-grow space-y-2">
          <p className="text-xs text-muted-foreground" dir="rtl">{product.brand}</p>
          <h3 className="font-semibold text-base leading-tight line-clamp-2 text-foreground" dir="rtl">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 space-y-2" dir="rtl">
          {product.isContactPrice ? (
            <div className="flex items-center gap-2 h-10">
              <span className="text-sm font-semibold text-primary">
                برای قیمت تماس بگیرید
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-start h-10">
              {product.originalPrice && product.discountPercentage ? (
                <>
                  <p className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                  <p className="text-base font-bold text-foreground">
                    {formatPrice(finalPrice)}
                  </p>
                </>
              ) : (
                <p className="text-base font-bold text-foreground">
                  {formatPrice(product.price || 0)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full"
            variant={product.stock === 0 ? "secondary" : "default"}
          >
            {product.isContactPrice ? (
              <>
                <Phone className="w-4 h-4 ml-2" />
                تماس
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
        </div>
      </CardContent>
    </Card>
  );
}