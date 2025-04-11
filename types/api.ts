export interface UserObject {
  name?: string | null;
  email?: string | null;
  id?: string;
  role?: string;
  type?: string;
  phone?: string;
}

export interface ServerToken {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterLoginResponse {
  message: string;
  user: UserObject;
  tokens: ServerToken;
}

export interface Category {
  id: string;
  name: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface ProductVariantTypes {
  type: string;
  price: number;
  metadata: Record<string, any>;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: string;
  price: string;
  image_url: string;
  color_hex_code: string;
  slug: string;
  ui_cart_quantity?: number;
}

export interface ProductResponse {
  product_id: string;
  product_name: string;
  image_url: string;
  variants: ProductVariant[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
  created_at: string;
  metadata: Record<string, any>;
  color?: string;
  variant_id: string;
}

export interface Variant {
  id: string;
  color?: string;
  price?: string;
  stock?: number;
  image_url?: string;
  is_default?: boolean;
  is_selected?: boolean;
  color_hex_code: string;
  metadata?: VariantMetaData;
}

export type ProductVariantType = "window" | "door";

export interface VariantSize {
  id: ProductVariantType;
  label: string;
  price: string;
}

export interface VariantMetaData {
  sizes: VariantSize[];
}

export interface ProductVariantDetails {
  description: string;
  metadata: Record<string, any>;
  name: string;
  variants: ProductVariant[];
}

export interface CartItems {
  cart_id: string;
  quantity: number;
  color: string;
  color_hex_code: string;
  price: number;
  image_url: string;
  metadata: Record<string, any>;
  type: string;
  variant_id: string;
}

export interface ViewCartResponse {
  cartItems: CartItems[];
}

export interface OrderItem {
  id: string;
  name: string;
  product_variant_id: string;
  quantity: number;
  price: number;
  image_url: string;
  product_name: string;
  type: string;
  product_id: string;
  slug: string;
}

export interface TrackingStatus {
  date: string;
  notes?: string;
  status: string;
  isCompleted?: boolean;
}

export interface OrderResponse {
  id: string;
  status: string;
  total_amount: number;
  order_token: string;
  order_items: OrderItem[];
  order_tracking_statuses: TrackingStatus[];
}

export type StateOption = { value: string; label: string };
export type CityOption = { value: string; label: string };

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  landmark?: string;
  type?: string;
};
