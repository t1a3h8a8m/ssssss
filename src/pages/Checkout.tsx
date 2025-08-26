import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, Banknote, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CartItem, CheckoutData } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface CheckoutProps {
  items: CartItem[];
  onOrderComplete: (orderData: CheckoutData) => void;
}

export default function Checkout({ items, onOrderComplete }: CheckoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CheckoutData>({
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    shippingAddress: {
      address: '',
      city: '',
      postalCode: '',
      state: ''
    },
    paymentMethod: 'cash',
    totalAmount: 0,
    items: items
  });

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = totalPrice > 5000000 ? 0 : 300000; // Free shipping over 5M
  const finalTotal = totalPrice + shippingCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('IRR', 'تومان');
  };

  const handleInputChange = (section: 'customerInfo' | 'shippingAddress', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const { customerInfo, shippingAddress } = formData;
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone) {
      toast({
        title: "خطا",
        description: "لطفاً اطلاعات ضروری را کامل کنید",
        variant: "destructive"
      });
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city) {
      toast({
        title: "خطا", 
        description: "لطفاً آدرس تحویل را کامل کنید",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      ...formData,
      totalAmount: finalTotal
    };

    onOrderComplete(orderData);
    
    toast({
      title: "سفارش ثبت شد",
      description: "سفارش شما با موفقیت ثبت گردید. در اسرع وقت با شما تماس خواهیم گرفت.",
      variant: "default"
    });

    navigate('/order-success');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">سبد خرید خالی است</h1>
          <Button onClick={() => navigate('/')}>
            بازگشت به فروشگاه
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8" dir="rtl">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">تکمیل خرید</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info & Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">اطلاعات خریدار</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" dir="rtl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">نام *</Label>
                    <Input
                      id="firstName"
                      value={formData.customerInfo.firstName}
                      onChange={(e) => handleInputChange('customerInfo', 'firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">نام خانوادگی *</Label>
                    <Input
                      id="lastName"
                      value={formData.customerInfo.lastName}
                      onChange={(e) => handleInputChange('customerInfo', 'lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره موبایل *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.customerInfo.phone}
                      onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customerInfo.email}
                      onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">آدرس تحویل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" dir="rtl">
                <div className="space-y-2">
                  <Label htmlFor="address">آدرس کامل *</Label>
                  <Input
                    id="address"
                    value={formData.shippingAddress.address}
                    onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">شهر *</Label>
                    <Input
                      id="city"
                      value={formData.shippingAddress.city}
                      onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">استان</Label>
                    <Input
                      id="state"
                      value={formData.shippingAddress.state}
                      onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">کد پستی</Label>
                    <Input
                      id="postalCode"
                      value={formData.shippingAddress.postalCode}
                      onChange={(e) => handleInputChange('shippingAddress', 'postalCode', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">روش پرداخت</CardTitle>
              </CardHeader>
              <CardContent dir="rtl">
                <RadioGroup 
                  value={formData.paymentMethod} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      پرداخت نقدی در محل تحویل
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="bank-transfer" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      انتقال بانکی
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      پرداخت با کارت (درگاه بانک)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm" dir="rtl">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">{item.quantity} × {formatPrice(item.price)}</div>
                      </div>
                      <div className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm" dir="rtl">
                  <div className="flex justify-between">
                    <span>جمع کالاها:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>هزینه ارسال:</span>
                    <span className={shippingCost === 0 ? "text-success" : ""}>
                      {shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {shippingCost === 0 && (
                    <div className="text-xs text-success flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      ارسال رایگان برای خرید بالای 5 میلیون تومان
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg" dir="rtl">
                  <span>مجموع نهایی:</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  size="lg"
                >
                  ثبت نهایی سفارش
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-success/20 bg-success/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-success" dir="rtl">
                  <Check className="w-4 h-4" />
                  <span>خرید امن و مطمئن</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1" dir="rtl">
                  تمامی اطلاعات شما محرمانه بوده و هیچ‌گاه در اختیار اشخاص ثالث قرار نخواهد گرفت.
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}