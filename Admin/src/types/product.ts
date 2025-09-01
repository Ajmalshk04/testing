export interface Product {
  _id: string;
  name: string;
  description: string;
  sku: string;
  category: Category;
  price: number;
  salePrice?: number;
  cost: number;
  stock: Stock;
  images: ProductImage[];
  specifications: Specification[];
  dimensions?: Dimensions;
  weight?: number;
  tags: string[];
  status: ProductStatus;
  visibility: ProductVisibility;
  seoData?: SEOData;
  variants?: ProductVariant[];
  reviews: ReviewSummary;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stock {
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  reorderPoint: number;
  reserved: number;
  available: number;
  location?: string;
  warehouse?: string;
  lastRestocked?: Date;
  supplier?: Supplier;
}

export interface ProductImage {
  _id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface Specification {
  _id: string;
  name: string;
  value: string;
  unit?: string;
  category?: string;
  isRequired: boolean;
  sortOrder: number;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in' | 'm' | 'ft';
}

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  slug: string;
  metaImage?: string;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: Stock;
  attributes: VariantAttribute[];
  isDefault: boolean;
  isActive: boolean;
}

export interface VariantAttribute {
  name: string;
  value: string;
  type: 'color' | 'size' | 'material' | 'style' | 'custom';
  displayValue?: string;
  hexColor?: string;
  image?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface Supplier {
  _id: string;
  name: string;
  contactEmail: string;
  contactPhone?: string;
  address?: Address;
  website?: string;
  isActive: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived' | 'discontinued';
export type ProductVisibility = 'public' | 'private' | 'hidden';

// Order Management Types
export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  notes?: string;
  tags?: string[];
  timeline: OrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInfo {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isGuest: boolean;
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface OrderItem {
  _id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  tax?: number;
  image?: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  provider?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  transactionId?: string;
}

export interface ShippingMethod {
  _id: string;
  name: string;
  carrier: string;
  service: string;
  cost: number;
  estimatedDays: number;
  trackingNumber?: string;
}

export interface OrderTimeline {
  _id: string;
  status: OrderStatus | PaymentStatus | ShippingStatus;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'returned';
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'cancelled' | 'refunded';
export type ShippingStatus = 'pending' | 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'returned' | 'lost';

// Inventory Types
export interface InventoryMovement {
  _id: string;
  productId: string;
  variantId?: string;
  type: MovementType;
  quantity: number;
  reason: string;
  reference?: string;
  cost?: number;
  location?: string;
  userId: string;
  userName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type MovementType = 'in' | 'out' | 'adjustment' | 'transfer' | 'return' | 'damaged' | 'expired';

export interface InventoryAlert {
  _id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  alertType: AlertType;
  currentStock: number;
  threshold: number;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
}

export type AlertType = 'low_stock' | 'out_of_stock' | 'overstock' | 'reorder_point' | 'expiring_soon';

// Analytics Types
export interface ProductAnalytics {
  productId: string;
  metrics: {
    views: number;
    sales: number;
    revenue: number;
    profit: number;
    conversionRate: number;
    averageOrderValue: number;
    returnRate: number;
    reviewScore: number;
  };
  trends: {
    period: 'day' | 'week' | 'month' | 'year';
    data: {
      date: string;
      views: number;
      sales: number;
      revenue: number;
    }[];
  };
  topVariants?: {
    variantId: string;
    variantName: string;
    sales: number;
    revenue: number;
  }[];
}

export interface DashboardMetrics {
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    revenue: number;
  };
  inventory: {
    totalValue: number;
    totalItems: number;
    alerts: number;
    movements: number;
  };
  performance: {
    topProducts: {
      productId: string;
      name: string;
      sales: number;
      revenue: number;
    }[];
    topCategories: {
      categoryId: string;
      name: string;
      sales: number;
      revenue: number;
    }[];
  };
}

// Filter and Search Types
export interface ProductFilters {
  search?: string;
  category?: string;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  priceMin?: number;
  priceMax?: number;
  stockMin?: number;
  stockMax?: number;
  tags?: string[];
  supplier?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  customerId?: string;
  totalMin?: number;
  totalMax?: number;
  createdAfter?: Date;
  createdBefore?: Date;
  sortBy?: 'orderNumber' | 'total' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}