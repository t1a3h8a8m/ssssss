export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price?: number;
  originalPrice?: number;
  discountPercentage?: number;
  isSpecialOffer?: boolean;
  isFeatured?: boolean;
  isContactPrice?: boolean;
  image: string;
  images?: string[];
  description: string;
  specifications: Record<string, string>;
  stock: number;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock?: boolean;
  specialOffers?: boolean;
  contactPrice?: boolean;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest' | 'popularity';
}

export interface CheckoutData {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    state: string;
  };
  paymentMethod: 'cash' | 'card' | 'bank-transfer';
  totalAmount: number;
  items: CartItem[];
}