'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { Product, SupabaseProductResponse } from '@/types';

export async function adminGetProductsAction() {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return [] as Product[];
  
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      product_images(image_url),
      categories(name_ar)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return ((data as unknown) as SupabaseProductResponse[] || []).map((item) => ({
    ...item,
    category: item.categories,
    images: item.product_images?.map((img) => img.image_url) || []
  })) as Product[];
}

export async function adminUpsertProductAction(product: Partial<Product>, imageFiles: string[]) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) throw new Error('Supabase client not initialized');
  
  const { id, name, description, price, discount, category_id, in_stock, slug } = product;

  // 1. Upsert product
  const { data: prodData, error: prodError } = await supabaseAdmin
    .from('products')
    .upsert({
      id,
      name,
      description,
      price,
      discount,
      category_id,
      in_stock,
      slug: slug || name?.toLowerCase().replace(/[\s\W]+/g, '-')
    })
    .select()
    .single();

  if (prodError) throw new Error(prodError.message);

  // 2. Handle images
  if (prodData && imageFiles.length > 0) {
    await supabaseAdmin.from('product_images').delete().eq('product_id', prodData.id);

    const imageData = imageFiles.map(url => ({
      product_id: prodData.id,
      image_url: url
    }));

    const { error: imgError } = await supabaseAdmin.from('product_images').insert(imageData);
    if (imgError) throw new Error(imgError.message);
  }

  return prodData;
}

export async function adminDeleteProductAction(id: string) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) throw new Error('Supabase client not initialized');
  
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function adminToggleStockAction(id: string, inStock: boolean) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) throw new Error('Supabase client not initialized');
  
  const { error } = await supabaseAdmin
    .from('products')
    .update({ in_stock: inStock })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
