export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  sku?: string;
}

export interface CustomizationOption {
  id: string;
  label: string;
  type: 'text' | 'select' | 'color' | 'textarea';
  options?: string[];
  required: boolean;
  helpText?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  salePrice?: number;
  discountPercent?: number;
  isSale?: boolean;
  images: string[];
  stock: number;
  variants?: ProductVariant[];
  dimensions?: string;
  weight?: string;
  materials?: string;
  fragranceInfo?: string;
  colorOptions?: string[];
  customizationFields?: CustomizationOption[];
  careInstructions?: string;
  shippingInfo?: string;
  tags?: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  status: 'active' | 'out_of_stock' | 'hidden';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  customizationDetails?: Record<string, string>;
}

export type OrderStatus =
  | 'New'
  | 'Contacted'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string; // e.g. ORD-2026-00125
  customerId?: string;
  customerName: string;
  phone: string;
  email: string;
  instagramUsername?: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  totalAmount: number;
  customerNotes?: string;
  giftMessage?: string;
  preferredContact?: 'Phone' | 'WhatsApp' | 'Email' | 'Instagram';
  status: OrderStatus;
  internalNotes?: string;
  statusHistory?: { status: OrderStatus; timestamp: string; note?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  orderId?: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  isFeatured?: boolean;
  createdAt: string;
}

export interface Discount {
  id: string;
  title: string;
  targetType: 'product' | 'category' | 'all';
  targetId?: string;
  discountPercent: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  code?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email?: string;
  phone: string;
  savedAddress?: {
    deliveryAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  currency: string;
  currencySymbol: string;
  address: string;
  freeShippingThreshold: number;
  defaultShippingFee: number;
  smtpEmail?: string;
  smtpPassword?: string;
  smtpHost?: string;
  smtpPort?: number;
  adminPasswordHash?: string;
}
