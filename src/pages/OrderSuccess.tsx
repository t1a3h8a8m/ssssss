import { useNavigate } from "react-router-dom";
import { Check, ShoppingBag, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl" dir="rtl">سفارش شما ثبت شد!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center" dir="rtl">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              سفارش شما با موفقیت در سیستم ثبت گردید.
            </p>
            <p className="text-sm text-muted-foreground">
              کارشناسان ما در اسرع وقت با شما تماس گرفته و جزئیات ارسال را اعلام خواهند کرد.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold flex items-center gap-2 justify-center">
              <Phone className="w-4 h-4" />
              راه‌های تماس
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-3 h-3" />
                <span>021-88776655</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-3 h-3" />
                <span>info@santigradstore.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4 ml-2" />
              بازگشت به فروشگاه
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = 'tel:02188776655'}
              className="w-full"
            >
              <Phone className="w-4 h-4 ml-2" />
              تماس فوری
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}