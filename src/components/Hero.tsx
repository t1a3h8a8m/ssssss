import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="bg-secondary/50 py-20 md:py-32 mt-16 sm:mt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground" dir="rtl">
            فروشگاه تخصصی قطعات کولر
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" dir="rtl">
            مرکز جامع تامین و فروش پکیج‌ها و قطعات یدکی کولرهای سلولزی با ضمانت اصالت و بهترین قیمت.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="px-8 py-3 text-lg font-semibold"
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Zap className="w-5 h-5 ml-2" />
              مشاهده محصولات
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
