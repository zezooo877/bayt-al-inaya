import { getSupabase } from '@/lib/supabase';
import { Product, Category, SupabaseProductResponse } from '@/types';

export const getCategories = async (): Promise<Category[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name_ar', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
};

export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];
  let query = supabase
    .from('products')
    .select(`
      *,
      product_images(image_url)
    `)
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  const typedData = (data as unknown) as SupabaseProductResponse[];

  return (typedData || []).map((item) => ({
    ...item,
    images: item.product_images?.map((img) => img.image_url) || []
  }));
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images(image_url),
      categories(name_ar, name_en)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  const item = (data as unknown) as SupabaseProductResponse;

  return {
    ...item,
    category: item.categories,
    images: item.product_images?.map((img) => img.image_url) || []
  };
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images(image_url)
    `)
    .ilike('name', `%${query}%`)
    .eq('in_stock', true);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  const typedData = (data as unknown) as SupabaseProductResponse[];

  return (typedData || []).map((item) => ({
    ...item,
    images: item.product_images?.map((img) => img.image_url) || []
  }));
};
