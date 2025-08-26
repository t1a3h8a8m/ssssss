import { useState } from "react";
import { ShoppingCart, Menu, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  cartItemsCount: number;
  onCartOpen: () => void;
  categories: Array<{id: string; name: string; slug: string}>;
  onCategoryClick: (categoryId: string) => void;
}

export function Header({ cartItemsCount, onCartOpen, categories, onCategoryClick }: HeaderProps) {
  return (
    <header className="bg-gradient-hero text-white shadow-elegant sticky top-0 z-50">

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-secondary">س</span>
            </div>
            <div dir="rtl">
              <h1 className="text-xl font-bold">سانتی گراد استور</h1>
              <p className="text-xs text-white/80">مرکز فروش قطعات کولر سلولزی</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" dir="rtl">
            <Button 
              variant="ghost" 
              className="text-white hover:text-secondary hover:bg-white/10"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              صفحه اصلی
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="text-white hover:text-secondary hover:bg-white/10"
                onClick={() => onCategoryClick(category.id)}
              >
                {category.name}
              </Button>
            ))}
            <Button 
              variant="ghost" 
              className="text-white hover:text-secondary hover:bg-white/10"
            >
              درباره ما
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-secondary hover:bg-white/10"
            >
              تماس با ما
            </Button>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Button
              variant="secondary"
              size="icon"
              onClick={onCartOpen}
              className="relative bg-white/10 hover:bg-white/20 border-white/20"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-secondary">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="lg:hidden bg-white/10 hover:bg-white/20 border-white/20"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-right" dir="rtl">منوی اصلی</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-4" dir="rtl">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    صفحه اصلی
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onCategoryClick(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    درباره ما
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    تماس با ما
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}