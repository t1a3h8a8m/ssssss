import { useState, useEffect } from "react";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterOptions, Category, Product } from "@/types/product";

interface ProductFilterProps {
  products: Product[];
  categories: Category[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ProductFilter({
  products,
  categories,
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange
}: ProductFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange);
  
  // Get unique brands from products
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();
  
  // Calculate min and max prices
  const productsWithPrice = products.filter(p => !p.isContactPrice && p.price);
  const minPrice = productsWithPrice.length > 0 ? Math.min(...productsWithPrice.map(p => p.price!)) : 0;
  const maxPrice = productsWithPrice.length > 0 ? Math.max(...productsWithPrice.map(p => p.price!)) : 100000000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, priceRange });
    }, 300);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    onFiltersChange({ ...filters, categories: updatedCategories });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const updatedBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    onFiltersChange({ ...filters, brands: updatedBrands });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      brands: [],
      priceRange: [minPrice, maxPrice],
      inStock: undefined,
      specialOffers: undefined,
      contactPrice: undefined,
      sortBy: 'name'
    });
    setPriceRange([minPrice, maxPrice]);
    onSearchChange('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) count++;
    if (filters.inStock !== undefined) count++;
    if (filters.specialOffers !== undefined) count++;
    if (filters.contactPrice !== undefined) count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="جستجو در محصولات..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
          dir="rtl"
        />
      </div>

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">مرتب‌سازی</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={filters.sortBy}
            onValueChange={(value: any) => onFiltersChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">نام محصول</SelectItem>
              <SelectItem value="price-asc">قیمت (کم به زیاد)</SelectItem>
              <SelectItem value="price-desc">قیمت (زیاد به کم)</SelectItem>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="popularity">محبوب‌ترین</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
                <Badge variant="outline" className="text-xs">
                  {category.productCount}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">برند</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand, checked as boolean)
                  }
                />
                <label 
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">محدوده قیمت</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange as any}
              max={maxPrice}
              min={minPrice}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground" dir="rtl">
              <span>{formatPrice(priceRange[0])} تومان</span>
              <span>{formatPrice(priceRange[1])} تومان</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">گزینه‌های ویژه</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="in-stock"
                checked={filters.inStock || false}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, inStock: checked as boolean || undefined })
                }
              />
              <label htmlFor="in-stock" className="text-sm font-medium">
                فقط کالاهای موجود
              </label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="special-offers"
                checked={filters.specialOffers || false}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, specialOffers: checked as boolean || undefined })
                }
              />
              <label htmlFor="special-offers" className="text-sm font-medium">
                فقط فروش‌های ویژه
              </label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="contact-price"
                checked={filters.contactPrice || false}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, contactPrice: checked as boolean || undefined })
                }
              />
              <label htmlFor="contact-price" className="text-sm font-medium">
                تماس برای قیمت
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <Button 
          onClick={clearFilters} 
          variant="outline" 
          className="w-full"
        >
          <X className="w-4 h-4 ml-2" />
          حذف همه فیلترها
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden lg:block w-80 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            فیلتر محصولات
          </h2>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFiltersCount()} فیلتر فعال
            </Badge>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <SlidersHorizontal className="w-4 h-4 ml-2" />
              فیلتر و مرتب‌سازی
              {getActiveFiltersCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-right">فیلتر و مرتب‌سازی</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}