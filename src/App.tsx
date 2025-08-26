import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
import { CartItem, CheckoutData } from "@/types/product";

const queryClient = new QueryClient();

function CheckoutWrapper() {
  const location = useLocation();
  const cartItems = (location.state?.items as CartItem[]) || [];
  
  const handleOrderComplete = (orderData: CheckoutData) => {
    console.log('Order completed:', orderData);
    // Here you would typically send to backend
  };

  return <Checkout items={cartItems} onOrderComplete={handleOrderComplete} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkout" element={<CheckoutWrapper />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
