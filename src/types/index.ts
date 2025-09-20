export interface ProductVariant {
  id: string;
  color: string;
  colorHex?: string;
  images: string[];
  price?: number; // Optional price override for this variant
  originalPrice?: number;
  inStock: boolean;
  sku?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string; // Main/default image
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
  variants?: ProductVariant[]; // Optional variants for colors/styles
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'seller' | 'admin';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  shippingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}