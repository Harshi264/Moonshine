export interface ProductVariant {
  id: string;
  name: string; // e.g. "Lavender - 150g" or "Rose Gold Foil"
  price: number;
  salePrice?: number;
  stock: number;
  sku?: string;
}

export interface CustomizationOption {
  id: string;
  label: string; // e.g., "Custom Name / Text", "Fragrance Choice", "Foil Color"
  type: 'text' | 'select' | 'color' | 'textarea';
  options?: string[]; // for 'select' type
  required: boolean;
  helpText?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // Category ID or name
  subcategory?: string;
  description: string;
  price: number; // Original price
  salePrice?: number; // Discounted price
  discountPercent?: number; // Calculated or manual discount %
  isSale?: boolean;
  images: string[];
  stock: number; // Available quantity
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
  id: string; // e.g., ORD-2026-00125
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
  rating: number; // 1 to 5
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
  targetId?: string; // Product ID or Category ID
  discountPercent: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  code?: string;
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
