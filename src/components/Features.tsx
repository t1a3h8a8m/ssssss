import { Shield, Star, Truck } from "lucide-react";

export const Features = () => {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-lg mb-2">گارانتی معتبر</h3>
            <p className="text-sm text-muted-foreground">تمام محصولات دارای گارانتی معتبر و شرکتی هستند.</p>
          </div>
          <div className="text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-lg mb-2">ارسال سریع</h3>
            <p className="text-sm text-muted-foreground">ارسال فوری به سراسر کشور در کمترین زمان ممکن.</p>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-lg mb-2">کیفیت برتر</h3>
            <p className="text-sm text-muted-foreground">تضمین اصالت و کیفیت تمامی محصولات عرضه شده.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
