export interface Category {
  id: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  icon_url?: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  category_id: string;
  in_stock: boolean;
  slug: string;
  created_at?: string;
  category?: {
    name_ar: string;
    name_en: string | null;
  };
  images?: string[]; // Simplified for ease of use in UI
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_name: string | null;
  phone: string | null;
  total_price: number;
  order_data: Record<string, unknown>; // More specific than any
  created_at?: string;
}

export type CartItem = Product & { quantity: number };

export interface SupabaseProductResponse extends Omit<Product, 'category' | 'images'> {
  product_images?: { image_url: string }[];
  categories?: { name_ar: string; name_en: string | null };
}
