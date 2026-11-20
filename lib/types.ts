export interface CartItem {
  id: string; // unique item key (productId + variantId)
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  quantity: number;
  variantId?: string | null;
  variantName?: string | null;
  sku: string;
  maxStock: number;
}

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discountType?: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value?: number;
  discountAmount?: number;
  message?: string;
}

export interface ShippingRate {
  city: string;
  rate: number;
  estimatedDays: string;
  freeShippingThreshold?: number | null;
}
